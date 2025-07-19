import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";

type DetailedTrackData = {
  id: string;
  uri: string;
  name: string;
  artists: { name: string; id: string }[];
  album: {
    name: string;
    images: { url: string }[];
    release_date: string;
  };
  duration_ms: number;
  popularity: number;
  genres?: string[];
};

export const getTrackFromSpotify = action({
  args: {
    trackName: v.string(),
    artistName: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<{ spotifyURI: string | null; trackId: Id<"tracks"> | null }> => {
    const { trackName, artistName, userId } = args;

    const tokenData = await ctx.runQuery(api.spotifyAuth.getSpotifyTokensById, { userId: userId });
    if (!tokenData) {
      console.error("User not authenticated with Spotify");
      return { spotifyURI: null, trackId: null };
    }
    const accessToken = tokenData.accessToken;

    const query = `track:${trackName} artist:${artistName.split(',')[0].trim()}`;
    const url = `https://api.spotify.com/v1/search?type=track&limit=1&q=${encodeURIComponent(
      query
    )}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Spotify search failed for "${trackName}" by "${artistName}": HTTP ${response.status} - ${errorText}`);
      return { spotifyURI: null, trackId: null };
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
      console.error(`Track not found on Spotify: "${trackName}" by "${artistName}"`);
      return { spotifyURI: null, trackId: null };
    }

    // Case-insensitive match for both track and artist (check against first artist only)
    const trackMatch =
      track.name.trim().toLowerCase() === trackName.trim().toLowerCase();
    const firstArtistName = artistName.split(',')[0].trim().toLowerCase();
    const artistMatch = track.artists.some(
      (artist) =>
        artist.name.trim().toLowerCase() === firstArtistName
    );

    if (!trackMatch || !artistMatch) {
      console.error(`Track match failed for "${trackName}" by "${artistName}": found "${track.name}" by "${track.artists.map(a => a.name).join(', ')}"`);
      return { spotifyURI: null, trackId: null };
    }

    // Get detailed track information
    const detailedTrackData = await getDetailedTrackData(track.id, accessToken);
    
    if (!detailedTrackData) {
      console.error(`Failed to get detailed track data for "${track.name}"`);
      return { spotifyURI: track.uri, trackId: null };
    }

    // Store track in database
    const trackId = await ctx.runMutation(api.tracks.createTrack, {
      title: detailedTrackData.name,
      artist: detailedTrackData.artists[0]?.name || "",
      album: detailedTrackData.album.name,
      genre: detailedTrackData.genres || [],
      durationMs: detailedTrackData.duration_ms,
      spotifyTrackId: detailedTrackData.id,
      coverUrl: detailedTrackData.album.images[0]?.url || "",
      releaseDate: detailedTrackData.album.release_date,
      popularity: detailedTrackData.popularity,
    });

    return { spotifyURI: track.uri, trackId };
  },
});

const getDetailedTrackData = async (trackId: string, accessToken: string): Promise<DetailedTrackData | null> => {
  try {
    // Single API call to get track details
    const trackResponse = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!trackResponse.ok) {
      console.error("Failed to fetch detailed track data:", trackResponse.status);
      return null;
    }

    const trackData = await trackResponse.json() as DetailedTrackData;
    
    // Get primary artist genres as track genres (common practice)
    if (trackData.artists && trackData.artists.length > 0 && trackData.artists[0].id) {
      try {
        const artistResponse = await fetch(`https://api.spotify.com/v1/artists/${trackData.artists[0].id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        
        if (artistResponse.ok) {
          const artistData = await artistResponse.json();
          trackData.genres = artistData.genres || [];
        } else {
          trackData.genres = [];
        }
      } catch (error) {
        console.error("Error fetching artist genres:", error);
        trackData.genres = [];
      }
    } else {
      trackData.genres = [];
    }

    return trackData;
  } catch (error) {
    console.error("Error fetching detailed track data:", error);
    return null;
  }
};

// Efficient batch function to get artist genres for multiple artists
const getBatchArtistGenres = async (artistIds: string[], accessToken: string): Promise<Map<string, string[]>> => {
  const genresMap = new Map<string, string[]>();
  const batchSize = 50; // Spotify API limit
  
  for (let i = 0; i < artistIds.length; i += batchSize) {
    const batch = artistIds.slice(i, i + batchSize);
    const idsParam = batch.join(',');
    
    try {
      const response = await fetch(`https://api.spotify.com/v1/artists?ids=${idsParam}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        const artists = data.artists || [];
        
        batch.forEach((artistId, index) => {
          const artist = artists[index];
          genresMap.set(artistId, artist?.genres || []);
        });
      } else {
        // If batch fails, set empty genres for all artists in batch
        batch.forEach(artistId => genresMap.set(artistId, []));
      }
    } catch (error) {
      console.error("Error fetching batch artist genres:", error);
      batch.forEach(artistId => genresMap.set(artistId, []));
    }
  }
  
  return genresMap;
};

