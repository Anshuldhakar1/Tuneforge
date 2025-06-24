import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
// import type { Id } from "./_generated/dataModel";

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

      const actualTracks = [];
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
    handler: async (ctx, args) => {
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
