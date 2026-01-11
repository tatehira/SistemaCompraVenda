const { Jimp } = require('jimp');
const path = require('path');

async function processImage() {
    try {
        const logoPath = path.join(process.cwd(), 'public', 'logo.png');
        const image = await Jimp.read(logoPath);

        // Scan all pixels
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const red = this.bitmap.data[idx + 0];
            const green = this.bitmap.data[idx + 1];
            const blue = this.bitmap.data[idx + 2];

            // If pixel is close to white, make it transparent
            // Threshold: > 230 for all channels
            if (red > 230 && green > 230 && blue > 230) {
                this.bitmap.data[idx + 3] = 0; // Set alpha to 0
            }
        });

        image.write(logoPath, (err) => {
            if (err) throw err;
            console.log('Successfully removed background from logo.png');
        });
    } catch (error) {
        console.error('Error processing image:', error);
    }
}

processImage();
