import { ToggleButton, Tooltip } from "@mui/material"
import { useState, useEffect } from "react";

const SavedArtist = (props: {trackID: string}) => {
  const accessToken = sessionStorage.getItem('access_token') || '';
  const [selected, setSelected] = useState(false);

  useEffect(()=>{
    checkSongs(accessToken, props.trackID);
  }, [accessToken, props.trackID]);

  async function checkSongs(token: string, trackID: string) {
    var header = { 
      method: 'GET', 
      headers: { 
        'Content-Type': 'appliction/json', 
        'Authorization': 'Bearer ' + token 
      } 
    }
    await fetch(`https://api.spotify.com/v1/me/following/contains?type=artist&ids=${trackID}`, header)
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
    await fetch(`https://api.spotify.com/v1/me/following?type=artist&ids=${trackID}`, header)
    .then(response => response)
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
    await fetch(`https://api.spotify.com/v1/me/following?type=artist&ids=${trackID}`, header)
    .then(response => response)
  }

  const handleLikedSongs = () => {
    if (selected) {
      unSavedSongs(accessToken, props.trackID);
    } else {
      savedSongs(accessToken, props.trackID);
    }
    setSelected(!selected);
    
    if(localStorage.getItem('test') !== 'false') {
      localStorage.setItem('test', 'false');
    } else {
      localStorage.setItem('test', 'true');
    }
  }
  return (
    <Tooltip title={selected ? 'Remove to Liked Songs' : 'Add to Liked Songs'} placement='top' slotProps={{ popper: { modifiers: [ { name: 'offset', options: { offset: [0, -14], }, }, ], }, }}>
        <ToggleButton
        value="check"
        selected={selected}
        onChange={handleLikedSongs}
        sx={{ border: 'none' , background: 'transparent !important', ':hover': { background: 'transparent !important'}}}
        disableRipple
        >
            {
            selected ?
            (<>Following</>)
            :
            (<>Follow</>)
            }
        </ToggleButton>
    </Tooltip>
  )
}

export default SavedArtist
