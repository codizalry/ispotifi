import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { IoLogOut } from "react-icons/io5";
import { Link } from '@mui/material';
import { useState, useEffect } from 'react';

const Navigation = () => {
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [profileData, setProfileData] = useState<profileType[]>([]);
  const [randomColor, setRandomColor] = useState('#000000');
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/";
    setAnchorEl(null);
  };

  useEffect(()=>{
    setRandomColor("#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}));
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
  }

  return (
    <>
    {
      profileData.length > 0 && 
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <Tooltip title={profileData[0].display_name} slotProps={{
              popper: {
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, -14],
                    },
                  },
                ],
              },
            }} sx={{ background: randomColor}}>
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Typography component='span' p={0.50} sx={{ background: '#000', borderRadius: '50%' }}>
                <Avatar sx={{ width: 25, height: 25, color: '#000', background: randomColor }}> 
                  {
                    profileData[0].images[1] ?
                    (
                      <img src={profileData[0].images[1].url} style={{ objectFit: 'cover', width: '100%', height: '100%'}}/>
                    ) :
                    (
                      <Typography variant='body2' fontWeight='bold' textTransform='capitalize'>{profileData[0].display_name.charAt(0)}</Typography>
                    )
                  }
                </Avatar>
              </Typography>
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              background: '#282828',
              color: '#eaeaea',
              width: '200px',
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem component={Link} href='/profile/' onClick={handleClose} sx={{mx: '5px', fontSize: '13px', ':hover': { background: 'hsla(0,0%,100%,.1)' } }}>
            Profile
          </MenuItem>
          <MenuItem component={Link} onClick={handleClose} sx={{mx: '5px', fontSize: '13px', ':hover': { background: 'hsla(0,0%,100%,.1)' } }}>
            Settings
          </MenuItem>
          <Divider sx={{ my: '5px !important' }}/>
          <MenuItem onClick={handleLogout} sx={{mx: '5px', fontSize: '13px', ':hover': { background: 'hsla(0,0%,100%,.1)' } }}>
            Logout
          </MenuItem>
        </Menu>
      </>
    }
    </>
  )
}

export default Navigation
