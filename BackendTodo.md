## Individual Playlists

### Required Backend APIs for Playlist Page

1. **Get Playlist Details**
   - `GET /api/playlists/:playlistId`
   - Fetches playlist metadata, description, and tracks.

2. **Update Playlist Description**
   - `PUT /api/playlists/:playlistId/description`
   - Body: `{ description: string }`
   - Updates the playlist description.

3. **Like/Unlike Playlist**
   - `POST /api/playlists/:playlistId/like` (to like)
   - `DELETE /api/playlists/:playlistId/like` (to unlike)
   - Toggles the like status for the current user.

4. **Delete Track from Playlist**
   - `DELETE /api/playlists/:playlistId/tracks/:trackId`
   - Removes a track from the playlist.