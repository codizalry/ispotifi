import { Button, Box  } from "@mui/material";
import { useState, useEffect } from "react";
import { authorize, getToken } from "../../hook/authorize";
import { loading, logo } from "../../assets"

const Login = () => {
  const [codeVerifier, setCodeVerifier] = useState('');

  useEffect(()=>{
    setCodeVerifier(sessionStorage.getItem('code_verifier') || '');
    if ("code_verifier" in sessionStorage && sessionStorage.getItem("access_token") !== 'undefined') { 
      getToken(codeVerifier);
    }
  }, [codeVerifier]);

  return (
    <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' minHeight='100vh'>

      <img src={logo} alt='logo'/>
      {codeVerifier ? (
        <img src={loading} width={250} alt='loading'/>
      ) : ( 
        <Button variant="contained" color="success" onClick={authorize} sx={{ padding: '20px' }}> Login to Spotify </Button>
      )}

   </Box>
  )
}


export default Login
