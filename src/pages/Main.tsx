  import { useEffect, useState } from "react";
  import SideBar from "../components/sidebar";
  import BasicAuth from "../hook/basicAuth";
  import { Box, Typography } from "@mui/material";
  import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
  import Player from "../components/player";
  import Navigation from "../components/navigation";
  import { LuConstruction } from "react-icons/lu";
  import { maintenance } from "../assets";

  const Main = () => {
    const accessToken = sessionStorage.getItem('access_token') || '';
    const [sidePanelSize, setSidePanelSize] = useState('');

    // Basic Auth
    BasicAuth();

    useEffect(()=>{

    }, []);


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
                  zIndex="5"
                  padding="10px 0px"
                  sx={ { backgroundColor: 'rgb(18, 18, 18)' } } >

                <Box
                  component="div"
                  display="flex"
                  alignItems="center"
                  justifyContent="end"
                  position="sticky"
                  top="0"
                  width="100%"
                  maxWidth='1955px'
                  zIndex="5"
                  padding="10px 0px"
                  sx={ { backgroundColor: 'rgb(18, 18, 18)' } } >
                    <Navigation/>
                </Box>
                </Box>
                
                <Box className='text-cw' display='flex' flexDirection='column' alignItems='center' justifyContent='center' height='80%'>
                    <img src={maintenance} width='100'/>
                    <Typography variant="h4" display='flex' alignItems='center' color='#b3bab4' p={5}>This Section is under maintenance. <LuConstruction style={{ marginLeft: '20px', fontSize: '40px'}} /></Typography>
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

  export default Main;
