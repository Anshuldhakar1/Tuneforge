import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

export const getTrackFromSpotify = action({
  args: {
    trackName: v.string(),
    artistName: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<{ spotifyURI: string | null }> => {
    const { trackName, artistName, userId } = args;

    const tokenData = await ctx.runQuery(api.spotifyAuth.getSpotifyTokensById, { userId: userId });
    // console.log("Token Data:", tokenData);
    if (!tokenData) {
      return { spotifyURI: null };
    }
    const accessToken = tokenData.accessToken;

    const query = `track:${trackName} artist:${artistName}`;
    const url = `https://api.spotify.com/v1/search?type=track&limit=1&q=${encodeURIComponent(
      query
    )}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return { spotifyURI: null };
    }

    type SpotifyTrack = {
      id: string;
      uri: string;
      name: string;
      artists: { name: string }[];
    };

    type SpotifySearchResponse = {
      tracks: {
        items: SpotifyTrack[];
      };
    };

    const data = (await response.json()) as SpotifySearchResponse;

    const track = data.tracks?.items?.[0];
    if (!track) {
      return { spotifyURI: null };
    }

    // Case-insensitive match for both track and artist
    const trackMatch =
      track.name.trim().toLowerCase() === trackName.trim().toLowerCase();
    const artistMatch = track.artists.some(
      (artist) =>
        artist.name.trim().toLowerCase() === artistName.trim().toLowerCase()
    );

    return { spotifyURI: trackMatch && artistMatch ? track.uri : null };
  },
});