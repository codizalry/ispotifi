import { useEffect, useState } from "react";

const CLIENT_ID = '4af4046d93284335815103e402797520';
const CLIENT_SECRET = '58c1d3a10f444659a39b2185adcca36c';

const Playing = (props: { musicID: string, token: string }) => {

    // Fetch Access Token
        currentTrack(props.musicID, props.token);

    // Request to API
    async function currentTrack(musicID: string, token: string) {

        var header = { 
            method: 'GET', 
            headers: { 
            'Content-Type': 'appliction/json', 
            'Authorization': 'Bearer ' + token
            } 
        }

        const categoriesData = await fetch(`https://api.spotify.com/v1/tracks/${musicID}`, header)
        .then(response => response.json())
        .then(data => { console.log(data) })
    
    }

  return (
    <div>
      {props.musicID}
    </div>
  )
}

export default Playing
