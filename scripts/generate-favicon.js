import fs from 'fs'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SOURCE_IMAGE = path.join(__dirname, '../public/images/favicon.png')
const PUBLIC_DIR = path.join(__dirname, '../public')

// Create public directory if it doesn't exist
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR)
}

async function generateFavicons() {
  try {
    // Create favicon.png (32x32)
    await sharp(SOURCE_IMAGE)
      .resize(32, 32)
      .toFormat('png')
      .toFile(path.join(PUBLIC_DIR, 'favicon.png'))

    // Create apple-touch-icon.png (180x180)
    await sharp(SOURCE_IMAGE)
      .resize(180, 180)
      .toFormat('png')
      .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'))

    // Create larger favicon for high-res displays (192x192)
    await sharp(SOURCE_IMAGE)
      .resize(192, 192)
      .toFormat('png')
      .toFile(path.join(PUBLIC_DIR, 'favicon-192x192.png'))

    console.log('Favicon files generated successfully!')
  } catch (error) {
    console.error('Error generating favicons:', error)
  }
}

generateFavicons()