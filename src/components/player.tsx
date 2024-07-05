import { useEffect, useState } from "react";
import { Box, Button, Container, Grid, Link, TextField, Tooltip, Typography } from "@mui/material";
import { TiArrowShuffle } from "react-icons/ti";
import { MdSkipPrevious, MdSkipNext } from "react-icons/md";
import { FaCirclePause, FaCirclePlay } from "react-icons/fa6";
import { FaCircle } from "react-icons/fa";
import { RiRepeatLine } from "react-icons/ri";
import { RiVolumeMuteLine, RiVolumeUpLine } from "react-icons/ri";
import { LiaMicrophoneAltSolid } from "react-icons/lia";
import { AiOutlineFullscreen, AiOutlineFullscreenExit  } from "react-icons/ai";
import { CgMiniPlayer } from "react-icons/cg";
import { HiQueueList } from "react-icons/hi2";
import { LuPlaySquare } from "react-icons/lu";

const CLIENT_ID = '4af4046d93284335815103e402797520';
const CLIENT_SECRET = '58c1d3a10f444659a39b2185adcca36c';


const Player = (props: {trackID: string, accessTokens: string}) => {

const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
const [pause, setPause] = useState(false);
const [shuffle, setShuffle] = useState(false);
const [previous, setPrevious] = useState(false);
const [next, setNext] = useState(false);
const [repeat, setRepeat] = useState(false);
const [device, setDevice] = useState('');

// Basic Auth
  useEffect(()=>{
    currentTrack(sessionStorage.getItem('access_token') || '');

  }, []);

    // Request to API
    async function currentTrack(token: string) {

        // var header = { 
        //     method: 'GET', 
        //     headers: { 
        //     'Content-Type': 'appliction/json', 
        //     'Authorization': 'Bearer ' + token
        //     } 
        // }

        // const categoriesData = await fetch('https://api.spotify.com/v1/me', header)
        // .then(response => response.json())
        // .then(response => { console.log(response) })
    
    }

// Tooltip object
const toolTipObj = {
    popper: {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, -10],
          },
        },
      ],
    },
  };

// Icon style
const iconStyle = {
    cursor: 'pointer',
    color: '#b3b3b3',
    ':hover': {
        color: '#fff'
    },
}



  return (
    <Box display='flex' justifyContent='space-between' marginTop='10px' marginLeft='10px' marginRight='10px' >
        <Box display='flex' flexDirection='row' alignItems='center'>
            <img src="https://i.scdn.co/image/ab67616d00001e02f907de96b9a4fbc04accc0d5" width={55} style={{borderRadius: '5px'}} />
            <Box marginLeft='15px'>
                <Typography variant="body1" color='#fff' fontSize='14px'>Push Ups</Typography>
                <Typography variant="body2" color='#a7a7a7' fontSize='12px'>Drake</Typography>
            </Box>
        </Box>
        <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
            <Box display='flex' alignItems='center' justifyContent='space-between' width='200px'>
                <Tooltip title="Shuffle" placement="top" slotProps={toolTipObj}>
                    <Typography sx={iconStyle}><TiArrowShuffle fontSize="20px"/></Typography>
                </Tooltip>
                <Tooltip title="Previous" placement="top" slotProps={toolTipObj}>
                    <Typography sx={iconStyle}><MdSkipPrevious fontSize="30px"/></Typography>
                </Tooltip>
                <Tooltip title={pause ? 'Pause' : 'Play'} placement="top" slotProps={toolTipObj} onClick={() => setPause(pause ? false : true)}>
                    <Typography color="#fff" sx={{cursor: "pointer", transition: '0.2s', ':hover': { scale: '1.1'}}}>{pause ? <FaCirclePause fontSize="35px"/> : <FaCirclePlay fontSize="35px"/> }</Typography>
                </Tooltip>
                <Tooltip title="Next" placement="top" slotProps={toolTipObj}>
                    <Typography sx={iconStyle}><MdSkipNext fontSize="30px"/></Typography>
                </Tooltip>
                <Tooltip title="Repeat" placement="top" slotProps={toolTipObj}>
                    <Typography sx={iconStyle}><RiRepeatLine fontSize="20px"/></Typography>
                </Tooltip>
            </Box>
            <Box display='flex' alignItems='center' justifyContent='space-between' width='600px' color='rgba(167, 167, 167, 0.8)'>
                <Typography variant="body2">0.04</Typography>
                <Box position='relative' width='100%' height='5px' borderRadius='50px' mx={2} sx={{backgroundColor: 'rgba(167, 167, 167, 0.5)', ':hover .bar': {background: '#1db954', borderColor: '#1db954'}}}>
                    <Typography className="bar" component="hr" height='3px' width='19%' borderRadius='50px' sx={{background:'#b3b3b3', cursor: 'pointer', borderColor: 'transparent'}}/>
                </Box>
                <Typography variant="body2">3.52</Typography>
            </Box>
        </Box>
        <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between' width='300px'>
            <Tooltip title="Now playing view" placement="top" slotProps={toolTipObj}>
                <Typography sx={iconStyle}><LuPlaySquare fontSize="20px"/></Typography>
            </Tooltip>
            <Tooltip title="Lyrics" placement="top" slotProps={toolTipObj}>
                <Typography sx={iconStyle}><LiaMicrophoneAltSolid fontSize="20px"/></Typography>
            </Tooltip>
            <Tooltip title="Queue" placement="top" slotProps={toolTipObj}>
                <Typography sx={iconStyle}><HiQueueList fontSize="20px"/></Typography>
            </Tooltip>
            <Box display='flex' alignItems='center'>
                <Tooltip title="Mute" placement="top" slotProps={toolTipObj}>
                    <Typography sx={iconStyle}><RiVolumeUpLine fontSize="20px"/></Typography>
                </Tooltip>
                {/* <FaCirclePause fontSize="35px"/> */}
                <Box position='relative' width='100px' height='5px' marginTop='-8px' borderRadius='50px' mx={2} sx={{backgroundColor: 'rgba(167, 167, 167, 0.5)', ':hover .bar': {background: '#1db954', borderColor: '#1db954'}}}>
                    <Typography className="bar" component="hr" height='3px' width='9%' borderRadius='50px' sx={{background:'#b3b3b3', cursor: 'pointer', borderColor: 'transparent'}}/>
                </Box>
            </Box>
            <Tooltip title="Open mini player" placement="top" slotProps={toolTipObj}>
                <Typography sx={iconStyle}><CgMiniPlayer fontSize="20px"/></Typography>
            </Tooltip>
            <Tooltip title="Full screen" placement="top" slotProps={toolTipObj}>
                <Typography sx={iconStyle}><AiOutlineFullscreen fontSize="20px"/></Typography>
            </Tooltip>
        </Box>
    </Box>
  )
}

export default Player
