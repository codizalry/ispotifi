import { useEffect, useState } from "react";
import { Box, Link, Typography } from "@mui/material";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { FaPlay } from "react-icons/fa";
import { FaCircleChevronLeft, FaCircleChevronRight  } from "react-icons/fa6";
import { PiClock } from "react-icons/pi";
import SideBar from "../components/sidebar";
import BasicAuth from "../hook/basicAuth";
import Player from "../components/player";
import ImageWithBackground from "../components/ImageWithBackground";
import SpotifyPlayer from 'react-spotify-web-playback';
import Navigation from "../components/navigation";
import { person, likeSong } from '../assets';
import SavedSong from "../components/savedSong";

const timeAgo = (date: string): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const units = [
      { name: 'year', seconds: 31536000 },
      { name: 'month', seconds: 2592000 },
      { name: 'week', seconds: 604800 },
      { name: 'day', seconds: 86400 },
      { name: 'hour', seconds: 3600 },
      { name: 'minute', seconds: 60 },
      { name: 'second', seconds: 1 }
  ];

  for (const unit of units) {
      const interval = Math.floor(diffInSeconds / unit.seconds);
      if (interval >= 1) {
          return interval === 1 ? `${interval} ${unit.name} ago` : `${interval} ${unit.name}s ago`;
      }
  }

  return 'just now';
}

