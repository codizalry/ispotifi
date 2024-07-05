import Login from './pages/form/login';
import Main from './pages/Main';
import Search from './pages/search';
import Album from './pages/album';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SearchOutput from './pages/searchOutput';
import Genre from './pages/genre';
import Tracks from './pages/tracks';
import Profile from './pages/profile';
import Collection from './pages/collection';
import Playlist from './pages/playlist';
import Artist from './pages/artist';

function App() {
  // let urlParams = new URLSearchParams(window.location.search);

  return (
    // default slash /#/ -> /#/dashboard
    // noslash /# /#dashboard
    // hashbang /#!/ /#!/dashboard

      <BrowserRouter>
        <Routes>
        {'access_token' in sessionStorage ? (
          <Route path="/" element={<Main />}/>
        ) : (
          <Route path="/" element={<Login/>}/>
        )}
        <Route path="/search" element={<Search />}/>
        <Route path="/search/:id" element={<SearchOutput />}/>
        <Route path="/album/:id" element={<Album />}/>
        <Route path="/genre/:id" element={<Genre />}/>
        <Route path="/tracks/:id" element={<Tracks />}/>
        <Route path="/playlist/:id" element={<Playlist />}/>
        <Route path="/artist/:id" element={<Artist />}/>
        <Route path="/profile/" element={<Profile />}/>
        <Route path="/collection/tracks" element={<Collection />}/>
        </Routes>
     </BrowserRouter>
  );
}

export default App;
