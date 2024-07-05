import { Box, Button, Link, Typography } from '@mui/material'
import { GoHome , GoHomeFill } from "react-icons/go";
import { PiMagnifyingGlassBold, PiMagnifyingGlassFill  } from "react-icons/pi";
import { LuLibrary } from "react-icons/lu";
import { useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { music, likeSong } from '../assets';
import { BsFillPinAngleFill } from "react-icons/bs";
import { refreshSpotifyToken } from '.././hook/authorize';
import { FaCircle } from "react-icons/fa6";

const SideBar = (props: {panelSize: string}) => {
  refreshSpotifyToken(sessionStorage.getItem('refresh_token') || '');

  const currentLocation = useLocation();
  var hideText = props.panelSize;

  const accessToken = sessionStorage.getItem('access_token') || '';
  const [playlist, setPlaylist] = useState([]);
  const [savedSongs, setSavedSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [result, setResult] = useState([]);
  useEffect(()=>{
    localStorage.setItem('test', 'false');
    profiles(accessToken);
    setResult([...playlist, ...result]);
  }, [localStorage.getItem('test')]);

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

    const followPlaylist = await fetch(`https://api.spotify.com/v1/me/playlists`, header)
    .then(data => data.json())
    .then(data => { setPlaylist(data.items) })
    .catch((error) => { sessionStorage.clear(); })

    const followAlbum = await fetch(`https://api.spotify.com/v1/me/albums`, header)
    .then(data => data.json())
    .then(data => { setAlbums(data.items) })
    .catch((error) => { sessionStorage.clear(); })

    const savedTracks = await fetch(`https://api.spotify.com/v1/me/tracks`, header)
    .then(data => data.json())
    .then(data => { setSavedSongs(data.items) })
    .catch((error) => { sessionStorage.clear(); })

    }

  return (
    <Box
        marginRight='5px'
        height='87vh'
        width='100%'
        >
        <Box 
            component='div' 
            padding={hideText == 'none' ? '10px 0' : '10px'}
            display='flex'
            flexDirection='column'
            alignItems={hideText == 'none' ? 'center' : 'flex-start'}
            borderRadius='10px'
            sx={ { backgroundColor: '#121212' } } >

            <Button
                variant='text'
                color='primary'
                size='large'
                href='/'
                sx={
                    {
                        color: `${currentLocation.pathname === '/' ? '#fff' :'#b3b3b3'}`,
                        fontWeight: 'bold',
                        fontSize: '20px',
                        width: '100%',
                        justifyContent: (hideText == 'none' ? 'center' : 'start'),
                        textTransform: 'inherit',
                        '&:hover': {
                            color: '#fff',
                            background: 'inherit'
                        },
                        '&:active': {
                            background: 'transparent'
                        }
                    }
                } >
                { currentLocation.pathname === '/' ? <GoHomeFill style={{ fontSize: '30px' }}/> : <GoHome style={{ fontSize: '30px' }}/> }
                <span style={{display: hideText, marginLeft: '10px'}}>Home</span>
            </Button>

            <Button
                variant='text'
                color='primary'
                size='large'
                href='/search'
                sx={
                    {
                        color: `${currentLocation.pathname === '/search' ? '#fff' :'#b3b3b3'}`,
                        fontWeight: 'bold',
                        fontSize: '20px',
                        width: '100%',
                        justifyContent: (hideText == 'none' ? 'center' : 'start'),
                        textTransform: 'inherit',
                        '&:hover': {
                            color: '#fff',
                            background: 'inherit'
                        },
                        '&:active': {
                            background: 'transparent'
                        }
                    }
                } >
                { currentLocation.pathname === '/search' ? <PiMagnifyingGlassFill style={{ fontSize: '30px' }}/> : <PiMagnifyingGlassBold style={{ fontSize: '30px' }}/> }
                <span style={{display: hideText, marginLeft: '10px'}}>Search</span>
            </Button>

        </Box>
        
        <Box 
            component='div' 
            padding={hideText == 'none' ? '10px 0 100px' : '10px 10px 50px'}
            height='100%'
            display='flex'
            flexDirection='column'
            alignItems={hideText == 'none' ? 'center' : 'flex-start'}
            marginTop='10px'
            borderRadius='10px'
            sx={ { backgroundColor: '#121212', overflowY: 'overlay' } } >

            <Button
                variant='text'
                color='primary'
                size='large'
                href='/'
                sx={
                    {
                        color: `${currentLocation.pathname === '/' ? '#fff' :'#b3b3b3'}`,
                        fontWeight: 'bold',
                        fontSize: '20px',
                        textTransform: 'inherit',
                        '&:hover': {
                            color: '#fff',
                            background: 'inherit'
                        },
                        '&:active': {
                            background: 'transparent'
                        }
                    }
                } >
                <LuLibrary style={{ fontSize: '30px' }}/>
                <span style={{display: hideText, marginLeft: '10px'}}>Your Library</span>
            </Button>

            <Box pt={1} width={hideText === 'none' ? 'inherit' : '100%'}>
                {
                    savedSongs.length > 0 && 
                    <Link href='/collection/tracks' display='flex' alignItems='center' py={0.50} px={1} borderRadius={2} 
                        sx={ { cursor: 'pointer', ':hover': { background: 'rgba(179,179,179, 0.1)' }, ':hover .album-image span': { bottom: '10px !important', opacity: '1 !important' } } }>
                            <Box component="img" src={likeSong} width={50} height={50} color='#fff' borderRadius='5px'/>
                            <Box display={hideText === 'none' ? 'none' : 'block'} pl={hideText === 'none' ? '0' : '10px'}>
                                <Typography component="h5" sx={ { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff', margin: '8px 0' } } >Liked Songs</Typography>
                                <Typography variant="body2" color='#a7a7a7' m='5px 0' display='flex' alignItems='center' textTransform='capitalize'><BsFillPinAngleFill style={{color: '#1db954', marginRight: '5px'}}/> Playlist <FaCircle style={{ fontSize: '5px', margin: '0 5px' }}/> {savedSongs.length} song{savedSongs.length > 1 ? 's' : ''} </Typography>
                            </Box>
                    </Link>
                }

                {
                    albums.length > 0 &&
                    albums.map((album, i) => {
                    return (
                        <Link href={`/album/${album['album']['id']}`} display='flex' alignItems='center' py={0.50} px={1} borderRadius={2} whiteSpace='nowrap' overflow='hidden' sx={ { ':hover': { background: 'rgba(179,179,179, 0.1)' } } } key={i}>
                            <Box component="img" src={album['album']['images'] ? album['album']['images'][0]['url'] : music} width={50} height={50} color='#fff' borderRadius='5px'/>
                            <Box display={hideText === 'none' ? 'none' : 'block'} pl={hideText === 'none' ? '0' : '10px'}>
                                <Typography component="h5" color='#fff' m='8px 0'>{album['album']['name']}</Typography>
                                <Typography variant="body2" color='#a7a7a7' m='5px 0' display='flex' alignItems='center' textTransform='capitalize'>{album['album']['type']} <FaCircle style={{ fontSize: '5px', margin: '0 5px' }}/> {album['album']['artists'][0]['name']} </Typography>
                            </Box>
                        </Link>
                        )
                    } )
                }

                {
                    playlist.length > 0 &&
                    playlist.map((artist, i) => {
                    return (
                        <Link href={`/playlist/${artist['id']}`}display='flex' alignItems='center' py={0.50} px={1} borderRadius={2} whiteSpace='nowrap' overflow='hidden' sx={ { ':hover': { background: 'rgba(179,179,179, 0.1)' } } } key={i}>
                            <Box component="img" src={artist['images'] ? artist['images'][0]['url'] : music} width={50} height={50} color='#fff' borderRadius='5px'/>
                            <Box display={hideText === 'none' ? 'none' : 'block'} pl={hideText === 'none' ? '0' : '10px'}>
                                <Typography component="h5" color='#fff' m='8px 0'>{artist['name']}</Typography>
                                <Typography variant="body2" color='#a7a7a7' m='5px 0' display='flex' alignItems='center' textTransform='capitalize'>{artist['type']} <FaCircle style={{ fontSize: '5px', margin: '0 5px' }}/> {artist['owner']['display_name']} </Typography>
                            </Box>
                        </Link>
                        )
                    } )
                }
            </Box>

        </Box>

    </Box>
  )
}

export default SideBar
