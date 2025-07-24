/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as gemini from "../gemini.js";
import type * as http from "../http.js";
import type * as migrations from "../migrations.js";
import type * as playlistActions from "../playlistActions.js";
import type * as playlistCreation from "../playlistCreation.js";
import type * as playlistLikes from "../playlistLikes.js";
import type * as spotify from "../spotify.js";
import type * as spotifyAuth from "../spotifyAuth.js";
import type * as spotifyCreate from "../spotifyCreate.js";
import type * as tracks from "../tracks.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  gemini: typeof gemini;
  http: typeof http;
  migrations: typeof migrations;
  playlistActions: typeof playlistActions;
  playlistCreation: typeof playlistCreation;
  playlistLikes: typeof playlistLikes;
  spotify: typeof spotify;
  spotifyAuth: typeof spotifyAuth;
  spotifyCreate: typeof spotifyCreate;
  tracks: typeof tracks;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
