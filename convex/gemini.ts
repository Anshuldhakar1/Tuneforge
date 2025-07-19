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
    "mood": ["Mood1", "Mood2", ...],
    "tracks": [
      {
        "title": "Song Title",
        "artist": "Artist Name",
        "album": "Album Name",
        "genre": ["Genre1", "Genre2"]
      }
      // ...at least 10 tracks
    ],
  }
}

Instructions:
- Only return valid JSON in the above format, with no extra text or explanation.
- Fill all fields with real data.
- Ensure 'tracks' is an array, each with all fields filled.
- Include 1-3 relevant genres for each track (e.g., ["pop", "rock"], ["hip hop", "trap"], ["electronic", "house"]).
- Use double quotes for all keys and string values.
- If a field is unknown, leave it as an empty string or empty array as appropriate.
`;

export type Track = {
    _id?: Id<"tracks">;
    title: string;
    artist: string;
    album: string;
    genre: string[];
};
  
export type Playlist = {
    name: string;
    description: string;
    mood: string[];
    tracks: Track[];
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
  
  export type PlaylistCreationResult = {
  playlistId: Id<"playlists">;
  tracksFound: number;
  tracksRequested: number;
  errors: string[];
  playlist: Playlist;
};

export const aiGenerate = action({
    args: {
      token: v.string(),
      prompt: v.string(),
      playlistName: v.string(),
    },
    handler: async (_ctx, args): Promise<PlaylistCreationResult> => {
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
  
        console.log("Raw AI response:", response.text);
        
        const parsedResponse = parsePlaylist(response.text ? response.text : "");
  
        if (!parsedResponse) {
          throw new Error("Failed to parse playlist response");
        }

        // Get user ID from session token
        const userId = await _ctx.runQuery(api.auth.getUserBySessionToken, { token: args.token });
        if (!userId) {
          throw new Error("User not authenticated");
        }

        // Prepare track search data for Spotify (use only first artist for better search results)
        const trackSearchData = parsedResponse.playlist.tracks.map(track => ({
          trackName: track.title,
          artistName: track.artist.split(',')[0].trim(), // Take only first artist
          aiGenres: track.genre, // Pass AI-generated genres
        }));

        // Fetch tracks from Spotify and create them in DB
        const spotifyResult = await _ctx.runAction(api.spotify.getOptimizedTracksFromSpotify, {
          trackSearchData: trackSearchData,
          userId: userId,
        });

        // Create the playlist in our database
        const playlistId = await _ctx.runMutation(api.playlistCreation.createPlaylistWithTracks, {
          token: args.token,
          playlistName: args.playlistName,
          description: parsedResponse.playlist.description,
          mood: parsedResponse.playlist.mood,
          spotifyTracks: spotifyResult.tracks,
        });

        if (trackSearchData.length > spotifyResult.tracks.length) {
          // print which tracks were not found
          const notFoundTracks = trackSearchData.filter(
            (track) =>
              !spotifyResult.tracks.some(
                (t) => t.searchData?.trackName === track.trackName && t.searchData?.artistName === track.artistName
              )
          );
          console.log("Tracks not found:", notFoundTracks);
        }

        return {
          playlistId,
          tracksFound: spotifyResult.tracks.length,
          tracksRequested: trackSearchData.length,
          errors: spotifyResult.errors,
          playlist: parsedResponse.playlist,
        };

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
  
    // Helper to normalize a track - only requires title, artist, album
    const normalizeTrack = (t: any): Track => {
        const cleanString = (str: string): string => {
            return str
                .trim()
                .replace(/^['"`]+|['"`]+$/g, '') // Remove leading/trailing quotes
                .replace(/\\'/g, "'") // Unescape single quotes
                .replace(/\\"/g, '"') // Unescape double quotes
                .replace(/\\\\/g, '\\') // Unescape backslashes
                .trim();
        };

        return {
          title: typeof t?.title === "string" ? cleanString(t.title) : "",
          artist: typeof t?.artist === "string" ? cleanString(t.artist) : "",
          album: typeof t?.album === "string" ? cleanString(t.album) : "",
          genre: Array.isArray(t?.genre) ? t.genre.filter((g: any) => typeof g === "string").map((g: string) => cleanString(g)) : [],
        };
    };
  
    // 1. Clean and extract JSON substring
    let jsonStr = aiOutput;
    
    // Remove any markdown code blocks
    jsonStr = jsonStr.replace(/```json\s*|\s*```/g, '');
    
    // Fix common JSON formatting issues before parsing
    jsonStr = jsonStr
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .replace(/\n\s*/g, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    const firstBrace = jsonStr.indexOf("{");
    const lastBrace = jsonStr.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonStr = jsonStr.slice(firstBrace, lastBrace + 1);
    }
  
    // 2. Try parsing
    let data: any;
    try {
      data = JSON.parse(jsonStr);
    } catch (e) {
      console.log("Initial JSON parse failed, attempting to fix formatting...");
      // Try to fix common JSON issues
      jsonStr = jsonStr
        .replace(/'([^']*)'/g, '"$1"') // single quotes to double quotes
        .replace(/`([^`]*)`/g, '"$1"') // backticks to double quotes
        .replace(/,\s*([}\]])/g, "$1") // remove trailing commas
        .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Add quotes to unquoted keys
        .replace(/:\s*([^",\[\]{}]+)(?=\s*[,}])/g, ':"$1"'); // Add quotes to unquoted string values
      
      try {
        data = JSON.parse(jsonStr);
      } catch (e2) {
        console.error("Failed to parse JSON after cleanup:", e2);
        console.log("Problematic JSON string:", jsonStr.substring(0, 500) + "...");
        return null;
      }
    }
  
    // 3. Normalize structure
    let playlist = data.playlist || data;
    if (!playlist) {
      console.error("No playlist data found in parsed response");
      return null;
    }
  
    // 4. Validate and normalize tracks - only require title, artist, album
    const normalizedTracks = [];
    if (Array.isArray(playlist.tracks)) {
      for (const track of playlist.tracks) {
        const normalized = normalizeTrack(track);
        // Only add tracks that have all required fields including genre
        if (normalized.title && normalized.artist && normalized.album) {
          normalizedTracks.push(normalized);
        } else {
          console.warn("Skipping invalid track:", track);
        }
      }
    }
  
    // 5. Create final normalized response - simplified structure
    const normalized: PlaylistResponse = {
      playlist: {
        name: typeof playlist.name === "string" ? playlist.name.trim().replace(/^['"`]+|['"`]+$/g, '') : "",
        description:
          typeof playlist.description === "string" ? playlist.description.trim().replace(/^['"`]+|['"`]+$/g, '') : "",
        mood: ensureArray(playlist.mood),
        tracks: normalizedTracks,
      },
    };
  
    console.log(`Successfully parsed playlist with ${normalizedTracks.length} valid tracks`);
  
    return normalized;
}