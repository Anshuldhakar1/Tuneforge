import { action } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenAI } from "@google/genai";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generationFormatInstruction = `
You are a professional music curator. Thoroughly analyze the provided playlist description to understand the intended mood, genre, and context. Select songs that best embody these qualities, ensuring the playlist is cohesive, relevant, and thoughtfully curated to fulfill the user's request.`;

const generationResultFormat = `

Given the playlist description, generate a playlist as a single valid JSON object with the following structure:
Only include real songs and artists that exist on Spotify
{
  "playlist": {
    "name": "A creative, relevant playlist name",
    "description": "A brief summary of the playlist's vibe, purpose, or story",
    "genre": ["Genre1", "Genre2", ...],
    "mood": ["Mood1", "Mood2", ...],
    "tracks": [
      {
        "title": "Song Title",
        "artist": "Artist Name",
        "album": "Album Name",
        "durationMs": "Duration in milliseconds",
        "genre": "Song Genre1,Song Genre2, ...",
        "coverUrl": "Optional: URL to the album cover image if not there return empty",
      }
      // ...at least 10 tracks
    ],
    "total_tracks": Number of tracks,
    "estimated_duration": "Approximate total duration (e.g., '1h 15m')",
    "theme": "Optional: overarching theme or concept"
  }
}

Instructions:
- Only return valid JSON in the above format, with no extra text or explanation.
- Fill all fields with real data.
- Ensure 'tracks' is an array, each with all fields filled.
- Use double quotes for all keys and string values.
- If a field is unknown, leave it as an empty string or empty array as appropriate.
`;

export type Track = {
    _id?: Id<"tracks">;
    title: string;
    artist: string;
    album: string;
    genre: string[];
    durationMs: string; // Duration in milliseconds
    coverUrl: string;
};
  
export type Playlist = {
    name: string;
    description: string;
    genre: string[];
    mood: string[];
    tracks: Track[];
    total_tracks: number;
    estimated_duration: string;
    theme: string;
};
  
export type PlaylistResponse = {
    playlist: Playlist;
};

async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries = 5,
    baseDelayMs = 1000
): Promise<T> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
        return await fn();
        } catch (error: any) {
        // Check for 503 or model overload
        const isOverload =
            error?.status === 503 ||
            error?.message?.includes("model is overloaded") ||
            error?.message?.includes("UNAVAILABLE");
        if (isOverload && attempt < maxRetries - 1) {
            const delay = baseDelayMs * Math.pow(2, attempt);
            await new Promise((res) => setTimeout(res, delay));
            continue;
        }
        throw error;
        }
    }
    throw new Error("Model is overloaded. Please try again later.");
};
  
  export const aiGenerate = action({
    args: {
      token: v.string(),
      prompt: v.string(),
      playlistName: v.string(),
    },
    handler: async (_ctx, args) => {
      const genprompt =
        generationFormatInstruction +
        "\n\n" +
        args.prompt +
        "\n\n" +
        generationResultFormat;
  
      try {
        const response = await retryWithBackoff(async () => {
          return await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: genprompt,
          });
        });
  
        const parsedResponse = parsePlaylist(response.text ? response.text : "");
  
        if (!parsedResponse) {
          throw new Error("Failed to parse playlist response");
        }
  
        const actualTracksFound: any = await _ctx.runAction(api.playlistCreation.createPlayList, {
          token: args.token,
          playlistName: args.playlistName,
          response: parsedResponse,
        });

        return actualTracksFound;

      } catch (error: any) {
        console.error("Google GenAI API error:", error);
        if (
          error?.status === 503 ||
          error?.message?.includes("model is overloaded") ||
          error?.message?.includes("UNAVAILABLE")
        ) {
          throw new Error(
            "The AI model is currently overloaded. Please try again in a few moments."
          );
        }
        throw new Error(
          "Failed to generate text: " +
            (error instanceof Error ? error.message : "Unknown error")
        );
      }
    },
  });

export const parsePlaylist = (aiOutput: string): PlaylistResponse | null => {
    // Helper to ensure array
    const ensureArray = (val: any): string[] =>
      Array.isArray(val)
        ? val.filter((v) => typeof v === "string")
        : typeof val === "string" && val
        ? [val]
        : [];
  
    // Helper to normalize a track
    const normalizeTrack = (t: any): Track => ({
        title: typeof t?.title === "string" ? t.title : "",
        artist: typeof t?.artist === "string" ? t.artist : "",
        album: typeof t?.album === "string" ? t.album : "",
        genre: typeof t?.genre === "string" ? t.genre : "",  
        durationMs: typeof t?.durationMs === "string" ? t.durationMs : "",
        coverUrl: typeof t?.coverUrl === "string" ? t.coverUrl : "",
    });
  
    // 1. Extract JSON substring
    let jsonStr = aiOutput;
    const firstBrace = aiOutput.indexOf("{");
    const lastBrace = aiOutput.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonStr = aiOutput.slice(firstBrace, lastBrace + 1);
    }
  
    // 2. Try parsing
    let data: any;
    try {
      data = JSON.parse(jsonStr);
    } catch (e) {
      // Try to fix common JSON issues (single quotes, trailing commas)
      jsonStr = jsonStr
        .replace(/'([^']*)'/g, '"$1"') // single quotes to double quotes
        .replace(/`([^`]*)`/g, '"$1"') // backticks to double quotes
        .replace(/,\s*([}\]])/g, "$1"); // remove trailing commas
      try {
        data = JSON.parse(jsonStr);
      } catch (e2) {
        return null;
      }
    }
  
    // 3. Normalize structure
    let playlist = data.playlist || data;
    if (!playlist) return null;
  
    // 4. Normalize fields
    const normalized: PlaylistResponse = {
      playlist: {
        name: typeof playlist.name === "string" ? playlist.name : "",
        description:
          typeof playlist.description === "string" ? playlist.description : "",
        genre: ensureArray(playlist.genre),
        mood: ensureArray(playlist.mood),
        tracks: Array.isArray(playlist.tracks)
          ? playlist.tracks.map(normalizeTrack)
          : [],
        total_tracks:
          typeof playlist.total_tracks === "number"
            ? playlist.total_tracks
            : Array.isArray(playlist.tracks)
            ? playlist.tracks.length
            : 0,
        estimated_duration:
          typeof playlist.estimated_duration === "string"
            ? playlist.estimated_duration
            : "",
        theme: typeof playlist.theme === "string" ? playlist.theme : "",
      },
    };
  
    return normalized;
}