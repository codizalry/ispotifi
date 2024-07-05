import { FaPlay } from "react-icons/fa";
import { Box, ToggleButton, Tooltip, Typography } from "@mui/material"
import { TbCirclePlus, TbCircleCheckFilled } from "react-icons/tb";
import { useState, useEffect } from "react";

const SavedPlaylist = (props: {trackID: string, savedPlaylist: ()=> void}) => {
  const accessToken = sessionStorage.getItem('access_token') || '';
  const [selected, setSelected] = useState(false);

  useEffect(()=>{
    checkSongs(accessToken, props.trackID);
  }, []);

  async function checkSongs(token: string, trackID: string) {
    var header = { 
      method: 'GET', 
      headers: { 
        'Content-Type': 'appliction/json', 
        'Authorization': 'Bearer ' + token 
      } 
    }
    const songChecker = await fetch(`https://api.spotify.com/v1/playlists/${trackID}/followers/contains`, header)
    .then(response => response.json())
    .then(response => { return response[0] ? setSelected(true) : setSelected(false)})
  }

  async function savedSongs(token: string, trackID: string) {
    var header = { 
        method: 'PUT', 
        headers: { 
          'Content-Type': 'appliction/json', 
          'Authorization': 'Bearer ' + token 
        },
      }
    const putLikedSong = await fetch(`https://api.spotify.com/v1/playlists/${trackID}/followers`, header)
    .then(response => response)
  }

  async function unSavedSongs(token: string, trackID: string) {
    var header = { 
      method: 'DELETE', 
      headers: { 
        'Content-Type': 'appliction/json', 
        'Authorization': 'Bearer ' + token 
      },
    }
    const putLikedSong = await fetch(`https://api.spotify.com/v1/playlists/${trackID}/followers`, header)
    .then(response => response)
  }

  const handleLikedSongs = () => {
    if (selected) {
      unSavedSongs(accessToken, props.trackID);
    } else {
      savedSongs(accessToken, props.trackID);
    }
    setSelected(!selected);
    props.savedPlaylist();
    if(localStorage.getItem('test') != 'false') {
      localStorage.setItem('test', 'false');
    } else {
      localStorage.setItem('test', 'true');
    }
  }
  return (
    <Box position='relative' zIndex={5} p={3} display='flex' alignItems='center'>
        <Typography component="span" width='50px' height='50px' fontSize='20px' color='#000' borderRadius='50px' display='flex' alignItems='center' justifyContent='center' mr={2} sx={ {backgroundColor: '#1db954', cursor: 'pointer'} } >
            <FaPlay style={{ marginLeft: '3px' }}/>
        </Typography>

        <Tooltip title={selected ? 'Remove to Playlist' : 'Add to Playlist'} placement='top' slotProps={{ popper: { modifiers: [ { name: 'offset', options: { offset: [0, -14], }, }, ], }, }}>
            <ToggleButton
            value="check"
            selected={selected}
            onChange={handleLikedSongs}
            sx={{ border: 'none' , background: 'transparent !important', ':hover': { background: 'transparent !important'}}}
            disableRipple
            >
                {
                selected ?
                (<TbCircleCheckFilled style={{ color: '#1db954', width: '35px', height: '35px'}}/>)
                :
                (<TbCirclePlus style={{ color: '#9d9c9c', width: '35px', height: '35px'}}/>)
                }
            </ToggleButton>
        </Tooltip>
    </Box>
  )
}

export default SavedPlaylist
