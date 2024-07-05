// utils/getDominantColor.ts
type RGB = [number, number, number];

export const getDominantColor = (imgSrc: string): Promise<RGB> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imgSrc;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Canvas context could not be created'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0, img.width, img.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const colorCounts: { [color: string]: number } = {};
      let dominantColor: RGB = [0, 0, 0];
      let maxCount = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];

        // Ignore fully transparent pixels
        if (alpha < 255) {
          continue;
        }

        const color = `${r},${g},${b}`;
        colorCounts[color] = (colorCounts[color] || 0) + 1;

        if (colorCounts[color] > maxCount) {
          maxCount = colorCounts[color];
          dominantColor = [r, g, b];
        }
      }

      resolve(dominantColor);
    };

    img.onerror = () => {
      reject(new Error('Image could not be loaded'));
    };
  });
};
