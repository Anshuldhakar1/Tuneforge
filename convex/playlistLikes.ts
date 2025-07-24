import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserLiked = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.query("playlistLikes")
            .withIndex("byUserId", (q) => q.eq("userId", args.userId))
            .collect();
    },
});

export const isPlaylistLiked = query({
    args: {
        userId: v.id("users"),
        playlistId: v.id("playlists")
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("playlistLikes")
            .withIndex("byUserId", (q) => q.eq("userId", args.userId))
            .filter((q) => q.eq(q.field("playlistId"), args.playlistId))
            .first() ? true: false;
    }
})

export const togglePlaylistLike = mutation({
    args: {
        userId: v.id("users"),
        playlistId: v.id("playlists")
    },
    handler: async (ctx, args) => { 
        const userId = args.userId;
        const playlistId = args.playlistId;

        const user = await ctx.db.query("users").filter(
            (q) => q.eq(q.field("_id"), userId)
        ).first();
        if (!user) {
            throw new Error("User not authenticated");
        }

        // check if the playlistId in the argument is valid or not
        const playlist = await ctx.db.query("playlists").filter(
            (q) => q.eq(q.field("_id"), playlistId)
        ).first();
        if (!playlist) {
            throw new Error("Playlist not found");
        }

        // Check if user already liked this playlist
        const existingLike = await ctx.db.query("playlistLikes")
            .withIndex("byUserId", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("playlistId"), playlistId))
            .first();

        if (existingLike) {
            // Unlike: remove the existing like
            await ctx.db.delete(existingLike._id);
            return { liked: false };
        } else {
            // Like: add new like to database
            await ctx.db.insert("playlistLikes", {
                userId: userId,
                playlistId: playlistId,
                likedAt: Date.now()
            });
            return { liked: true };
        }

    }

});
