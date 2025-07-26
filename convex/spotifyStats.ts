import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

export const saveSpotifyStats = mutation({
  args: {
    userId: v.id("users"),
    totalTracks: v.number(),
    totalArtists: v.number(),
    totalPlaylists: v.number(),
    totalHoursListened: v.number(),
    topArtist: v.string(),
    topTrack: v.string(),
    topTrackArtist: v.string(),
    topTrackCover: v.string(),
    topArtistCover: v.string(),
    topArtistCovers: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...stats } = args;
    const now = Date.now();
    
    // Check if stats already exist for this user
    const existingStats = await ctx.db
      .query("spotifyStats")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .first();

    if (existingStats) {
      // Update existing stats
      await ctx.db.patch(existingStats._id, {
        ...stats,
        updatedAt: now,
      });
      return existingStats._id;
    } else {
      // Create new stats record
      return await ctx.db.insert("spotifyStats", {
        userId,
        ...stats,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

export const getUserSpotifyStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("spotifyStats")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .first();
  },
});

export const getSpotifyStats = action({
  args: { accessToken: v.string(), userId: v.id("users") },
  handler: async (ctx, { accessToken, userId }) => {
    try {
      // console.log("🔁 Starting Spotify stats collection...");

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };

      // Helper: Fetch wrapper with logs
      const fetchWithLog = async (label: string, url: string): Promise<any> => {
        // console.log(`📡 Fetching ${label}...`);
        const res = await fetch(url, { headers });
        if (!res.ok) {
          // console.error(`❌ Failed to fetch ${label}`, await res.text());
          return null;
        }
        return res.json();
      };

      // 1️⃣ Top Tracks
      const trackTimeRanges = ["long_term", "medium_term", "short_term"];
      let tracksData: any = null;
      for (const range of trackTimeRanges) {
        const data = await fetchWithLog(
          `top tracks (${range})`,
          `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${range}`
        );
        if (!data) {
          return null;
        }
        if (data.items.length > 0) {
          tracksData = data;
          // console.log(`✅ Got ${data.items.length} top tracks from ${range}`);
          break;
        }
      }

      const tracks = tracksData?.items ?? [];
      const topTrack = tracks[0]?.name ?? "Unknown Track";
      const topTrackArtist = tracks[0]?.artists?.[0]?.name ?? "Unknown Artist";
      const topTrackCover = tracks[0]?.album?.images?.[0]?.url ?? "";

      // Get ALL saved tracks to get accurate count
      let allSavedTracks: any[] = [];
      let nextSavedUrl = "https://api.spotify.com/v1/me/tracks?limit=50";
      
      while (nextSavedUrl && allSavedTracks.length < 10000) { // Cap at 10k to avoid infinite loops
        const savedData = await fetchWithLog(
          `saved tracks (${Math.floor(allSavedTracks.length / 50) + 1})`,
          nextSavedUrl
        );
        
        if (savedData?.items) {
          allSavedTracks = [...allSavedTracks, ...savedData.items];
          nextSavedUrl = savedData.next;
        } else {
          break;
        }
      }

      const totalTracks = allSavedTracks.length;

      // Calculate unique artists from ALL saved tracks
      const uniqueArtists = new Set();
      allSavedTracks.forEach((item: any) => {
        item.track.artists.forEach((artist: any) => {
          uniqueArtists.add(artist.id);
        });
      });
      const totalArtists = uniqueArtists.size;

      // Get ALL recently played tracks (up to Spotify's limit) for better time estimation
      let allRecentTracks: any[] = [];
      let nextRecentUrl = "https://api.spotify.com/v1/me/player/recently-played?limit=50";
      
      for (let i = 0; i < 10 && nextRecentUrl; i++) { // Get up to 500 recent tracks
        const recentData = await fetchWithLog(
          `recently played (page ${i + 1})`,
          nextRecentUrl
        );
        
        if (recentData?.items) {
          allRecentTracks = [...allRecentTracks, ...recentData.items];
          nextRecentUrl = recentData.next;
        } else {
          break;
        }
      }

      // Calculate total listening time from recent tracks with more sophisticated estimation
      const recentMs = allRecentTracks.reduce(
        (sum: number, item: any) => sum + item.track.duration_ms,
        0
      );

      let estimatedHoursListened = Math.round(recentMs / (1000 * 60 * 60));

      // Get time span of recent tracks to calculate daily average
      if (allRecentTracks.length > 0) {
        const oldestTrack = allRecentTracks[allRecentTracks.length - 1];
        const newestTrack = allRecentTracks[0];
        const timeSpanMs = new Date(newestTrack.played_at).getTime() - new Date(oldestTrack.played_at).getTime();
        const timeSpanDays = timeSpanMs / (1000 * 60 * 60 * 24);
        
        if (timeSpanDays > 0) {
          const dailyMs = recentMs / timeSpanDays;
          const estimatedMonthlyMs = dailyMs * 30;
          estimatedHoursListened = Math.round(estimatedMonthlyMs / (1000 * 60 * 60));
          // console.log(`🕒 Estimated monthly hours: ${estimatedHoursListened} (based on ${timeSpanDays.toFixed(1)} days of data)`);
        }
      }

      // console.log(`🕒 Estimated hours listened: ${estimatedHoursListened}`);

      // 2️⃣ Top Artists
      const topArtistsData = await fetchWithLog(
        "top artists",
        "https://api.spotify.com/v1/me/top/artists?limit=5&time_range=long_term"
      );
      const topArtists = topArtistsData?.items ?? [];
      const topArtist = topArtists[0]?.name ?? "Unknown Artist";
      const topArtistCover = topArtists[0]?.images?.[0]?.url ?? "";
      const topArtistCovers = topArtists
        .map((a: any) => a.images?.[0]?.url)
        .filter(Boolean);

      // 3️⃣ User Playlists
      const playlistsData = await fetchWithLog(
        "playlists",
        "https://api.spotify.com/v1/me/playlists?limit=50"
      );
      const totalPlaylists = playlistsData?.items?.length ?? 0;

      // ✅ Final Result
      const result = {
        stats: {
          totalTracks,
          totalArtists,
          totalPlaylists,
          totalHoursListened: estimatedHoursListened,
        },
        topArtist,
        topArtistCover,
        topTrack,
        topTrackArtist,
        topTrackCover,
        topArtistCovers,
      };

      // console.log("🎉 All data collected successfully:", result);
      
      // Save stats to database
      await ctx.runMutation(api.spotifyStats.saveSpotifyStats, {
        userId,
        totalTracks,
        totalArtists,
        totalPlaylists,
        totalHoursListened: estimatedHoursListened,
        topArtist,
        topArtistCover,
        topTrack,
        topTrackArtist,
        topTrackCover,
        topArtistCovers,
      });

      return result;

    } catch (error) {
      console.error("🚨 Error in getSpotifyStats:", error);
      throw new Error("Something went wrong collecting Spotify stats.");
    }
  },
});
