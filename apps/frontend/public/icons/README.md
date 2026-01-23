# PWA Icons

## Required Icon Sizes

Please generate the following icon sizes for the PWA:

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## How to Generate

### Option 1: Using RealFaviconGenerator (Recommended)
1. Visit https://realfavicongenerator.net/
2. Upload a square image (at least 512x512px)
3. Design recommendations:
   - Weather-themed icon (cloud + sun)
   - Use gradient colors: #4facfe → #00f2fe
   - Simple, recognizable design
4. Download and extract all icons to this directory

### Option 2: Using ImageMagick
If you have a source icon (e.g., icon.svg or icon.png):

```bash
# Install ImageMagick
brew install imagemagick  # macOS
# or
sudo apt-get install imagemagick  # Linux

# Generate all sizes
for size in 72 96 128 144 152 192 384 512; do
  convert icon-source.png -resize ${size}x${size} icon-${size}x${size}.png
done
```

### Option 3: Online Tools
- https://www.favicon-generator.org/
- https://favicon.io/
- https://www.websiteplanet.com/webtools/favicon-generator/

## Design Guidelines

- **Background**: Gradient from #4facfe to #00f2fe
- **Icon**: Simple weather symbol (cloud, sun, or combination)
- **Style**: Modern, flat design
- **Safe area**: Keep important elements within 80% of canvas
- **Maskable**: For Android adaptive icons, keep content within safe zone

## Current Status

⚠️ **Placeholder icons needed** - Please generate real icons before deploying to production.

For now, the app will work but may show default browser icons until these are added.
