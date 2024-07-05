import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Link, Typography } from "@mui/material";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { FaPlay } from "react-icons/fa";
import { FaCircleChevronLeft, FaCircleChevronRight  } from "react-icons/fa6";
import { PiClock } from "react-icons/pi";
import SideBar from "../components/sidebar";
import BasicAuth from "../hook/basicAuth";
import Player from "../components/player";
import ImageWithBackground from "../components/ImageWithBackground";
import Playing from "../components/playing";
import SpotifyPlayer from 'react-spotify-web-playback';
import Navigation from "../components/navigation";
import CardImage from "../components/cardImage";
import SavedSong from "../components/savedSong";
import SavedPlaylist from "../components/savedPlaylist";
import { music } from "../assets";
import { FaCircle } from "react-icons/fa6";
const CLIENT_ID = '4af4046d93284335815103e402797520';
const CLIENT_SECRET = '58c1d3a10f444659a39b2185adcca36c';

const Playlist = () => {

    type albumData = { 
      added_at: string,
      track: {
        name: string,
        album: {
            id: string,
            name: string,
            images: {
                url: string
            }[],
        },
        artists: {
            name: string,
        }[],
        duration_ms: number,
        id: string,
      },
    }

    type artistData = { 
      id: string,
      description: string,
      name: string, 
      type: string,
      tracks: {
        total: number,
      },
      followers: {
        total: number,
      },
      owner: {
        display_name: string,
        id: string,
      }, 
      images: { 
        url: string,
      }[],
    }

    const { id } = useParams<{ id: string }>();
    const [accessToken, setAccessToken] = useState('');
    const [albumsList, setAlbumsList] = useState<albumData[]>([]);
    const [albumInfo, setAlbumInfo] = useState<artistData[]>([]);
    const [playing, setPlaying] = useState('');
    const [sidePanelSize, setSidePanelSize] = useState('inherit');
    const [tracker, setTracker] = useState<string>(localStorage.getItem('test') || 'false');
    
    // Basic Auth
    BasicAuth();
        
    // Fetch Access Token
    useEffect(() => {
      
      const authParameters = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
      };
      fetch('https://accounts.spotify.com/api/token', authParameters)
        .then(result => result.json())
        .then(data => {
          setAccessToken(data.access_token);
          result(data.access_token);
        });
    }, [localStorage.getItem('test')]);

    const result = async (token: string) => {
      var headers = { 
        method: 'GET', 
        headers: { 
          'Content-Type': 'appliction/json', 
          'Authorization': 'Bearer ' + token
        } 
      }

      const albumListResponse = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks?limit=20`, headers);
      const albumListData = await albumListResponse.json();
      setAlbumsList(albumListData.items);
      
      const albumInfoResponse = await fetch(`https://api.spotify.com/v1/playlists/${id}`, headers);
      const albumInfoData = await albumInfoResponse.json();
      setAlbumInfo([albumInfoData]);
    }

    const handleSubmit = () => {
      setTracker(tracker == 'true' ? 'false' : 'true');
    }
    return (
    <>
      <PanelGroup autoSaveId="spotifyContainer" direction="horizontal" style={{margin: '10px', overflow: 'hidden', width: 'inherit', minWidth: '1200px'}}>
        <Panel defaultSize={25} collapsible={true} collapsedSize={5} minSize={18}maxSize={40} style={{display: 'flex'}} onResize={(size: number) => { setSidePanelSize(size < 18 ? 'none' : 'inherit'); }}>
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

            <Box
                component="div"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                position="sticky"
                top="0"
                width="100%"
                maxWidth='1955px'
                zIndex="10"
                padding="10px 0px" >
                  {albumInfo.length > 0 && <Box position='absolute' zIndex={2} top={0} width='100%' height='100%'><ImageWithBackground imgSrc={albumInfo[0].images ? albumInfo[0].images[0].url : music} customClass=""><></></ImageWithBackground></Box>}
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
                  padding="10px 20px" >
                    <Box display='flex'>
                      <Typography onClick={() => window.history.back()} mr={0.75} sx={{cursor: 'pointer'}}><FaCircleChevronLeft style={{width:'30px', height: '30px'}}/></Typography>
                      <Typography sx={{cursor: 'no-drop'}}><FaCircleChevronRight  style={{width:'30px', height: '30px', opacity: '0.7'}}/></Typography>
                    </Box>
                    <Navigation/>
                </Box>
              </Box>

              <Box>
                {albumInfo.length > 0 && 
             
                  <Box display='flex' alignItems='end' position='relative' py={2}>
                    <Box position='absolute' zIndex={2} top={0} width='100%' height={250} sx={{backgroundImage: 'linear-gradient(transparent 0, rgba(0, 0, 0, .5) 100%)'}}><ImageWithBackground imgSrc={albumInfo[0].images ? albumInfo[0].images[0].url : music} customClass=""><></></ImageWithBackground></Box>
                      <Box zIndex={4} pl={2}>
                        <img src={albumInfo[0].images ? albumInfo[0].images[0].url : music} width={150} style={{borderRadius: '5px', background: (albumInfo[0].images ? 'transparent' : '#333333')}}/>
                      </Box>
                      <Box ml={2} zIndex={4} className="text-cw">
                        <Typography variant="body2" textTransform='capitalize' fontWeight='bold'>{albumInfo[0].type}</Typography>
                        <Typography variant="h2" fontWeight='bold'>{albumInfo[0].name}</Typography>
                        <Typography variant="body2" color='#FFFFFFB2'>{albumInfo[0].description}</Typography>
                        <Typography variant="body2" color='#fff'>
                          <Typography component='span' fontSize='14px' fontWeight='bold' display='flex' alignItems='center'>
                            {albumInfo[0].owner.display_name ? albumInfo[0].owner.display_name : ''}
                            { albumInfo[0].followers.total > 0 &&
                              <>
                                <FaCircle style={{ fontSize: '5px', margin: '0 5px' }}/> 
                                {`${albumInfo[0].followers.total.toLocaleString()} saves`}
                              </>
                            }
                            <FaCircle style={{ fontSize: '5px', margin: '0 5px' }}/>  
                            {albumInfo[0].tracks.total} Song{albumInfo[0].tracks.total > 1 && <>s</>}
                          </Typography>
                        </Typography>
                      </Box>
                  </Box>
                  }
                </Box>

                <Box position='relative'>


                {albumInfo.length > 0 && 
                  <>
                    <SavedPlaylist trackID={albumInfo[0]['id']} savedPlaylist={handleSubmit}/>
                    <Box position='absolute' zIndex={2} top={0} width='100%' height={250} sx={{}}><ImageWithBackground imgSrc={albumInfo[0].images ? albumInfo[0].images[0].url : music} customClass="linear-gradient(rgba(0, 0, 0, .6) 0, #121212 100%)"><></></ImageWithBackground></Box>
                  </>
                }
                  
                  <Box position='sticky' top='95px' width='100%' zIndex={8} mb={2} pt={2} pb={1} display='flex' justifyContent="space-between" alignItems='center' borderBottom='1px solid #a7a7a7' sx={{color: '#a7a7a7'}}>
                      <Box display='flex' alignItems='center' pl={3.25}>
                        <Typography component="p" sx={{fontWeight: 'bold', fontSize: '14px', padding: '0 3px'}}>#</Typography>
                        <Typography component="p" ml={3} sx={{fontWeight: 'bold', fontSize: '14px'}}>Title</Typography>
                      </Box>
                      <Typography mr={1} component="span" pr={3.25}></Typography>
                      <Box display='flex' alignItems='center'>
                          <Link color='#a7a7a7' width='200px' whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis' sx={{ ':hover': { color: '#fff', textDecoration: 'underline !important' }  }}>Album</Link>
                          <Typography variant='body2' color='#a7a7a7' ml={8} width='100px'>Date added</Typography>
                          <Box display='flex' alignItems='center' width='90px' justifyContent='end' ml={8} mr={5}>
                            <Typography component="span" sx={{color: '#a7a7a7'}}><PiClock /></Typography>
                          </Box>
                      </Box>
                  </Box>
                  <Box position='relative' zIndex={5} px={2}>
                    { albumsList &&
                      albumsList.map((album, i) => {
                        const duration = new Date(album['track']['duration_ms']);
                        const date = new Date(album['added_at']).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                        return (
                          <Box onClick={handleSubmit} px={1.25} py={1} display="flex" justifyContent="space-between" alignItems="center" borderRadius={1.25} sx={ { transition: '0.3s', ':hover': { background: 'rgba(179,179,179, 0.1)', cursor: 'pointer' }, ':hover .image-content img': { opacity: 0.5 }, ':hover .image-content span': { opacity: 1 }, ':hover .track_play': { display: 'block' }, ':hover .track_no': { display: 'none' } } } key={album['track']['id']}>
                            <Box display="flex" alignItems="center" >
                              <Box width={30}>
                                <Typography className='track_no' component="p" m={0} fontWeight='bold' fontSize='14px' color='#a7a7a7'>{i + 1}</Typography>
                                <Typography component="p" className="text-cw track_play" sx={{display: 'none', fontWeight: 'bold', fontSize: '14px', margin: '0'}}><FaPlay/></Typography>
                              </Box>
                              <img src={album['track']['album']['images'][0]['url']} width={40} height={40} style={{borderRadius: '5px'}}/>
                              <Box ml={1}>
                                <Typography component="p" className="text-cw" sx={{fontWeight: 'bold', fontSize: '14px', margin: '0'}}>{album['track']['name']}</Typography>
                                <Link href={`/search/${album['track']['artists'][0]['name']}`} mr='5px' color='#a7a7a7' fontSize='14px' sx={{ ':hover': { color: '#fff', textDecoration: 'underline !important' }  }}>{album['track']['artists'][0]['name']}</Link>
                                {
                                  album['track']['artists'][1] &&
                                  <Link href={`/search/${album['track']['artists'][1]['name']}`} mr='5px' color='#a7a7a7' sx={{ ':hover': { color: '#fff', textDecoration: 'underline !important' }  }}>{album['track']['artists'][1]['name']}</Link>
                                }
                                {
                                  album['track']['artists'][2] &&
                                  <Link href={`/search/${album['track']['artists'][2]['name']}`} mr='5px' color='#a7a7a7' sx={{ ':hover': { color: '#fff', textDecoration: 'underline !important' }  }}>{album['track']['artists'][2]['name']}</Link>
                                }
                                {
                                  album['track']['artists'][3] &&
                                  <Link href={`/search/${album['track']['artists'][3]['name']}`} mr='5px' color='#a7a7a7' sx={{ ':hover': { color: '#fff', textDecoration: 'underline !important' }  }}>{album['track']['artists'][3]['name']}</Link>
                                }
                              </Box>
                            </Box>

                            <Box display='flex' alignItems='center'>
                                <Link href={`/album/${album['track']['album']['id']}`} color='#a7a7a7' width='200px' whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis' sx={{ ':hover': { color: '#fff', textDecoration: 'underline !important' }  }}>{album['track']['album']['name']}</Link>
                                <Typography variant='body2' color='#a7a7a7' ml={8} width='100px'>{date}</Typography>
                                <Box display='flex' alignItems='center' width='90px' justifyContent='space-between' ml={10}>
                                <SavedSong
                                    trackID={album['track']['id']}
                                    />
                                <Typography component="span" sx={{color: '#a7a7a7'}}>{`${duration.getMinutes()}:${(duration.getSeconds() < 10 ? '0' : '') + duration.getSeconds()}`}</Typography>
                                </Box>
                            </Box>
                          </Box>
                        )
                      })              
                    }
                  </Box>    
                </Box>
          </Box>
        </Panel>

        {playing.trim().length > 0 &&
          <>
            <SpotifyPlayer
              token={(sessionStorage.getItem('access_token') || '')}
              styles={{
                bgColor: "rgb(19, 18, 18)",
                color: "#ffffff",
                sliderColor: "#1cb954",
                sliderHandleColor: "whitesmoke",
                trackArtistColor: "#ffffff",
                trackNameColor: "#fff",
              }}
              uris={['spotify:artist:6HQYnRM4OzToCYPpVBInuU']}
              autoPlay
            />
          </>
        }

      </PanelGroup>
      <Player
        trackID={playing}
        accessTokens={accessToken}/>
    </>
  )
}

export default Playlist