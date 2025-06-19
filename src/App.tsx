import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Playlists from './pages/Playlists.tsx';
import Playlist from './pages/Playlist.tsx';

function App() {

  return (<>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlist" element={<Playlist />} />
        </Routes>
    </>
  );
}

export default App;