const Collection = () => {
    type profileType = {
        display_name: string,
        email: string,
        type: string
        followers: {
            href: string,
            total: string,
        },
        images: { 
            url: string,
        }[],
    }
    type tracks = {
        added_at: string,
        track: {
            id: string,
            name: string,
            album: {
                id: string,
                name: string,
                images: { 
                    url: string,
                }[],
            }
            duration_ms: number,
            artists: {
                name: string,
            }[]
        }
    }
    const accessToken = sessionStorage.getItem('access_token') || '';
    const [profile, setProfile] = useState<profileType[]>([]);
    const [sidePanelSize, setSidePanelSize] = useState('inherit');
    const [track, setTrack] = useState<tracks[]>([]);
    const [tracker, setTracker] = useState<string>(localStorage.getItem('test') || 'false');
    // Basic Auth
    BasicAuth();
        
    // Fetch Access Token
    useEffect(() => {
        result(accessToken);
    }, [localStorage.getItem('test'), accessToken]);

    const result = async (token: string) => {
      var headers = { 
        method: 'GET', 
        headers: { 
          'Content-Type': 'appliction/json', 
          'Authorization': 'Bearer ' + token
        } 
      }

      await fetch(`https://api.spotify.com/v1/me`, headers)
        .then(data => data.json())
        .then(data => { setProfile([data]) })
        .catch((error) => { sessionStorage.clear(); });

      await fetch(`https://api.spotify.com/v1/me/tracks`, headers)
        .then(data => data.json())
        .then(data => { setTrack(data.items); })
        .catch((error) => { sessionStorage.clear(); });
    }

    const handleSubmit = () => {
      setTracker(tracker === 'true' ? 'false' : 'true');
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
                  <Box position='absolute' zIndex={2} top={0} width='100%' height='100%'><ImageWithBackground imgSrc={likeSong} customClass=""><></></ImageWithBackground></Box>
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
                {
                  profile.length > 0 &&
                  <Box display='flex' alignItems='end' position='relative' py={2}>
                    <Box position='absolute' zIndex={2} top={0} width='100%' height={250} sx={{backgroundImage: 'linear-gradient(transparent 0, rgba(0, 0, 0, .5) 100%)'}}><ImageWithBackground imgSrc={likeSong} customClass=""><></></ImageWithBackground></Box>
                      <Box zIndex={4} pl={2}>
                        <img src={likeSong} width={200} style={{borderRadius: '5px'}} alt='Song Profile'/>
                      </Box>
                      <Box ml={2.50} zIndex={4} className="text-cw">
                        <Typography variant="body2" textTransform='capitalize' fontWeight='bold'>Playlist</Typography>
                        <Typography variant="h1" fontWeight='bold'>Liked Songs</Typography>
                        <Box display='flex' alignItems='center' pb={0.50}>
                          <Box width={24} height={24} mr={1}>
                            <img src={profile[0].images[1] ? profile[0].images[1].url : person} style={{ borderRadius: '50%', height: '100%', width: '100%', objectFit: 'cover'}} alt='Person Profile'/> 
                          </Box>
                          <Typography component='span' fontSize='14px' fontWeight='bold'>{profile[0]['display_name']}</Typography>
                          <Typography component='span' mx={0.50}>-</Typography>
                          <Typography component='span' fontSize='14px'>{track.length} song{track.length > 1 && <>s</>}</Typography>
                        </Box>
                      </Box>
                  </Box>
                }

                </Box>

                <Box position='relative'>
                <Box position='absolute' zIndex={2} top={0} width='100%' height={250} sx={{}}><ImageWithBackground imgSrc={likeSong} customClass="linear-gradient(rgba(0, 0, 0, .6) 0, #121212 100%)"><></></ImageWithBackground></Box>
                  
                  <Box position='sticky' top='95px' width='100%' zIndex={8} mb={2} pt={2} pb={1} display='flex' justifyContent="space-between" alignItems='center' borderBottom='1px solid #a7a7a7' sx={{color: '#a7a7a7'}}>
                      <Box display='flex' alignItems='center' pl={3.25}>
                        <Typography component="p" sx={{fontWeight: 'bold', fontSize: '14px', padding: '0 3px'}}>#</Typography>
                        <Typography component="p" ml={3} sx={{fontWeight: 'bold', fontSize: '14px'}}>Title</Typography>
                      </Box>
                      
                      <Box display='flex' alignItems='center'>
                        <Typography mr={25} component="span" pr={3.25}>Album</Typography>
                        <Typography mr={19} component="span" pr={3.25}>Date added</Typography>
                          <Box display='flex' alignItems='center' justifyContent='end' ml={10} width={100}>
                            <Typography mr={1} component="span" pr={3.25}><PiClock /></Typography>
                          </Box>
                      </Box>
                  </Box>
                  <Box position='relative' zIndex={5} px={2}>
                    { track &&
                      track.map((album, i) => {
                        const albums = album['track'];
                        const date = new Date(albums['duration_ms']);
                        return (
                          <Box onClick={handleSubmit} px={1.25} py={1} display="flex" justifyContent="space-between" alignItems="center" borderRadius={1.25} sx={ { transition: '0.3s', ':hover': { background: 'rgba(179,179,179, 0.1)', cursor: 'pointer' }, ':hover .image-content img': { opacity: 0.5 }, ':hover .image-content span': { opacity: 1 }, ':hover .track_play': { display: 'block' }, ':hover .track_no': { display: 'none' } } } key={albums['id']}>
                            <Box display="flex" alignItems="center" >
                              <Box width={30}>
                                <Typography className='track_no' component="p" sx={{color: '#a7a7a7', fontWeight: 'bold', fontSize: '14px', margin: '0'}}>{i+1}</Typography>
                                <Typography component="p" className="text-cw track_play" sx={{display: 'none', fontWeight: 'bold', fontSize: '14px', margin: '0'}}><FaPlay/></Typography>
                              </Box>
                              <img src={albums['album']['images'][0]['url']} width={40} height={40} style={{borderRadius: '5px'}} alt='Album Profile'/>
                              <Box ml={1}>
                                <Typography component="p" className="text-cw" sx={{fontWeight: 'bold', fontSize: '14px', margin: '0'}}>{albums['name']}</Typography>
                                <Link href={`/search/${albums['artists'][0]['name']}`} mr='5px' color='#a7a7a7' sx={{ ':hover': { color: '#fff', textDecoration: 'underline !important' }  }}>{albums['artists'][0]['name']}</Link>
                                {
                                  albums['artists'][1] &&
                                  <Link href={`/search/${albums['artists'][1]['name']}`} mr='5px' color='#a7a7a7' sx={{ ':hover': { color: '#fff', textDecoration: 'underline !important' }  }}>{albums['artists'][1]['name']}</Link>
                                }
                                {
                                  albums['artists'][2] &&
                                  <Link href={`/search/${albums['artists'][2]['name']}`} mr='5px' color='#a7a7a7' sx={{ ':hover': { color: '#fff', textDecoration: 'underline !important' }  }}>{albums['artists'][2]['name']}</Link>
                                }
                                {
                                  albums['artists'][3] &&
                                  <Link href={`/search/${albums['artists'][3]['name']}`} mr='5px' color='#a7a7a7' sx={{ ':hover': { color: '#fff', textDecoration: 'underline !important' }  }}>{albums['artists'][3]['name']}</Link>
                                }
                              </Box>
                            </Box>
                            
                            <Box display='flex' alignItems='center'>
                                <Link href={`/album/${albums['album']['id']}`} mr={15} pr={3.25} color='#a7a7a7' sx={{ textDecoration: 'none', ':hover': {textDecoration: 'underline !important'}}}>{albums['album']['name']}</Link>
                                <Typography component="span" mr={17} sx={{color: '#a7a7a7'}}>{timeAgo(album['added_at'])}</Typography>
                                <Box display='flex' alignItems='center' justifyContent='space-between' ml={10} width={100}>
                                  <SavedSong
                                    trackID={albums['id']}
                                    />
                                  <Typography component="span" sx={{color: '#a7a7a7'}}>{`${date.getMinutes()}:${(date.getSeconds() < 10 ? '0' : '') + date.getSeconds()}`}</Typography>
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

      </PanelGroup>
      <Player
        trackID=''
        accessTokens={accessToken}/>
    </>
  )
}

export default Collection