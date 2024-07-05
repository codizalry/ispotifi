import { FaPlay } from "react-icons/fa";
import { Box, Link, Typography } from "@mui/material"
import { useState, useEffect } from "react";
import SavedSong from "./savedSong";

interface Props {
  image: string, 
  trackID: string, 
  title: string, 
  artist0: string, 
  artist1: { name: string }, 
  artist2: { name: string }, 
  artist3: { name: string }, 
  duration: string, 
  savedSong: () => void
}
const TableList: React.FC<Props> = ({ image, trackID, title, artist0, artist1, artist2, artist3, duration, savedSong}) => {
  const accessToken = sessionStorage.getItem('access_token') || '';
  const [selected, setSelected] = useState(false);

  useEffect(()=>{
    checkSongs(accessToken, trackID);
  }, [accessToken, trackID]);

  async function checkSongs(token: string, trackID: string) {

    var header = { 
      method: 'GET', 
      headers: { 
        'Content-Type': 'appliction/json', 
        'Authorization': 'Bearer ' + token 
      } 
    }
    await fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${trackID}`, header)
    .then(response => response.json())
    .then(response => { return response[0] ? setSelected(true) : setSelected(false)})
  }

  async function savedSongs(token: string, trackID: string) {
    var header = { 
      method: 'PUT', 
      headers: { 
        'Content-Type': 'appliction/json', 
        'Authorization': 'Bearer ' + token 
      } 
    }
    await fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackID}`, header);
  }

  async function unSavedSongs(token: string, trackID: string) {
    var header = { 
      method: 'DELETE', 
      headers: { 
        'Content-Type': 'appliction/json', 
        'Authorization': 'Bearer ' + token 
      },
      body: new URLSearchParams({
        ids: trackID,
      }),
    }
    await fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackID}`, header);
  }

  const handleLikedSongs = () => {
    savedSong();
    if (selected) {
      unSavedSongs(accessToken, trackID);
    } else {
      savedSongs(accessToken, trackID);
    }
    setSelected(!selected);
  }
  return (
    <Box onClick={handleLikedSongs} px={1.25} py={1} display="flex" justifyContent="space-between" alignItems="center" borderRadius={1.25} sx={ { ':hover': { background: 'rgba(179,179,179, 0.1)', cursor: 'pointer' }, ':hover .image-content img': { opacity: 0.5 }, ':hover .image-content span': { opacity: 1 } } }>
      <Box display="flex" alignItems="center" >
        <Box position='relative' className='image-content'>
          <img src={image} width={35} height={35} style={{borderRadius: '5px'}} alt='Album Profile'/>
          <Typography component="span" fontSize={12} sx={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', transition: '0.2s', opacity: '0'}}><FaPlay /></Typography>
        </Box>
        <Box ml={2}>
          <Typography component="p" sx={{fontWeight: 'bold', fontSize: '14px', margin: '0'}}>{title}</Typography>
          <Link href={`/search/${artist0}`} mr='5px' color='#a7a7a7' sx={{ ':hover': { color: '#fff', textDecoration: 'underline !important' }  }}>{artist0}</Link>
          {
            artist1 &&
            <Link href={`/search/${artist1['name']}`} mr='5px' color='#a7a7a7' sx={{ ':hover': { color: '#fff', textDecoration: 'underline !important' }  }}>{artist1['name']}</Link>
          }
          {
            artist2 &&
            <Link href={`/search/${artist2['name']}`} mr='5px' color='#a7a7a7' sx={{ ':hover': { color: '#fff', textDecoration: 'underline !important' }  }}>{artist2['name']}</Link>
          }
          {
            artist3 &&
            <Link href={`/search/${artist3['name']}`} mr='5px' color='#a7a7a7' sx={{ ':hover': { color: '#fff', textDecoration: 'underline !important' }  }}>{artist3['name']}</Link>
          }
        </Box>
      </Box>
      
      <Box display='flex' alignItems='center'>
        <SavedSong
          trackID={trackID}
          />
        
        <Typography ml={10} sx={{color: '#a7a7a7'}}>{duration}</Typography>
      </Box>
    </Box>
  )
}

export default TableList
