import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllPlaylists = query({
    args: {
        token: v.string(),
    },
    handler: async (ctx, args: { token: string }): Promise<any> => {

        const { token } = args;
        
        if (!token) {
            console.log("❌ Token is missing");
            throw new Error("Token is required");
        }

        const userId = await ctx.runQuery(api.auth.getUserBySessionToken, { token });

        if (!userId) {
            throw new Error("Invalid session token");
        }

        return await ctx.db
            .query("playlists")
            .withIndex("byUserId", (q) => q.eq("userId", userId))
            .collect();
    },
});

export const getPlaylist = query({
    args: {
        playlistId: v.id("playlists"),
    },
    handler: async (ctx, args : { playlistId: Id<"playlists"> }) => {
        const playlist = await ctx.db
            .query("playlists").filter((q) => q.eq(q.field("_id"), args.playlistId)).first();
        
        if (!playlist) {
            throw new Error("Playlist not found");
        }

        return playlist;
    }
});

export const getPlaylistTracksFromId = query({
    args: {
        playlistId: v.id("playlists")
    },
    handler: async (ctx, args) => {
        const playlistTracks = await ctx.db
            .query("playlistTracks")
            .withIndex("byPlaylistId", (q) => q.eq("playlistId", args.playlistId))
            .collect();
        
        if (playlistTracks.length === 0) {
            return [];
        }

        const trackIds = playlistTracks.map(pt => pt.trackId);
        
        const tracks = await ctx.db
            .query("tracks")
            .filter((q) => 
                q.or(...trackIds.map(id => q.eq(q.field("_id"), id)))
            )
            .collect();
        
        return tracks;
    },
});

export const addPlaylistSpotifyLink = mutation({
    args: {
        playlistId: v.id("playlists"),
        spotifyPlaylistId: v.string(),
        spotifyPlaylistUrl: v.string(),
    },
    handler: async (ctx, args): Promise<void> => { 
        const { playlistId, spotifyPlaylistId, spotifyPlaylistUrl } = args;

        // Validate the playlist exists
        const playlist = await ctx.db
            .query("playlists")
            .filter((q) => q.eq(q.field("_id"), playlistId))
            .first();
        
        if (!playlist) {
            throw new Error("Playlist not found");
        }

        // Update the playlist with Spotify details
        return await ctx.db.patch(playlistId, {
            spotifyPlaylistId,
            spotifyPlaylistUrl,
            updatedAt: Date.now(),
        });
    }
});

export const deletePlaylist = mutation({
    args: {
        playlistId: v.id("playlists"),
    },
    handler: async (ctx, args): Promise<void> => { 
        const { playlistId } = args;

        // Validate the playlist exists
        const playlist = await ctx.db
            .query("playlists")
            .filter((q) => q.eq(q.field("_id"), playlistId))
            .first();
        
        if (!playlist) {
            throw new Error("Playlist not found");
        }

        // Delete the playlist
        await ctx.db.delete(playlistId);
    }
});