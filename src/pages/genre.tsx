import { useEffect, useState } from "react";
import SideBar from "../components/sidebar"
import BasicAuth from "../hook/basicAuth"
import { Box, Button, Container, Grid, Link, TextField, Tooltip, Typography } from "@mui/material";
import { IoLogOut } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { FaCircleChevronLeft, FaCircleChevronRight  } from "react-icons/fa6";
import ImageWithBackground from "../components/ImageWithBackground";
import Player from "../components/player";
import { LuConstruction } from "react-icons/lu";
import { maintenance } from "../assets";

const CLIENT_ID = '4af4046d93284335815103e402797520';
const CLIENT_SECRET = '58c1d3a10f444659a39b2185adcca36c';

const Genre = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [accessToken, setAccessToken] = useState('');
  const [categories, setCategories] = useState([]);
  const [sidePanelSize, setSidePanelSize] = useState('');
  
  // Basic Auth
  BasicAuth();

  useEffect(()=>{
    console.log(id);

    
    // API Access Token
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
        search(data.access_token);
      })
  }, []);

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

    // get request with all the categories
    const categoriesData = await fetch('https://api.spotify.com/v1/browse/categories?offset=0&limit=8', searchParameters)
      .then(response => response.json())
      .then(data => {
        setCategories(data.categories.items);
      })
      .catch((error) => { sessionStorage.clear(); })
    // const discovery = await fetch(`https://api.spotify.com/v1/albums/${id}`, searchParameters)
    //   .then(response => response.json())
    //   .then(data => { console.log(data) })
  }

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/";
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
              
                  </Box>
                  <Tooltip title="Log out?" arrow>
                    <Button 
                      variant="text" 
                      color="success" 
                      startIcon={<IoLogOut style={{width:'30px', height: '30px'}}/>} 
                      onClick={handleLogout}/>
                  </Tooltip>
              </Box>
              <Box className='text-cw' display='flex' flexDirection='column' alignItems='center' justifyContent='center' height='80%' mt={10}>
                    <img src={maintenance} width='100'/>
                    <Typography variant="h4" display='flex' alignItems='center' color='#b3bab4' p={5}>This Section is under maintenance. <LuConstruction style={{ marginLeft: '20px', fontSize: '40px'}} /></Typography>
                </Box>
              <Box display='flex' justifyContent='space-between' alignItems='center'>
                  <Typography variant="h5" fontWeight='bold' className="text-cw" py={2}>Browse all</Typography>
                  <Link href='/search/' color='#B3B3B3' sx={{transition: '0.3s', ':hover': { textDecoration: ' underline !important'}}}>Show all</Link>
              </Box>
              <Box display='flex' flexWrap='wrap'>
              {
                categories.map((category) => {
                  return (
                    <Link href={"/genre/"+category['id']} key={category['id']} width={251} height={160} mx='15px' mb='15px' overflow='hidden' color='#fff' ml='0 !important' borderRadius='5px' sx={{textDecoration: 'none', cursor: 'pointer'}}>
                      <ImageWithBackground imgSrc={category['icons'][0]['url']} customClass="">
                        <Typography variant="h5" fontWeight='bold'>{category['name']}</Typography>
                        <Box textAlign='right' mr={-4.5}>
                          <img src={category['icons'][0]['url']} width={150} style={{transform: 'rotate(30deg)'}}/>
                        </Box>
                      </ImageWithBackground>
                    </Link>
                  )
                })
              }
              </Box>
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

export default Genre