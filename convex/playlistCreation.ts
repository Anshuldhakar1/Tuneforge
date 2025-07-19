import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

export const createPlaylistWithTracks = mutation({
  args: {
    token: v.string(),
    playlistName: v.string(),
    description: v.string(),
    mood: v.array(v.string()),
    spotifyTracks: v.array(v.object({
      spotifyURI: v.string(),
      trackId: v.union(v.id("tracks"), v.null()),
      searchData: v.object({
        trackName: v.string(),
        artistName: v.string(),
        aiGenres: v.optional(v.array(v.string())),
      }),
    })),
  },
  handler: async (ctx, args): Promise<Id<"playlists">> => {
    // Get user from session token
    const userId = await ctx.runQuery(api.auth.getUserBySessionToken, { token: args.token });
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Create the playlist
    const playlistId = await ctx.db.insert("playlists", {
      userId: userId,
      name: args.playlistName,
      description: args.description,
      moods: args.mood,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Add tracks to the playlist
    const playlistTrackPromises = args.spotifyTracks
      .filter(track => track.trackId !== null) // Only add successfully found tracks
      .map((track, index) => 
        ctx.db.insert("playlistTracks", {
          playlistId,
          trackId: track.trackId!,
          addedAt: Date.now(),
          addedBy: userId,
          order: index,
        })
      );

    await Promise.all(playlistTrackPromises);

    return playlistId;
  },
});

export const createPlayList = action({
    args: {
      token: v.string(),
      response: v.any(),
      playlistName: v.string(),
    },
    handler: async (ctx, args): Promise<any> => {
      
      const { token, response } = args;
      
      if (!token) {
        console.log("❌ Token is missing");
        throw new Error("Token is required");
      }

      const session = await ctx.runQuery(api.playlistCreation.getSessionByToken, { 
        token 
      });

      if (!session) {
        throw new Error("Invalid session token");
      }

      const userId = session.userId;

      const playlistId = await ctx.runMutation(api.playlistCreation.insertPlaylist, {
        userId: userId,
        name:  args.playlistName !== "" ? args.playlistName : response.playlist.name,
        description: response.playlist.description,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        spotifyPlaylistId: "",
      });

      const actualTracks: any[] = [];
      const actualTracksData = [];
      
      const len = response.playlist.total_tracks;

      for (let i = 0; i < len; i++) {

        const track = await ctx.runAction(api.spotify.getTrackFromSpotify, {
          userId,
          trackName: response.playlist.tracks[i].title,
          artistName: response.playlist.tracks[i].artist,
        });

        if (track.spotifyURI) {
          
          const trackId = await ctx.runMutation(api.playlistCreation.insertTrack, {
            title: response.playlist.tracks[i].title,
            artist: response.playlist.tracks[i].artist,
            album: response.playlist.tracks[i].album,
            genre: response.playlist.tracks[i].genre 
              ? response.playlist.tracks[i].genre.split(',').map((g: string) => g.trim())
              : [],
            durationMs: parseInt(response.playlist.tracks[i].durationMs),
            coverUrl: response.playlist.tracks[i].coverUrl,
            spotifyTrackId: track.spotifyURI,
          });

          actualTracks.push(trackId);
          actualTracksData.push({
            title: response.playlist.tracks[i].title,
            artist: response.playlist.tracks[i].artist,
            album: response.playlist.tracks[i].album,
            genre: response.playlist.tracks[i].genre 
              ? response.playlist.tracks[i].genre.split(',').map((g: string) => g.trim())
              : [],
            durationMs: parseInt(response.playlist.tracks[i].durationMs),
            coverUrl: response.playlist.tracks[i].coverUrl,
            spotifyTrackId: track.spotifyURI,
          });
        } else {
          console.log("❌ No Spotify URI found for track:", response.playlist.tracks[i].title);
          console.log(response.playlist.tracks[i].title);
          console.log(`arguments for spotify, ${JSON.stringify({
            userId,
            trackName: response.playlist.tracks[i].title,
            artistName: response.playlist.tracks[i].artist,
          })}`);
        }
      }
      console.log("🔗 Total tracks to link:", actualTracks.length);

      // Link the tracks and the playlists
      for (const trackId of actualTracks) {
        await ctx.runMutation(api.playlistCreation.insertPlaylistTrack, {
          playlistId: playlistId,
          trackId: trackId,
          addedAt: Date.now(),
          addedBy: userId,
        });
      }

      return actualTracksData;
    },
  });

export const insertPlaylist = mutation({
    args: {
      userId: v.id("users"),
      name: v.string(),
      description: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
      spotifyPlaylistId: v.string(),
    },
    handler: async (ctx, args) => {
      return await ctx.db.insert("playlists", args);
    },
  });
  
  export const insertTrack = mutation({
    args: {
      title: v.string(),
      artist: v.string(),
      album: v.optional(v.string()),
      genre: v.array(v.string()),
      durationMs: v.optional(v.number()),
      coverUrl: v.optional(v.string()),
      spotifyTrackId: v.optional(v.string()),
    },
    handler: async (ctx, args:any) => {
      return await ctx.db.insert("tracks", args);
    },
  });
  
  export const insertPlaylistTrack = mutation({
    args: {
      playlistId: v.id("playlists"),  
      trackId: v.id("tracks"),      
      addedAt: v.number(),
      addedBy: v.id("users"),        
    },
    handler: async (ctx, args) => {
      return await ctx.db.insert("playlistTracks", args);
    },
  });
  
  export const getSessionByToken = query({
    args: { token: v.string() },
    handler: async (ctx, args) => {
      return await ctx.db
        .query("sessions")
        .withIndex("byToken", (q) => q.eq("token", args.token))
        .first();
    },
  });
