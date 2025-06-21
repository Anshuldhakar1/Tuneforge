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

---

## All Playlists

### Required Backend APIs for Playlists Page

1. **Get All Playlists for User**
   - `GET /api/playlists?userId=...`
   - Fetches all playlists belonging to the user.

2. **Like/Unlike Playlist**
    - Already taken care of.

3. **Delete Playlist**
   - `DELETE /api/playlists/:playlistId`
   - Deletes a playlist.

*Note: Searching and filtering are handled client-side, so no separate search API is needed.*

---

## Spotify Connection

### Required Backend APIs for Spotify Integration

1. **Get Spotify Auth URL**
   - `POST /api/spotify/auth-url`
   - Returns the Spotify authorization URL for OAuth.

2. **Exchange Spotify Code for Tokens**
   - `POST /api/spotify/exchange-code`
   - Exchanges the authorization code for access and refresh tokens.

3. **Store Spotify Tokens**
   - `POST /api/spotify/store-tokens`
   - Stores Spotify access and refresh tokens for the user.

4. **Get Spotify Tokens**
   - `GET /api/spotify/tokens`
   - Retrieves the user's Spotify tokens.

5. **Refresh Spotify Token**
   - `POST /api/spotify/refresh-token`
   - Refreshes the Spotify access token.

6. **Search Spotify Track**
   - `POST /api/spotify/search-track`
   - Searches for a track on Spotify by name and artist.

7. **Create Spotify Playlist**
   - `POST /api/spotify/create-playlist`
   - Creates a new playlist on Spotify and adds tracks.

8. **Transfer Playlist to Spotify**
   - `POST /api/spotify/transfer-playlist`
   - Transfers an existing playlist to Spotify.

9. **Disconnect Spotify**
   - `POST /api/spotify/disconnect`
   - Disconnects the user's Spotify account.

10. **Delete Tracks from Playlist**
    - `DELETE /api/playlists/:playlistId/tracks`
    - Removes multiple tracks