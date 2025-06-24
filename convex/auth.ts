import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { nanoid } from "nanoid";
import * as bcrypt from "bcryptjs";
import { api } from "./_generated/api";

// --- Types for args and return values ---
type SignupArgs = {
  email: string;
  username: string;
  password: string;
  name: string;
};
type SigninArgs = {
  username: string;
  password: string;
};
type AuthResult = {
  token: string;
  expiresAt: number;
  userId: string;
};

export async function getAuthUserId(ctx: any): Promise<string | null> {
  let token: string | null = null;
  
  if (ctx.request) {
    const authHeader = ctx.request.headers.get("Authorization");
    token = authHeader?.replace("Bearer ", "") || null;
    
    if (!token) {
      const url = new URL(ctx.request.url);
      token = url.searchParams.get("token");
    }
  }
  
  if (!token && ctx.auth) {
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("byEmail", (q: any) => q.eq("email", identity.email))
        .first();
      return user?._id || null;
    }
  }
  
  if (!token) return null;
  
  const session = await ctx.db
    .query("sessions")
    .withIndex("byToken", (q:any) => q.eq("token", token))
    .first();
    
  if (!session || session.expiresAt < Date.now()) {
    return null;
  }
  
  return session.userId;
}

export const signup = action({
  args: {
    email: v.string(),
    username: v.string(),
    password: v.string(),
    name: v.string(),
  },
  // Explicitly type args and return value
  handler: async (ctx, args: SignupArgs): Promise<AuthResult> => {
    // Check if email already exists
    const existing = await ctx.runQuery(api.auth.checkEmailExists, { email: args.email });
    if (existing) throw new Error("Email already in use");

    // Check if username already exists
    const usernameExists = await ctx.runQuery(api.auth.checkUsernameExists, { username: args.username });
    if (usernameExists) throw new Error("Username already in use");

    // Hash password (this is why we need an action)
    const passwordHash = await bcrypt.hash(args.password, 10);
    
    // Create user and session via mutation
    const result = await ctx.runMutation(api.auth.createUserAndSession, {
      email: args.email,
      username: args.username,
      passwordHash,
      name: args.name,
    });

    return result;
  },
});

export const signin = action({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args: SigninArgs): Promise<AuthResult> => {
    
    const user = await ctx.runQuery(api.auth.getUserByUsername, { username: args.username });
    if (!user) throw new Error("Invalid username or password");

    
    const valid = await bcrypt.compare(args.password, user.passwordHash);
    if (!valid) throw new Error("Invalid username or password");

    const result = await ctx.runMutation(api.auth.createSession, { userId: user._id });
    return result;
  },
});

// Helper queries
export const checkEmailExists = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("byEmail", (q) => q.eq("email", args.email))
      .first();
    return existing !== null;
  },
});

export const checkUsernameExists = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), args.username))
      .first();
    return existing !== null;
  },
});

export const getUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), args.username))
      .first();
    return user;
  },
});

// Helper mutations
export const createUserAndSession = mutation({
  args: {
    email: v.string(),
    username: v.string(),
    passwordHash: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Create user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      username: args.username,
      passwordHash: args.passwordHash,
      createdAt: now,
      updatedAt: now,
      activeSessionId: undefined,
      profilePictureUrl: undefined,
    });

    // Create session
    const token = nanoid();
    const expiresAt = now + 3 * 60 * 60 * 1000; // 3 hours
    const sessionId = await ctx.db.insert("sessions", {
      userId: userId,
      token,
      createdAt: now,
      expiresAt,
    });

    // Update user with active session
    await ctx.db.patch(userId, { activeSessionId: sessionId });

    return { token, expiresAt, userId: userId };
  },
});

export const createSession = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const now = Date.now();
    const token = nanoid();
    const expiresAt = now + 3 * 60 * 60 * 1000; // 3 hours

    const sessionId = await ctx.db.insert("sessions", {
      userId: args.userId,
      token,
      createdAt: now,
      expiresAt,
    });

    // Update user with new active session
    await ctx.db.patch(args.userId, { activeSessionId: sessionId });

    return { token, expiresAt, userId: args.userId };
  },
});

// Validate session query (no bcrypt needed, so can remain a query)
export const validateSession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    // Find session by token
    const session = await ctx.db
      .query("sessions")
      .filter((q) => q.eq(q.field("token"), args.token))
      .first();
    
    if (!session) return null;
    
    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      return null;
    }

    // Get user
    const user = await ctx.db.get(session.userId);
    if (!user) return null;

    return {
      userId: user._id,
      email: user.email,
      username: user.username,
      expiresAt: session.expiresAt,
    };
  },
});

// Signout mutation
export const signout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .filter((q) => q.eq(q.field("token"), args.token))
      .first();
    
    if (session) {
      // Update user to remove active session
      const user = await ctx.db.get(session.userId);
      if (user && user.activeSessionId === session._id) {
        await ctx.db.patch(session.userId, { activeSessionId: undefined });
      }
    }
    
    return { success: true };
  },
});