import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from "./auth/ProtectedRoute";
import Home from './pages/Home.tsx';
import Playlists from './pages/Playlists.tsx';
import Playlist from './pages/Playlist.tsx';
import Login from './pages/Login.tsx';
import Background from './components/app/Background.tsx';

function App() {
  return (
    <>
      {/* Background is rendered behind everything else */}
      <div className="fixed inset-0 -z-10">
        <Background />
      </div>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/playlists" element={<Playlists />} />
                  <Route path="/playlist" element={<Playlist />} />
                  {/* Add more protected routes here */}
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
