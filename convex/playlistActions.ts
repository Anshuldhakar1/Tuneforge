import type { Id } from "./_generated/dataModel";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllPlaylists = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args: { userId: Id<"users"> }): Promise<any> => {

        const { userId } = args;
        if (!userId) {
            throw new Error("Invalid user ID");
        }

        return await ctx.db
            .query("playlists")
            .withIndex("byUserId", (q) => q.eq("userId", userId))
            .collect();
    },
});

export const getPlaylist = query({
    args: {
        playlistId: v.string(),
    },
    handler: async (ctx, args : { playlistId: string }) => {
        try {
            // Validate that the string looks like a valid Convex ID
            if (!args.playlistId || args.playlistId.trim() === "") {
                return null;
            }

            // Try to use the string as an ID - if it's invalid, the query will fail gracefully
            const playlist = await ctx.db
                .query("playlists").filter((q) => q.eq(q.field("_id"), args.playlistId as Id<"playlists">)).first();
            
            // Return null if playlist not found instead of throwing error
            return playlist || null;
        } catch (error) {
            // Handle any database errors gracefully (including invalid ID format)
            console.error("Error fetching playlist:", error);
            return null;
        }
    }
});

export const getPlaylistTracksFromId = query({
    args: {
        playlistId: v.string()
    },
    handler: async (ctx, args: { playlistId: string }) => {
        try {
            // Validate that the string looks like a valid Convex ID
            if (!args.playlistId || args.playlistId.trim() === "") {
                return [];
            }

            const playlistTracks = await ctx.db
                .query("playlistTracks")
                .withIndex("byPlaylistId", (q) => q.eq("playlistId", args.playlistId as Id<"playlists">))
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
        } catch (error) {
            // Handle any database errors gracefully (including invalid ID format)
            console.error("Error fetching playlist tracks:", error);
            return [];
        }
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