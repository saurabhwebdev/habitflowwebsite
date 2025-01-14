const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const SIZES = {
    favicon: [16, 32, 48],
    apple: [57, 60, 72, 76, 114, 120, 144, 152, 180],
    android: [36, 48, 72, 96, 144, 192, 512],
    ms: [70, 150, 310]
};

async function generateIcons() {
    // Read the SVG file
    const svgBuffer = await fs.readFile('public/vite.svg');
    
    // Create output directory
    const outputDir = 'public/assets/favicon';
    await fs.mkdir(outputDir, { recursive: true });

    // Generate favicons
    for (const size of SIZES.favicon) {
        await sharp(svgBuffer)
            .resize(size, size)
            .toFile(path.join(outputDir, `favicon-${size}x${size}.png`));
    }

    // Generate Apple touch icons
    for (const size of SIZES.apple) {
        await sharp(svgBuffer)
            .resize(size, size)
            .toFile(path.join(outputDir, `apple-touch-icon-${size}x${size}.png`));
    }

    // Generate Android icons
    for (const size of SIZES.android) {
        await sharp(svgBuffer)
            .resize(size, size)
            .toFile(path.join(outputDir, `android-chrome-${size}x${size}.png`));
    }

    // Generate Microsoft tiles
    for (const size of SIZES.ms) {
        await sharp(svgBuffer)
            .resize(size, size)
            .toFile(path.join(outputDir, `mstile-${size}x${size}.png`));
    }

    // Generate manifest.json
    const manifest = {
        name: "HabitFlow",
        short_name: "HabitFlow",
        description: "Simple & Effective Habit Tracking App",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#4F46E5",
        icons: SIZES.android.map(size => ({
            src: `/assets/favicon/android-chrome-${size}x${size}.png`,
            sizes: `${size}x${size}`,
            type: "image/png",
            purpose: "any maskable"
        }))
    };

    await fs.writeFile(
        path.join(outputDir, 'manifest.json'),
        JSON.stringify(manifest, null, 2)
    );

    // Generate browserconfig.xml
    const browserconfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square70x70logo src="/assets/favicon/mstile-70x70.png"/>
            <square150x150logo src="/assets/favicon/mstile-150x150.png"/>
            <wide310x150logo src="/assets/favicon/mstile-310x150.png"/>
            <square310x310logo src="/assets/favicon/mstile-310x310.png"/>
            <TileColor>#4F46E5</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;

    await fs.writeFile(
        path.join(outputDir, 'browserconfig.xml'),
        browserconfig
    );
}

generateIcons().catch(console.error); 