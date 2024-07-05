import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../components/sidebar"
import BasicAuth from "../hook/basicAuth"
import { Box, Container, Grid, Link, TextField, Typography } from "@mui/material";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import { FaPlay } from "react-icons/fa";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { FaCircleChevronLeft, FaCircleChevronRight  } from "react-icons/fa6";
import Player from "../components/player";
import Navigation from "../components/navigation";
import CardImage from "../components/cardImage";
import TableList from "../components/tableList";

const CLIENT_ID = '4af4046d93284335815103e402797520';
const CLIENT_SECRET = '58c1d3a10f444659a39b2185adcca36c';

const SearchOutput = () => {

  type artistData = { 
    id: string,
    name: string, 
    type: string, 
    images: { 
      url: string 
    }[] 
  }
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchInput, setSearchInput] = useState(id);
  const [accessToken, setAccessToken] = useState('');
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState<artistData[]>([]);
  const [sidePanelSize, setSidePanelSize] = useState('');
  const [tracker, setTracker] = useState<string>(localStorage.getItem('test') || 'false');
  const [playlists, setPlaylists] = useState([]);

  // Basic Auth
  BasicAuth();

  useEffect(()=>{
    // API Access Token
    const authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
    };

    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(response => response.json())
      .then(data => {
        setAccessToken(data.access_token);
        search(data.access_token);
      })

      
      
  }, [localStorage.getItem('test')]);
  // Search

  async function search(token: string) {

    // Get request using search to get the artist ID
    var searchParameters = { 
      method: 'GET', 
      headers: { 
        'Content-Type': 'appliction/json', 
        'Authorization': 'Bearer ' + token 
      } 
    }

    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist&market=PH', searchParameters)
      .then(response => response.json())
      .then(data => { return data.artists.items[0].id })
      .catch((error) => { sessionStorage.clear(); });
    await fetch('https://api.spotify.com/v1/artists/' + artistID, searchParameters)
    .then(response => response.json())
    .then(data => { setArtists([data]) })

    // get request with artist ID grab all the albums from that artist
    await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums?include_groups=album&market=PH&limit=20', searchParameters)
      .then(response => response.json())
      .then(data => {
        setAlbums(data.items);
      })
      .catch((error) => { sessionStorage.clear(); });

    // get request with artist ID grab all the top track from that artist
    await fetch('https://api.spotify.com/v1/artists/' + artistID + '/top-tracks?include_groups=album&market=PH&limit=5', searchParameters)
      .then(response => response.json())
      .then(data => {
        setTopTracks(data.tracks)
      })
      .catch((error) => { sessionStorage.clear(); });

      
    // get request with artist ID grab all the albums from that artist
    await fetch('https://api.spotify.com/v1/search?q='+searchInput+'&type=playlist&market=PH&limit=10', searchParameters)
    .then(response => response.json())
    .then(data => {
      setPlaylists(data.playlists.items);
    })
    .catch((error) => { sessionStorage.clear(); });

  }

  const handleSubmit = () => {
    setTracker(tracker === 'true' ? 'false' : 'true');
  }
  
  return (
    <>
      <PanelGroup autoSaveId="spotifyContainer" direction="horizontal" style={{margin: '10px', overflow: 'hidden', width: 'inherit', minWidth: '1200px'}}>
        <Panel defaultSize={25} collapsible={true} collapsedSize={5} minSize={18}maxSize={40} style={{display: 'flex'}} onResize={(size: number) => { setSidePanelSize(size < 18 ? 'none' : 'inherit') }}>
          <SideBar
            panelSize={sidePanelSize}
            />
        </Panel>
      <PanelResizeHandle />
        <Panel minSize={50} style={{marginLeft: '5px'}}>
          <Box 
            component="div" 
            width="100%"
            borderRadius="10px"
            height="87vh"
            sx={{background: '#121212', overflowY: 'scroll'}}>
            <Container sx={{ padding: '20px 0', position: 'relative'}} maxWidth={false}>

              <Box
                component="div"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                position="sticky"
                top="0"
                width="100%"
                maxWidth='1955px'
                zIndex="5"
                padding="10px 0px"
                sx={ { backgroundColor: 'rgb(18, 18, 18)' } } >
                <Box display='flex' alignItems='center' minWidth='35%' maxWidth='50%'>
                    <Typography onClick={() => navigate(-1)} mr={0.75} color='#fff' sx={{cursor: 'pointer'}}><FaCircleChevronLeft style={{width:'30px', height: '30px'}}/></Typography>
                    <Typography onClick={() => navigate(+1)} color='#fff' sx={{cursor: 'pointer'}}><FaCircleChevronRight  style={{width:'30px', height: '30px'}}/></Typography>
                    <TextField type="search" placeholder="What do you want to play ?"
                    value={searchInput}
                    autoFocus
                    sx={
                        {
                        marginLeft: '15px',
                        background: 'rgba(36, 36, 36, 0.8)',
                        border: '0.1px solid rgba(36, 36, 36, 0.8)',
                        borderRadius: '50px',
                        width: '100%',
                        ':hover': {
                            background: 'rgba(36, 36, 36, 1)',
                            border: '0.1px solid rgba(83,83,83, 0.8)',
                        },
                        ':hover svg': {
                            color: '#fff',
                            fontWeight: 'bold'
                        },
                        '& svg' : {
                            marginRight: '10px'
                        },
                        '& fieldset': {
                            outline: 'none',
                            border: '0 solid',
                            borderColor: 'transparent !important'
                        },
                        '& input[type="search"]::-webkit-search-cancel-button': {
                            filter: 'invert(100%) sepia(10%) saturate(500%) hue-rotate(90deg)'
                        }
                        }
                    }
                    onKeyPress={event=>{
                        if (searchInput) {
                            search(accessToken);
                        }
                    }}
                    onChange={event => {
                        navigate('/search/'+event.target.value);
                        setSearchInput(event.target.value)
                        search(accessToken);
                    }}
                    InputProps={ {
                        startAdornment: <PiMagnifyingGlassBold/>,
                        style: {
                        color: '#b3b3b3',
                        fontSize: '18px',
                        }
                    } }
                    />
                </Box>
                  <Navigation/>
              </Box>

              {searchInput !== '' &&
                <>
                  <Grid container spacing={2} my={2}  maxWidth='1955px'>
                      <Grid item xs={12} md={4}>
                          <h2 className="text-cw">Top result</h2>
                          {artists.length > 0 && (

                            <Link
                              href={`/artist/${artists[0].id}`}
                              sx={ { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', textDecoration: 'none', backgroundColor: 'rgba(83,83,83, 0.1)', padding: '20px', position: 'relative', borderRadius: '10px', height: '70%', transition: '0.3s', ':hover': { backgroundColor: 'rgba(83,83,83, 0.2)', }, '&:hover span': { opacity: '1 !important', bottom: '15px', }, } }
                              >
                              <img src={artists[0].images[0].url} width={100} height={100} style={{borderRadius: '50%'}}/>
                              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', marginTop: '15px'}}>{artists[0].name}</Typography>
                              <Typography variant="body2" sx={{ color: '#a7a7a7', textTransform: 'capitalize'}}>{artists[0].type}</Typography>

                              <Typography component="span" sx={ { transition: '.5s ease', position: 'absolute', width: '50px', height: '50px', right: 15, bottom: 5, fontSize: '20px', color: '#000', opacity: 0, backgroundColor: '#1db954', borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' } } >
                                  <FaPlay/>
                                </Typography>
                            </Link>
                          )}
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <h2 className="text-cw">TOP Tracks Songs</h2>
                        <Box className="text-cw">
                          {
                            topTracks.map((track, index) => {
                              const date = new Date(track['duration_ms']);
                              if (index >= 4)  return;
                              return (
                                <TableList
                                    key={index}
                                    trackID={track['id']}
                                    image={track['album']['images'][0]['url']}
                                    title={track['name']}
                                    artist0={track['artists'][0]['name']}
                                    artist1={track['artists'][1]}
                                    artist2={track['artists'][2]}
                                    artist3={track['artists'][3]}
                                    duration={`${date.getMinutes()}:${(date.getSeconds() < 10 ? '0' : '') + date.getSeconds()}`}
                                    savedSong={handleSubmit}
                                  />
                              )
                            })
                          }
                        </Box>
                      </Grid>
                  </Grid>
                  
                  <br/>
                  {artists.length > 0 && (
                    <Typography variant="h5" maxWidth='1955px' sx={{ color: '#fff', fontWeight: 'bold', marginTop: '15px'}} >Featuring {artists[0].name}</Typography>
                  )}
                  <Box display="flex" flexWrap="wrap" pb={5} marginLeft={-1} maxWidth='1955px'>
                  {
                    albums.map( (album, i) => {
                      return (
                          <CardImage
                            key={i}
                            link={'/album/'+album['id']}
                            imageBackground={album['images'] ? '' : '#333333'}
                            imageStyle={'square'}
                            image={album['images'][0]['url']}
                            title={album['name']}
                            artist=' By Spotify '
                          />
                      )
                    } )
                  }
                  </Box>

                  <Typography variant="h5" maxWidth='1955px' sx={{ color: '#fff', fontWeight: 'bold', marginTop: '15px'}} >Playlist</Typography>
                  <Box display="flex" flexWrap="wrap" pb={5} marginLeft={-1} maxWidth='1955px'>
                  {
                    playlists.map( (playlist, i) => {
                      return (
                          <CardImage
                            key={i}
                            link={'/playlist/'+playlist['id']}
                            imageBackground={playlist['images'] ? '' : '#333333'}
                            imageStyle={'square'}
                            image={playlist['images'][0]['url']}
                            title={playlist['name']}
                            artist={` By ${playlist['owner']['display_name']} `}
                          />
                      )
                    } )
                  }
                  </Box>
                </>
              }

            </Container>
          </Box>
        </Panel>
    </PanelGroup>
    <Player
      trackID=''
      accessTokens={accessToken}/>
    </>
  )
}

export default SearchOutput