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