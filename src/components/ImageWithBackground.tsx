import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { FastAverageColor } from 'fast-average-color';

interface ImageWithBackgroundProps {
  imgSrc: string,
  children: JSX.Element[] | JSX.Element,
  customClass: string,
}

const fac = new FastAverageColor();

const ImageWithBackground: React.FC<ImageWithBackgroundProps> = ({ imgSrc, children, customClass }) => {


  const [backgroundColor, setBackgroundColor] = useState<string>('transparent');

  useEffect(() => {
    const fetchDominantColor = async () => {
      try {
        
  if(imgSrc == '') {
    return(
      {children}
    )
  }
        fac.getColorAsync(imgSrc)
        .then(color => { setBackgroundColor(color.rgba)})
      } catch (error) {
        console.error('Error fetching dominant color:', error);
      }
    };

    fetchDominantColor();
  }, [imgSrc]);


  return (
    <Box p={1.25} sx={{ backgroundColor, height: '100%', ...(customClass && { backgroundImage: customClass }) }}>
      {children}
    </Box>
  );
};

export default ImageWithBackground;
