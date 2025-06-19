import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from "./auth/ProtectedRoute";
import Home from './pages/Home.tsx';
import Playlists from './pages/Playlists.tsx';
import Playlist from './pages/Playlist.tsx';
import Login from './pages/Login.tsx';
import Background from './components/app/Background.tsx';
import Header from './components/app/Header.tsx';
import { useState } from 'react';
import { Toaster } from 'sonner';

function App() {

  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);

  return (
    <>
      <div className="fixed inset-0 -z-10">
        <Background />
      </div>
      {/* Toaster in the bottom right */}
      <Toaster richColors position="bottom-right" />
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <div>
                  <Header isSpotifyConnected={isSpotifyConnected} setSpotifyConnected={setIsSpotifyConnected} />
                </div>
                <div>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/playlists" element={<Playlists />} />
                    <Route path="/playlist" element={<Playlist />} />
                  </Routes>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
