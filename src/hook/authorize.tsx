const SPOTIFY_CLIENT_ID: string = `4af4046d93284335815103e402797520`;
const SPOTIFY_CLIENT_SECRET: string = `58c1d3a10f444659a39b2185adcca36c`;
const redirectUri: string = "https://ispotifi.netlify.app";


function generateRandomString(length: number): string {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  function base64encode(string: Uint8Array): string {
    return btoa(String.fromCharCode.apply(null, Array.from(string)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);

  return base64encode(new Uint8Array(digest));
}

const codeVerifier: string = generateRandomString(128);

let urlParams = new URLSearchParams();

if (typeof window !== "undefined") {
  urlParams = new URLSearchParams(window.location.search);
}

export const authorize = () => {
  generateCodeChallenge(codeVerifier).then((codeChallenge) => {
    const state: string = generateRandomString(16);
    const scope: string =
      "user-read-private streaming user-read-playback-state user-modify-playback-state user-read-email user-library-read playlist-modify-public playlist-modify-private user-top-read playlist-read-collaborative user-library-modify ";
         
    sessionStorage.setItem("code_verifier", codeVerifier);

    const args = new URLSearchParams({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: redirectUri,
      state: state,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
    });
    window.location.href = "https://accounts.spotify.com/authorize?" + args;
  });
};

export const getToken = async (codeVerifier: string) => {
  if ("access_token" in sessionStorage) { } else {
  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get('code');
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body:  new URLSearchParams({
      grant_type: 'authorization_code',
      code: code || '',
      redirect_uri: redirectUri,
      client_id: SPOTIFY_CLIENT_ID,
      code_verifier: codeVerifier || '',
    }),
  }

  fetch('https://accounts.spotify.com/api/token', payload)
  .then(result => result.json())
  .then((data: {access_token: string, refresh_token: string}) => { 
    console.log(data);
    sessionStorage.setItem('access_token', data.access_token);
    sessionStorage.setItem('refresh_token', data.refresh_token); 
    window.location.href = "/";
  })
  .catch((error) => { sessionStorage.clear(); })
  }
};



export const refreshSpotifyToken = async (refresh_token: string) => {

   // refresh token that has been previously stored
  //  const url = "https://accounts.spotify.com/api/token";
  // const encoded = btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET);
  //   const payload = {
  //     method: 'POST',
  //     headers: {  
  //       "Authorization": "Basic " + encoded,
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     body: new URLSearchParams({
  //       grant_type: 'refresh_token',
  //       refresh_token: refresh_token,
  //       client_id: SPOTIFY_CLIENT_ID,
  //     }),
  //   }
  //   const body = await fetch(url, payload);
  //   const response = await body.json();
  //   console.log(response);

  // refresh token that has been previously stored
  // const authHeader = Buffer.from(`4af4046d93284335815103e402797520:58c1d3a10f444659a39b2185adcca36c`).toString('base64');

  //  const payload = {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `Basic ${authHeader}`,
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //    body: new URLSearchParams({
  //      grant_type: 'refresh_token',
  //      refresh_token: refresh_token,
  //      client_id: SPOTIFY_CLIENT_ID,
  //    }),
  //  }
  //   fetch('https://accounts.spotify.com/api/token', payload)
  //   .then(result => console.log(result.json()))
    
  //  const albumInfoResponse = await fetch("https://accounts.spotify.com/api/token", payload);
  //   const albumInfoData = await albumInfoResponse.json();
    // console.log(test)

  //  sessionStorage.setItem('refresh_token', albumInfoData.refreshToken);
   
};
