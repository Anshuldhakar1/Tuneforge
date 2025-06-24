import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthUserId } from "./auth";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;

export const getSpotifyAuthUrl = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    // Validate the token by checking the session
    const session = await ctx.db
      .query("sessions")
      .withIndex("byToken", (q) => q.eq("token", args.token))
      .first();
      
    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }
    
    const scopes = [
      "playlist-modify-public",
      "playlist-modify-private",
      "user-read-private",
      "user-read-email",
    ].join(" ");
    
    const params = new URLSearchParams({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope: scopes,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      state: session.userId,
      show_dialog: "true",
    });
    
    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  },
});

export const exchangeSpotifyCode = action({
  args: { code: v.string(), state: v.string() },
  handler: async (ctx, args) => {
    // Exchange code for tokens
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: args.code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Spotify token exchange failed:', errorText);
      throw new Error("Failed to exchange code for token");
    }
    
    const tokenData = await tokenResponse.json();
    
    // Get user profile
    const profileResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    
    if (!profileResponse.ok) {
      console.error('Failed to get Spotify profile');
      throw new Error("Failed to get user profile");
    }
    
    const profile = await profileResponse.json();
    
    // Store tokens - use state as userId since it contains the session userId
    await ctx.runMutation(api.spotifyAuth.storeSpotifyTokens, {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: Date.now() + tokenData.expires_in * 1000,
      spotifyUserId: profile.id,
      spotifyDisplayName: profile.display_name,
      userId: args.state as any, // state contains the userId from the session
    });
    
    return { success: true };
  },
});

export const storeSpotifyTokens = mutation({
  args: {
    accessToken: v.string(),
    refreshToken: v.string(),
    expiresAt: v.number(),
    spotifyUserId: v.string(),
    spotifyDisplayName: v.optional(v.string()),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("spotifyTokens")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        expiresAt: args.expiresAt,
        spotifyUserId: args.spotifyUserId,
        spotifyDisplayName: args.spotifyDisplayName,
      });
    } else {
      await ctx.db.insert("spotifyTokens", {
        userId: args.userId,
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        expiresAt: args.expiresAt,
        spotifyUserId: args.spotifyUserId,
        spotifyDisplayName: args.spotifyDisplayName,
      });
    }
  },
});

export const getSpotifyTokens = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    // console.log("Fetching Spotify tokens for user:", userId);
    if (!userId) return null;
    return await ctx.db
      .query("spotifyTokens")
      .withIndex("byUserId", (q) => q.eq("userId", userId as any))
      .unique();
  },
});

export const getSpotifyTokensById = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx,args) => {
    return await ctx.db
      .query("spotifyTokens")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId ))
      .unique();
  },
});

export const getSpotifyTokensByToken = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // console.log("Validating session for token:", args.token);
    if (!args.token) throw new Error("Token is required");

    const session = await ctx.db.query("sessions").
      withIndex("byToken", (q) => q.eq("token", args.token)).first();
    
    // console.log("Session for token:", session);
    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    const userId = session.userId;
    // console.log("Fetching Spotify tokens for user:", userId);

    if (!userId) return null;
    return await ctx.db
      .query("spotifyTokens")
      .withIndex("byUserId", (q) => q.eq("userId", userId as any))
      .unique();
  },
});

export const refreshSpotifyToken = action({
  args: {},
  handler: async (ctx): Promise<string> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const tokens = await ctx.runQuery(api.spotifyAuth.getSpotifyTokens);
    if (!tokens) throw new Error("No Spotify tokens found");
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(
          `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
        )}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: tokens.refreshToken,
      }),
    });
    if (!response.ok) throw new Error("Failed to refresh token");
    const data = await response.json();
    await ctx.runMutation(api.spotifyAuth.storeSpotifyTokens, {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || tokens.refreshToken,
      expiresAt: Date.now() + data.expires_in * 1000,
      spotifyUserId: tokens.spotifyUserId,
      spotifyDisplayName: tokens.spotifyDisplayName,
      userId: userId as any,
    });
    return data.access_token;
  },
});

export const disconnectSpotify = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.token) throw new Error("Token is required");

    const session = await ctx.db.query("sessions").
      withIndex("byToken", (q) => q.eq("token", args.token)).first();
    
    // console.log("Session for token:", session);
    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    const userId = session.userId;

    const tokens = await ctx.db
      .query("spotifyTokens")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .unique();
    if (tokens) await ctx.db.delete(tokens._id);
  },
});
