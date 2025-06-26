import { v } from "convex/values";
import { action, mutation } from "./_generated/server";
import { api } from "./_generated/api";

// Types for Spotify API responses
type SpotifyTrack = {
  id: string;
  uri: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string; height: number; width: number }[];
  };
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
};

type SpotifySearchResponse = {
  tracks: {
    items: SpotifyTrack[];
  };
};

// Bulk search tracks from Spotify
export const bulkSearchTracks = action({
  args: {
    tracks: v.array(v.object({
      trackId: v.id("tracks"),
      title: v.string(),
      artist: v.string(),
    })),
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<{
    success: boolean;
    enrichedCount: number;
    errors: string[];
  }> => {
    const { tracks, userId } = args;
    
    // Get user's Spotify token
    const tokenData = await ctx.runQuery(api.spotifyAuth.getSpotifyTokensById, { userId });
    if (!tokenData) {
      throw new Error("User not authenticated with Spotify");
    }

    const accessToken = tokenData.accessToken;
    const errors: string[] = [];
    let enrichedCount = 0;

    // Process tracks in batches of 10 to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < tracks.length; i += batchSize) {
      const batch = tracks.slice(i, i + batchSize);
      
      for (const track of batch) {
        try {
          const searchQuery = `track:"${track.title}" artist:"${track.artist}"`;
          const url = `https://api.spotify.com/v1/search?type=track&limit=5&q=${encodeURIComponent(searchQuery)}`;

          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            errors.push(`Failed to search for track: ${track.title} by ${track.artist}`);
            continue;
          }

          const data = (await response.json()) as SpotifySearchResponse;
          const spotifyTracks = data.tracks?.items || [];

          if (spotifyTracks.length === 0) {
            errors.push(`No Spotify results found for: ${track.title} by ${track.artist}`);
            continue;
          }

          // Find the best match using fuzzy matching
          const bestMatch = findBestTrackMatch(track.title, track.artist, spotifyTracks);
          
          if (bestMatch) {
            // Update the track with Spotify data
            await ctx.runMutation(api.spotifyTrackEnrichment.updateTrackWithSpotifyData, {
              trackId: track.trackId,
              spotifyData: {
                spotifyTrackId: bestMatch.id,
                durationMs: bestMatch.duration_ms,
                album: bestMatch.album.name,
                coverUrl: bestMatch.album.images[0]?.url || null,
              },
            });
            enrichedCount++;
          } else {
            errors.push(`No suitable match found for: ${track.title} by ${track.artist}`);
          }
        } catch (error) {
          errors.push(`Error processing ${track.title}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Add delay between batches to respect rate limits
      if (i + batchSize < tracks.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return {
      success: enrichedCount > 0,
      enrichedCount,
      errors,
    };
  },
});

// Get multiple tracks by Spotify IDs (for bulk fetching)
export const bulkGetSpotifyTracks = action({
  args: {
    spotifyTrackIds: v.array(v.string()),
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<SpotifyTrack[]> => {
    const { spotifyTrackIds, userId } = args;
    
    const tokenData = await ctx.runQuery(api.spotifyAuth.getSpotifyTokensById, { userId });
    if (!tokenData) {
      throw new Error("User not authenticated with Spotify");
    }

    const accessToken = tokenData.accessToken;
    const allTracks: SpotifyTrack[] = [];

    // Spotify allows up to 50 tracks per request
    const batchSize = 50;
    for (let i = 0; i < spotifyTrackIds.length; i += batchSize) {
      const batch = spotifyTrackIds.slice(i, i + batchSize);
      const idsParam = batch.join(',');
      
      const url = `https://api.spotify.com/v1/tracks?ids=${idsParam}`;
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tracks from Spotify: ${response.statusText}`);
      }

      const data = await response.json();
      allTracks.push(...(data.tracks || []));
    }

    return allTracks.filter(track => track !== null);
  },
});

// Enrich all tracks in a playlist
export const enrichPlaylistTracks = action({
  args: {
    playlistId: v.id("playlists"),
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<{
    success: boolean;
    enrichedCount: number;
    totalTracks: number;
    errors: string[];
  }> => {
    const { playlistId, userId } = args;
    
    // Get all tracks in the playlist
    const playlistTracks = await ctx.runQuery(api.playlistActions.getPlaylistTracksFromId, { playlistId });
    
    if (!playlistTracks || playlistTracks.length === 0) {
      return {
        success: false,
        enrichedCount: 0,
        totalTracks: 0,
        errors: ["No tracks found in playlist"],
      };
    }

    // Filter tracks that don't have Spotify data yet
    const tracksToEnrich = playlistTracks.filter(track => !track.spotifyTrackId).map(track => ({
      trackId: track._id,
      title: track.title,
      artist: track.artist,
    }));

    if (tracksToEnrich.length === 0) {
      return {
        success: true,
        enrichedCount: 0,
        totalTracks: playlistTracks.length,
        errors: ["All tracks already have Spotify data"],
      };
    }

    // Enrich tracks in bulk
    const result = await ctx.runAction(api.spotifyTrackEnrichment.bulkSearchTracks, {
      tracks: tracksToEnrich,
      userId,
    });

    return {
      success: result.success,
      enrichedCount: result.enrichedCount,
      totalTracks: playlistTracks.length,
      errors: result.errors,
    };
  },
});

// Mutation to update track with Spotify data
export const updateTrackWithSpotifyData = mutation({
  args: {
    trackId: v.id("tracks"),
    spotifyData: v.object({
      spotifyTrackId: v.string(),
      durationMs: v.number(),
      album: v.string(),
      coverUrl: v.union(v.string(), v.null()),
    }),
  },
  handler: async (ctx, args) => {
    const { trackId, spotifyData } = args;
    
    await ctx.db.patch(trackId, {
      spotifyTrackId: spotifyData.spotifyTrackId,
      durationMs: spotifyData.durationMs,
      album: spotifyData.album,
      coverUrl: spotifyData.coverUrl,
    });
  },
});

// Helper function to find the best track match
function findBestTrackMatch(title: string, artist: string, spotifyTracks: SpotifyTrack[]): SpotifyTrack | null {
  const normalizeString = (str: string) => 
    str.toLowerCase()
       .replace(/[^\w\s]/g, '') // Remove special characters
       .replace(/\s+/g, ' ')    // Normalize whitespace
       .trim();

  const normalizedTitle = normalizeString(title);
  const normalizedArtist = normalizeString(artist);

  let bestMatch: SpotifyTrack | null = null;
  let bestScore = 0;

  for (const track of spotifyTracks) {
    const spotifyTitle = normalizeString(track.name);
    const spotifyArtists = track.artists.map(a => normalizeString(a.name));

    // Calculate title similarity
    const titleScore = calculateSimilarity(normalizedTitle, spotifyTitle);
    
    // Calculate artist similarity (check against all artists)
    const artistScore = Math.max(...spotifyArtists.map(sa => calculateSimilarity(normalizedArtist, sa)));
    
    // Combined score (both title and artist must be reasonably similar)
    const combinedScore = (titleScore + artistScore) / 2;
    
    // Require minimum thresholds for both title and artist
    if (titleScore >= 0.7 && artistScore >= 0.7 && combinedScore > bestScore) {
      bestScore = combinedScore;
      bestMatch = track;
    }
  }

  return bestScore >= 0.8 ? bestMatch : null;
}

// Simple string similarity function (Levenshtein-based)
function calculateSimilarity(str1: string, str2: string): number {
  const matrix: number[][] = [];
  const len1 = str1.length;
  const len2 = str2.length;

  if (len1 === 0) return len2 === 0 ? 1 : 0;
  if (len2 === 0) return 0;

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  const maxLen = Math.max(len1, len2);
  return (maxLen - matrix[len1][len2]) / maxLen;
}