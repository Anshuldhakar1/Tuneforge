import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    username: v.string(),
    passwordHash: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    activeSessionId: v.optional(v.id("sessions")),
    profilePictureUrl: v.optional(v.string()),
  }).index("byEmail", ["email"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
  }).index("byToken", ["token"]).index("byUserId", ["userId"]),

  playlists: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    moods: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
    spotifyPlaylistId: v.optional(v.string()), // For Spotify integration
    spotifyPlaylistUrl: v.optional(v.string()), // For Spotify integration
  }).index("byUserId", ["userId"]),

  playlistTracks: defineTable({
    playlistId: v.id("playlists"),
    trackId: v.id("tracks"),
    addedAt: v.number(),
    addedBy: v.id("users"),
    order: v.optional(v.number()), // For custom ordering
  }).index("byPlaylistId", ["playlistId"]),

  tracks: defineTable({
    title: v.string(),
    artist: v.string(),
    album: v.string(),
    genre: v.optional(v.array(v.string())),
    durationMs: v.optional(v.number()),
    spotifyTrackId: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    releaseDate: v.optional(v.string()),
    popularity: v.optional(v.number()),
  }).index("bySpotifyTrackId", ["spotifyTrackId"]),

  playlistLikes: defineTable({
    playlistId: v.id("playlists"),
    userId: v.id("users"),
    likedAt: v.number(),
  }).index("byPlaylistId", ["playlistId"]).index("byUserId", ["userId"]),

  spotifyTokens: defineTable({
    userId: v.id("users"),
    accessToken: v.string(),
    refreshToken: v.string(),
    expiresAt: v.number(),
    spotifyUserId: v.string(),
    spotifyDisplayName: v.optional(v.string()),
    scope: v.optional(v.string()),
  }).index("byUserId", ["userId"]),

  spotifyStats: defineTable({
    userId: v.id("users"),
    totalTracks: v.number(),
    totalArtists: v.number(),
    totalPlaylists: v.number(),
    totalHoursListened: v.number(),
    topArtist: v.string(),
    topArtistCover: v.string(),
    topTrack: v.string(),
    topTrackArtist: v.string(),
    topTrackCover: v.string(),
    topArtistCovers: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("byUserId", ["userId"]),
});