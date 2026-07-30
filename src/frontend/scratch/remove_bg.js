const { Jimp } = require('jimp');
const path = require('path');

async function processLogo() {
  const inputPath = 'C:/Users/moham/.gemini/antigravity-ide/brain/9965b8bf-9e0a-4302-9cc8-7910bcb46cc5/media__1785423235672.png';
  const outputPath = 'd:/Projects/Budgetha/src/frontend/public/images/logo.png';

  console.log('Reading image from:', inputPath);
  const image = await Jimp.read(inputPath);
  
  console.log('Processing pixels...');
  // Loop through pixels and make white/near-white transparent
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // Check if the pixel is white or very close to white
    if (r > 240 && g > 240 && b > 240) {
      this.bitmap.data[idx + 3] = 0; // Set alpha to 0 (transparent)
    }
  });

  // Writing to public/images/logo.png
  await image.write(outputPath);
  console.log('Successfully wrote transparent logo to:', outputPath);
}

processLogo().catch(err => {
  console.error('Error processing logo:', err);
});
