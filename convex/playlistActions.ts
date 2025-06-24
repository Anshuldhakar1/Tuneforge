import { api } from "./_generated/api";
import { query } from "./_generated/server";
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