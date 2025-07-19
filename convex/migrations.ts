import { mutation } from "./_generated/server";

// Migration to remove spotifyTrackUri field from all tracks
export const migrateRemoveSpotifyTrackUri = mutation({
  args: {},
  handler: async (ctx) => {
    const tracks = await ctx.db.query("tracks").collect();
    
    let migratedCount = 0;
    
    for (const track of tracks) {
      if ('spotifyTrackUri' in track) {
        // Remove the spotifyTrackUri field by replacing the document
        const { spotifyTrackUri, ...trackWithoutUri } = track;
        
        await ctx.db.replace(track._id, trackWithoutUri);
        migratedCount++;
      }
    }
    
    return { 
      message: `Migration completed. Removed spotifyTrackUri from ${migratedCount} tracks.`,
      totalTracks: tracks.length,
      migratedTracks: migratedCount
    };
  },
});

// Helper to check migration status
export const checkMigrationStatus = mutation({
  args: {},
  handler: async (ctx) => {
    const tracks = await ctx.db.query("tracks").collect();
    const tracksWithUri = tracks.filter(track => 'spotifyTrackUri' in track);
    
    return {
      totalTracks: tracks.length,
      tracksWithUri: tracksWithUri.length,
      migrationNeeded: tracksWithUri.length > 0
    };
  },
});