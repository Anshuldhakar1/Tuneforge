import { Routes, Route, Outlet } from 'react-router-dom';
import { ProtectedRoute } from "./auth/ProtectedRoute";
import Home from './pages/Home.tsx';
import Playlists from './pages/Playlists.tsx';
import Playlist from './pages/Playlist.tsx';
import Login from './pages/Login.tsx';
import Background from './components/app/Background.tsx';
import Header from './components/app/Header.tsx';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { useAuth } from './auth/AuthContext.tsx';

type ProtectedLayoutProps = {
  isSpotifyConnected: boolean;
  setIsSpotifyConnected: React.Dispatch<React.SetStateAction<boolean>>;
  user: {
    username: string;
    email: string;
    userId: string;
  };
  signout: () => void;
};

function ProtectedLayout({ isSpotifyConnected, setIsSpotifyConnected, user, signout }: ProtectedLayoutProps) {
  return (
    <>
      <Header
        isSpotifyConnected={isSpotifyConnected}
        setSpotifyConnected={setIsSpotifyConnected}
        user={user}
        signout={signout}
      />
      <Outlet />
    </>
  );
}

function App() {
  const { user, signout, loading } = useAuth();
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);

  // Optional: show a loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 -z-10">
        <Background />
      </div>
      <Toaster richColors position="bottom-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <ProtectedLayout
                isSpotifyConnected={isSpotifyConnected}
                setIsSpotifyConnected={setIsSpotifyConnected}
                user={user!}
                signout={signout}
              />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home user={user!} loading={loading} signout={signout} />} />
          <Route path="/playlists" element={<Playlists user={user!} />} />
          <Route path="/playlist/:playlistId" element={<Playlist user={user!} />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
