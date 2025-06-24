import { v } from "convex/values";
import { action } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

export const createPlaylist = action({
    args: {
        token: v.string(),
        playlistId: v.id("playlists"),
    },
    handler: async (_ctx, args: { token: string; playlistId: Id<"playlists"> }): Promise<any> => {
        const { token, playlistId } = args;
        if (!token) {
            console.log("❌ Token is missing");
            throw new Error("Token is required");
        }

        const spotifyTokens = await _ctx.runQuery(api.spotifyAuth.getSpotifyTokensByToken, { token });
        let accessToken = spotifyTokens?.accessToken;
        let spotifyUserId = spotifyTokens?.spotifyUserId;
        if (!spotifyTokens) {
            console.log("❌ No Spotify tokens found for the user, attempting to refresh tokens");

            const r = await _ctx.runAction(api.spotifyAuth.refreshSpotifyToken);
            accessToken = r.accessToken;
            spotifyUserId = r.spotifyUserId;
        }

        if (!accessToken) {
            throw new Error("Failed to retrieve Spotify access token");
        }
        if (!spotifyUserId) {
            throw new Error("Failed to retrieve Spotify user ID");
        }

        console.log("Access Token:", accessToken);
        console.log("Spotify User ID:", spotifyUserId);

        const playlist: Doc<"playlists"> = await _ctx.runQuery(api.playlistActions.getPlaylist, { playlistId: playlistId });
        console.log("Playlist:", playlist);

        const playlistTracks = await _ctx.runQuery(api.playlistActions.getPlaylistTracksFromId, { playlistId: playlistId });
        if (playlistTracks.length === 0) {
            throw new Error("No tracks found in the playlist");
        }

        const trackUris = playlistTracks.map((track) => track.spotifyTrackId).filter((uri): uri is string => Boolean(uri));
        if (!trackUris || trackUris.length === 0) {
            throw new Error("No valid Spotify track URIs found in the playlist");
        }

        console.log("Track URIs:", trackUris);

        // create a new spotify playlist
        const { playlistId: newPlaylistId, playlistUrl } = await createAndPopulateSpotifyPlaylist({
            accessToken,
            spotifyUserId,
            name: playlist.name,
            description: playlist.description || "",
            trackUris,
            isPublic: false, // or false based on your requirement
        });

        console.log("New Playlist ID:", newPlaylistId);
        console.log("New Playlist URL:", playlistUrl);

        await _ctx.runMutation(api.playlistActions.addPlaylistSpotifyLink, {
            playlistId: playlistId,
            spotifyPlaylistId: newPlaylistId,
            spotifyPlaylistUrl: playlistUrl,
        });
    }
});

type CreateSpotifyPlaylistOptions = {
    accessToken: string;
    spotifyUserId: string;
    name: string;
    description?: string;
    trackUris: string[];
    isPublic?: boolean;
  };

const createAndPopulateSpotifyPlaylist = async ({
        accessToken,
        spotifyUserId,
        name,
        description = "",
        trackUris,
        isPublic = false,
    }: CreateSpotifyPlaylistOptions): Promise<{
        playlistId: string;
        playlistUrl: string;
    }> => {
        // 1. Create the playlist
        const createRes = await fetch(
            `https://api.spotify.com/v1/users/${spotifyUserId}/playlists`,
            {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                description,
                public: isPublic,
            }),
            }
        );

        if (!createRes.ok) {
            const err = await createRes.text();
            throw new Error(`Failed to create playlist: ${err}`);
        }

        const playlist = await createRes.json();
        const playlistId = playlist.id;
        const playlistUrl = playlist.external_urls.spotify;

        // 2. Add tracks in batches of 100
        for (let i = 0; i < trackUris.length; i += 100) {
            const batch = trackUris.slice(i, i + 100);
            const addRes = await fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            {
                method: "POST",
                headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ uris: batch }),
            }
            );
            if (!addRes.ok) {
            const err = await addRes.text();
            throw new Error(`Failed to add tracks: ${err}`);
            }
        }

        return { playlistId, playlistUrl };
}