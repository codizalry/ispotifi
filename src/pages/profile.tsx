import { useEffect, useState } from "react";
import SideBar from "../components/sidebar"
import BasicAuth from "../hook/basicAuth"
import { Box, Link, Typography } from "@mui/material";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { FaCircleChevronLeft, FaCircleChevronRight  } from "react-icons/fa6";
import Player from "../components/player";
import { FaPlay } from "react-icons/fa";
import ImageWithBackground from "../components/ImageWithBackground";
import { person, music } from "../assets";
import Navigation from "../components/navigation";
import CardImage from "../components/cardImage";
import TableList from "../components/tableList";

const Profile = () => {
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
  const accessToken = sessionStorage.getItem('access_token') || '';
  const [sidePanelSize, setSidePanelSize] = useState('');
  const [profileData, setProfileData] = useState<profileType[]>([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [tracker, setTracker] = useState<string>(localStorage.getItem('test') || 'false');

  // Basic Auth
  BasicAuth();

  useEffect(()=>{
    profiles(accessToken);
  }, []);

  // Search
  async function profiles(token: string) {
    
    // Get request using search to get the artist ID
    var header = { 
        method: 'GET', 
        headers: { 
        'Content-Type': 'appliction/json',
        'Authorization': 'Bearer ' + token
        } 
    }

    const profileDatas = await fetch('https://api.spotify.com/v1/me', header)
    .then(response => response.json())
    .then(response => { setProfileData([response]) })

    const topArtists = await fetch('https://api.spotify.com/v1/me/top/artists?limit=10', header)
    .then(data => data.json())
    .then(data => { setTopArtists(data.items) })

    const topTracks = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', header)
    .then(data => data.json())
    .then(data => { setTopTracks(data.items) })

    const followPlaylist = await fetch(`https://api.spotify.com/v1/me/playlists?limit=6`, header)
    .then(data => data.json())
    .then(data => { setPlaylist(data.items) })
  }

  async function likeSongs(token: string, trackID: string) {
    var header = { 
      method: 'PUT', 
      headers: { 
        'Content-Type': 'appliction/json', 
        'Authorization': 'Bearer ' + token 
      } 
    }

    const putLikedSong = await fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackID}`, header)
    .then(response => response)
    .catch((error) => { sessionStorage.clear(); });
  }

  const handleSubmit = () => {
    setTracker(tracker == 'true' ? 'false' : 'true');
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

            <Box
                component="div"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                position="sticky"
                top="0"
                width="100%"
                // maxWidth='1955px'
                zIndex="10"
                padding="10px 0px" >
                  {profileData.length > 0 && <Box position='absolute' zIndex={2} top={0} width='100%' height='100%'><ImageWithBackground imgSrc={profileData[0].images[1] ? profileData[0].images[1].url : person} customClass=""><></></ImageWithBackground></Box>}
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

              <Box color='#fff'>
                {
                    profileData.length > 0 && 
                    <Box display='flex' alignItems='center' position='relative' pt={2}>
                        <Box position='absolute' zIndex={2} top={0} width='100%' height='100%' sx={{objectFit:'cover', backgroundImage: 'linear-gradient(transparent 0, rgba(0, 0, 0, .5) 100%)'}}><ImageWithBackground imgSrc={profileData[0].images[1] ? profileData[0].images[1].url : person} customClass=""><></></ImageWithBackground></Box>
                        <Box zIndex={4} pl={3} py={2}>
                            <Box width={230} height={230} overflow='hidden' display='flex' alignItems='center' justifyContent='center' sx={{ background: '#282828', boxShadow: '0 4px 20px rgba(0, 0, 0, .6)', borderRadius: '50%' }}>
                            {/* <Box width={230} height={230} overflow='hidden' display='flex' alignItems='center' justifyContent='center' sx={{ background: '#282828', boxShadow: '0 4px 60px rgba(0, 0, 0, .6)', borderRadius: '50%' }}> */}
                                {/* <MdPersonOutline size={80} color="#7f7f7f"/> */}
                                <img src={profileData[0].images[1] ? profileData[0].images[1].url : person} width={profileData[0].images[1] ? 230 : 130} height={profileData[0].images[1] ? 230 : 130} style={{objectFit:'cover'}}/>
                            </Box>
                        </Box>
                        <Box ml={3} zIndex={4} className="text-cw">
                            <Typography variant="body2" textTransform='capitalize' fontWeight='bold'>Profile</Typography>
                            <Typography variant="h1" fontWeight='bold' pb={2}>{profileData[0].display_name}</Typography>
                            <Typography variant="body2">
                                <Typography component='span' fontSize='14px'>Follower(s): {profileData[0].followers.total}</Typography>
                                <Typography component='span' fontSize='40px' lineHeight={0} mx={0.50}>.</Typography>
                                <Typography component='span' fontSize='14px'>Email: {profileData[0].email}</Typography>
                            </Typography>
                        </Box>
                    </Box>
                }
              </Box>

                <Box position='relative'>
                    {profileData.length > 0 && <Box position='absolute' zIndex={2} top={0} width='100%' height={250}><ImageWithBackground imgSrc={profileData[0].images[1] ? profileData[0].images[1].url : person} customClass="linear-gradient(rgba(0, 0, 0, .6) 0, #121212 100%)"><></></ImageWithBackground></Box>}
                    <Box position='relative' zIndex={5} px={3} pt={7} maxWidth='1955px'>
                        <Box>
                            <Typography variant="h5" fontWeight='bold' color='#fff'>Top artists this month</Typography>
                            <Typography variant="body2" color='#A7A7A7'>Only visible to you</Typography>
                            <Box display="flex" flexWrap="wrap" pt={1} marginLeft={-1} maxWidth='1955px'>
                            {
                                topArtists.length > 0 &&
                                topArtists.map((artist, i) => {
                                  return (
                                        <CardImage
                                          key={i}
                                          link={'/search/'+artist['name']}
                                          imageBackground={artist['images'] ? '' : '#333333'}
                                          imageStyle={'circle'}
                                          image={artist['images'] ? artist['images'][0]['url'] : music}
                                          title={artist['name']}
                                          artist={artist['type']}
                                        />
                                  )
                                } )
                            }
                            </Box>
                        </Box>

                        <Box my={5} maxWidth='1955px'>
                            <Box display='flex' justifyContent='space-between'>
                                <Box>
                                    <Typography variant="h5" fontWeight='bold' color='#fff'>Top tracks this month</Typography>
                                    <Typography variant="body2" color='#A7A7A7'>Only visible to you</Typography>
                                </Box>
                                <Link href='#' color='#a7a7a7' fontWeight='bold' sx={{':hover': { textDecoration: 'underline !important'}}}>Show All</Link>
                            </Box>
                            <Box className="text-cw">
                          {
                            topTracks.map((track, index) => {
                              const date = new Date(track['duration_ms']);
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
                        </Box>

                        <Box mb={5} maxWidth='1955px'>
                            <Typography variant="h5" fontWeight='bold' color='#fff'>Public Playlists</Typography>
                            <Box display="flex" flexWrap="wrap" pt={1} marginLeft={-1} maxWidth='1955px'>
                            {
                                playlist.length > 0 &&
                                playlist.map((artist, i) => {
                                  return (
                                        <CardImage
                                          key={i}
                                          link=''
                                          imageBackground={artist['images'] ? '' : '#333333'}
                                          imageStyle={'square'}
                                          image={artist['images'] ? artist['images'][0]['url'] : music}
                                          title={artist['name']}
                                          artist= {'By ' +artist['owner']['display_name']}
                                          />
                                  )
                                } )
                            }
                            </Box>
                        </Box>
                    
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

export default Profile