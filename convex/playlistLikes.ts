import { v } from "convex/values";
import { query } from "./_generated/server";

export const getUserLiked = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.query("playlistLikes")
            .withIndex("byUserId", (q) => q.eq("userId", args.userId))
            .collect();
    },
});


// add playlist like functionality
// add a little animation when user likes and dislikes a playlist
// sync the playlist page to work with the like system too
// MOBILE
