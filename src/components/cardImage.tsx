import { Box, Link, Typography } from "@mui/material"
import { FaPlay } from "react-icons/fa"

const CardImage = (props: {key: number, link: string, imageBackground: string, imageStyle: string, image: string, title: string, artist: string}) => {

    return (
    <Box display="flex" flexWrap="nowrap" flexDirection="column" width={160} p={1.25} borderRadius={2} 
        sx={ { cursor: 'pointer', ':hover': { background: 'rgba(179,179,179, 0.1)' }, ':hover .album-image span': { bottom: '10px !important', opacity: '1 !important' } } } >

        <Link href={props.link ? props.link : '#'} variant="body2" sx={ { textDecoration: 'none', transition: '0.3 ease' } } >
        
        <Box component="div" className="album-image" position="relative" overflow="hidden" borderRadius='5px' sx={{backgroundColor: (props.imageBackground || 'initial')}}>

            <Box component="img" src={props.image} width={155} height={155} color='#fff' borderRadius={props.imageStyle == 'circle' ? '50%' : ''} sx={{objectFit: 'cover'}}/>

            <Typography component="span" sx={ { transition: '.5s ease', position: 'absolute', width: '50px', height: '50px', right: 10, bottom: -5, fontSize: '20px', color: '#000', opacity: 0, backgroundColor: '#1db954', borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' } } >
                <FaPlay/>
            </Typography>

        </Box>

        <Typography component="h5" sx={ { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff', margin: '8px 0' } } >{props.title}</Typography>
        <Typography  variant="body2" sx={ { color: '#a7a7a7', margin: '5px 0' } }  textTransform='capitalize'>{props.artist} </Typography>
        
        </Link>

    </Box>
  )
}

export default CardImage
