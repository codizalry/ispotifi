  import { useEffect, useState } from "react";
  import SideBar from "../components/sidebar"
  import BasicAuth from "../hook/basicAuth"
  import { Box, Container, Link, TextField, Typography } from "@mui/material";
  import { PiMagnifyingGlassBold } from "react-icons/pi";
  import { useNavigate } from "react-router";
  import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
  import { FaCircleChevronLeft, FaCircleChevronRight  } from "react-icons/fa6";
  import ImageWithBackground from "../components/ImageWithBackground";
  import Player from "../components/player";
  import Navigation from "../components/navigation";
  
  const CLIENT_ID = '4af4046d93284335815103e402797520';
  const CLIENT_SECRET = '58c1d3a10f444659a39b2185adcca36c';

  const Search = () => {
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState('');
    const [categories, setCategories] = useState([]);
    const [sidePanelSize, setSidePanelSize] = useState('');
    
    // Basic Auth
    BasicAuth();

    useEffect(()=>{
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
      const categoriesData = await fetch('https://api.spotify.com/v1/browse/categories?offset=0&limit=30', searchParameters)
        .then(response => response.json())
        .then(data => {
          setCategories(data.categories.items);
        })
        .catch((error) => { sessionStorage.clear(); });
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
                    <TextField type="search" placeholder="What do you want to play ?"
                    autoFocus
                    sx={
                        {
                        marginLeft: '15px',
                        background: 'rgba(36, 36, 36, 0.8)',
                        border: '0.1px solid rgba(36, 36, 36, 0.8)',
                        borderRadius: '50px',
                        width: '100%',
                        ':hover': {
                            background: 'rgba(36, 36, 36, 1)',
                            border: '0.1px solid rgba(83,83,83, 0.8)',
                        },
                        ':hover svg': {
                            color: '#fff',
                            fontWeight: 'bold'
                        },
                        '& svg' : {
                            marginRight: '10px'
                        },
                        '& fieldset': {
                            outline: 'none',
                            border: '0 solid',
                            borderColor: 'transparent !important'
                        },
                        '& input[type="search"]::-webkit-search-cancel-button': {
                            filter: 'invert(100%) sepia(10%) saturate(500%) hue-rotate(90deg)'
                        }
                        }
                    }
                    onChange={event => {
                      navigate('/search/'+event.target.value);
                    }}
                    InputProps={ {
                      startAdornment: <PiMagnifyingGlassBold onClick={()=> search(accessToken)}/>,
                      style: {
                        color: '#b3b3b3',
                        fontSize: '18px',
                      }
                    } }
                    />
                    </Box>
                    <Navigation/>
                </Box>

                <Typography variant="h5" fontWeight='bold' className="text-cw" py={2}>Browse all</Typography>
                <Box display='flex' flexWrap='wrap'>
                {
                  categories.map((category) => {
                    return (
                      <Link href={"/genre/"+category['id']} key={category['id']} width={330} height={160} mx='15px' mb='15px' overflow='hidden' color='#fff' ml='0 !important' borderRadius='5px' sx={{textDecoration: 'none', cursor: 'pointer'}}>
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

  export default Search