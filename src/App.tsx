import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Page2 from './pages/Page2.tsx';

function App() {

  return (
    <div>
      <div>
        <Link to="/">Home</Link>
        <Link to="/page2">Page 2</Link>
      </div>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/page2" element={<Page2 />} />
        </Routes>
      </div>
    </div>
  );
}

export default App
