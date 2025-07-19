import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

export const createTrack = mutation({
  args: {
    title: v.string(),
    artist: v.string(),
    album: v.string(),
    genre: v.optional(v.array(v.string())),
    durationMs: v.optional(v.number()),
    spotifyTrackId: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    releaseDate: v.optional(v.string()),
    popularity: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<Id<"tracks">> => {
    // Check if track already exists by Spotify ID
    if (args.spotifyTrackId) {
      const existingTrack = await ctx.db
        .query("tracks")
        .withIndex("bySpotifyTrackId", (q) => q.eq("spotifyTrackId", args.spotifyTrackId))
        .first();
      
      if (existingTrack) {
        return existingTrack._id;
      }
    }

    // Create new track
    return await ctx.db.insert("tracks", {
      title: args.title,
      artist: args.artist,
      album: args.album,
      genre: args.genre,
      durationMs: args.durationMs,
      spotifyTrackId: args.spotifyTrackId,
      coverUrl: args.coverUrl,
      releaseDate: args.releaseDate,
      popularity: args.popularity,
    });
  },
});

export const getTrackById = query({
  args: { trackId: v.id("tracks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.trackId);
  },
});

export const getTrackBySpotifyId = query({
  args: { spotifyTrackId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tracks")
      .withIndex("bySpotifyTrackId", (q) => q.eq("spotifyTrackId", args.spotifyTrackId))
      .first();
  },
});

export const searchTracks = query({
  args: { 
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const query = args.query.toLowerCase();
    
    const tracks = await ctx.db.query("tracks").collect();
    
    return tracks
      .filter(track => 
        track.title.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query) ||
        track.album.toLowerCase().includes(query)
      )
      .slice(0, limit);
  },
});

// Utility function to convert Spotify Track ID to URI
export const getSpotifyTrackUri = (trackId: string): string => {
  return `spotify:track:${trackId}`;
};

// Utility function to extract Track ID from URI
export const getTrackIdFromUri = (uri: string): string => {
  return uri.split(':')[2] || uri;
};