export const getMultipleTracksFromSpotify = action({
  args: {
    trackIds: v.array(v.string()),
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<{ tracks: any[], errors: string[] }> => {
    const { trackIds, userId } = args;
    
    const tokenData = await ctx.runQuery(api.spotifyAuth.getSpotifyTokensById, { userId });
    if (!tokenData) {
      return { tracks: [], errors: ["User not authenticated with Spotify"] };
    }
    
    const accessToken = tokenData.accessToken;
    const batchSize = 50; // Spotify API limit
    const tracks: any[] = [];
    const errors: string[] = [];
    const uniqueArtistIds: Set<string> = new Set();
    
    // Step 1: Get all track data in batches
    for (let i = 0; i < trackIds.length; i += batchSize) {
      const batch = trackIds.slice(i, i + batchSize);
      const idsParam = batch.join(',');
      
      try {
        const url = `https://api.spotify.com/v1/tracks?ids=${idsParam}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        
        if (!response.ok) {
          errors.push(`Failed to fetch batch ${i / batchSize + 1}: ${response.status}`);
          continue;
        }
        
        const data = await response.json();
        const batchTracks = data.tracks || [];
        
        // Collect tracks and unique artist IDs
        for (const track of batchTracks) {
          if (track) {
            tracks.push(track);
            // Collect primary artist ID for genre fetching
            if (track.artists?.[0]?.id) {
              uniqueArtistIds.add(track.artists[0].id);
            }
          }
        }
      } catch (error) {
        errors.push(`Error processing batch ${i / batchSize + 1}: ${error}`);
      }
    }
    
    // Step 2: Batch fetch artist genres for all unique artists
    const artistGenresMap = await getBatchArtistGenres(Array.from(uniqueArtistIds), accessToken);
    
    // Step 3: Process tracks and store in database
    const processedTracks = [];
    for (const track of tracks) {
      const primaryArtistGenres = track.artists?.[0]?.id 
        ? artistGenresMap.get(track.artists[0].id) || []
        : [];
      
      const processedTrack = {
        id: track.id,
        uri: track.uri,
        name: track.name,
        artists: track.artists,
        album: track.album,
        duration_ms: track.duration_ms,
        popularity: track.popularity,
        genres: primaryArtistGenres,
      };
      
      processedTracks.push(processedTrack);
      
      // Store in database
      try {
        await ctx.runMutation(api.tracks.createTrack, {
          title: track.name,
          artist: track.artists?.[0]?.name || "",
          album: track.album?.name || "",
          genre: primaryArtistGenres,
          durationMs: track.duration_ms,
          spotifyTrackId: track.id,
          coverUrl: track.album?.images?.[0]?.url || "",
          releaseDate: track.album?.release_date || "",
          popularity: track.popularity,
        });
      } catch (error) {
        errors.push(`Error storing track ${track.name}: ${error}`);
      }
    }
    
    return { tracks: processedTracks, errors };
  },
});

// Optimized function to batch process tracks and reduce API calls
export const getOptimizedTracksFromSpotify = action({
  args: {
    trackSearchData: v.array(v.object({
      trackName: v.string(),
      artistName: v.string(),
      aiGenres: v.optional(v.array(v.string())),
    })),
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<{ 
    tracks: Array<{ spotifyURI: string; trackId: Id<"tracks"> | null; searchData: any }>, 
    errors: string[] 
  }> => {
    const { trackSearchData, userId } = args;
    
    const tokenData = await ctx.runQuery(api.spotifyAuth.getSpotifyTokensById, { userId });
    if (!tokenData) {
      console.error("User not authenticated with Spotify for batch track search");
      return { tracks: [], errors: ["User not authenticated with Spotify"] };
    }
    
    const accessToken = tokenData.accessToken;
    const errors: string[] = [];
    const foundTracks: any[] = [];
    const trackResults: Array<{ spotifyURI: string; trackId: Id<"tracks"> | null; searchData: any }> = [];
    
    // Step 1: Search for all tracks with improved search logic
    for (const searchData of trackSearchData) {
      try {
        // Clean and simplify search terms for better results
        const cleanTrackName = searchData.trackName
          .replace(/['"'"""]/g, '') // Remove quotes
          .replace(/\([^)]*\)/g, '') // Remove parentheses content
          .replace(/\[[^\]]*\]/g, '') // Remove bracket content
          .trim();
        
        const cleanArtistName = searchData.artistName.split(',')[0]
          .replace(/['"'"""]/g, '')
          .trim();
        
        // Try multiple search strategies
        const searchQueries = [
          `track:"${cleanTrackName}" artist:"${cleanArtistName}"`,
          `"${cleanTrackName}" "${cleanArtistName}"`,
          `${cleanTrackName} ${cleanArtistName}`
        ];
        
        let bestMatch = null;
        let searchResults = [];
        
        for (const query of searchQueries) {
          const url = `https://api.spotify.com/v1/search?type=track&limit=10&q=${encodeURIComponent(query)}`;
          
          const response = await fetch(url, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          
          if (!response.ok) {
            continue; // Try next query
          }
          
          const data = await response.json();
          const tracks = data.tracks?.items || [];
          searchResults = tracks;
          
          if (tracks.length === 0) {
            continue; // Try next query
          }
          
          // Try to find exact match first
          for (const track of tracks) {
            const trackMatch = track.name.trim().toLowerCase() === cleanTrackName.toLowerCase();
            const artistMatch = track.artists.some((artist: any) =>
              artist.name.trim().toLowerCase() === cleanArtistName.toLowerCase()
            );
            
            if (trackMatch && artistMatch) {
              bestMatch = track;
              break;
            }
          }
          
          if (bestMatch) break;
          
          // Try partial match
          for (const track of tracks) {
            const trackMatch = track.name.trim().toLowerCase().includes(cleanTrackName.toLowerCase()) ||
                              cleanTrackName.toLowerCase().includes(track.name.trim().toLowerCase());
            const artistMatch = track.artists.some((artist: any) =>
              artist.name.trim().toLowerCase().includes(cleanArtistName.toLowerCase()) ||
              cleanArtistName.toLowerCase().includes(artist.name.trim().toLowerCase())
            );
            
            if (trackMatch && artistMatch) {
              bestMatch = track;
              break;
            }
          }
          
          if (bestMatch) break;
        }
        
        if (!bestMatch) {
          console.error(`Track not found on Spotify: "${searchData.trackName}" by "${searchData.artistName}"`);
          if (searchResults.length > 0) {
            console.error(`Closest match was: "${searchResults[0].name}" by "${searchResults[0].artists.map((a: any) => a.name).join(', ')}"`);
          }
          errors.push(`No suitable match found for "${searchData.trackName}" by "${searchData.artistName}"`);
          continue;
        }
        
        foundTracks.push({ track: bestMatch, searchData });
        
      } catch (error) {
        console.error(`Exception during search for "${searchData.trackName}":`, error);
        errors.push(`Error searching for "${searchData.trackName}" by "${searchData.artistName}": ${error}`);
      }
    }
    
    if (foundTracks.length === 0) {
      return { tracks: [], errors };
    }
    
    // Step 2: Batch get detailed track data (up to 50 at a time)
    const trackIds = foundTracks.map(({ track }) => track.id);
    const batchSize = 50;
    const detailedTracks: any[] = [];
    
    for (let i = 0; i < trackIds.length; i += batchSize) {
      const batch = trackIds.slice(i, i + batchSize);
      const idsParam = batch.join(',');
      
      try {
        const url = `https://api.spotify.com/v1/tracks?ids=${idsParam}`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to fetch track details: HTTP ${response.status} - ${errorText}`);
          errors.push(`Failed to fetch detailed tracks batch ${i / batchSize + 1}: HTTP ${response.status} - ${errorText}`);
          continue;
        }
        
        const data = await response.json();
        const batchResults = data.tracks || [];
        detailedTracks.push(...batchResults);
      } catch (error) {
        console.error(`Exception fetching track details:`, error);
        errors.push(`Error fetching detailed tracks batch ${i / batchSize + 1}: ${error}`);
      }
    }
    
    // Step 3: Process all tracks and store in database (use AI-generated genres)
    for (let i = 0; i < detailedTracks.length; i++) {
      const track = detailedTracks[i];
      const { searchData } = foundTracks[i];
      
      if (!track) {
        trackResults.push({ spotifyURI: '', trackId: null, searchData });
        continue;
      }
      
      // Use AI-generated genres instead of fetching from Spotify
      const aiGenres = searchData.aiGenres || [];
      
      try {
        const trackId = await ctx.runMutation(api.tracks.createTrack, {
          title: track.name,
          artist: track.artists?.[0]?.name || "",
          album: track.album?.name || "",
          genre: aiGenres,
          durationMs: track.duration_ms,
          spotifyTrackId: track.id,
          coverUrl: track.album?.images?.[0]?.url || "",
          releaseDate: track.album?.release_date || "",
          popularity: track.popularity,
        });
        
        trackResults.push({ 
          spotifyURI: track.uri, 
          trackId, 
          searchData 
        });
      } catch (error) {
        console.error(`Failed to store track "${track.name}":`, error);
        errors.push(`Error storing track ${track.name}: ${error}`);
        trackResults.push({ spotifyURI: track.uri, trackId: null, searchData });
      }
    }
    
    return { tracks: trackResults, errors };
  },
});

export const deletePlaylistFromSpotify = action({
    args: {
        playlistId: v.id("playlists"),
    },
    handler: async (ctx, args): Promise<void> => {
        const { playlistId } = args;

        // Validate the playlist exists
        const playlist: Doc<"playlists"> | null = await ctx.runQuery(api.playlistActions.getPlaylist, { playlistId });
        if (!playlist) {    
            throw new Error("Playlist not found");
        }

        // Delete the playlist from Spotify
        const tokenData = await ctx.runQuery(api.spotifyAuth.getSpotifyTokensById, { userId: playlist.userId });
        if (!tokenData) {
            throw new Error("User not authenticated with Spotify");
        }

        const accessToken = tokenData.accessToken;

        const deleteRes = await fetch(`https://api.spotify.com/v1/playlists/${playlist.spotifyPlaylistId}/followers`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!deleteRes.ok) {
            const err = await deleteRes.text();
            throw new Error(`Failed to delete Spotify playlist: ${err}`);
        }
    },
});