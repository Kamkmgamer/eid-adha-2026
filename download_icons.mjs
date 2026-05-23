import fs from 'fs';
import https from 'https';

async function fetchPlayStoreIcon(appId, outputPath) {
  const url = `https://play.google.com/store/apps/details?id=${appId}`;
  console.log(`Fetching ${url}...`);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    // Look for the high-res app icon in the meta tags or img tags
    // Play Store usually has <meta property="og:image" content="...=w240-h480-rw">
    // or <img src="...=w240-h480-rw" alt="Icon image" class="...">
    
    let iconUrl = null;
    const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    if (ogImageMatch && ogImageMatch[1]) {
      iconUrl = ogImageMatch[1];
    } else {
      // Fallback regex
      const imgMatch = html.match(/<img[^>]+src="([^"]+)"[^>]+alt="Icon image"/i);
      if (imgMatch && imgMatch[1]) {
        iconUrl = imgMatch[1];
      }
    }

    if (!iconUrl) {
      console.log('Could not find icon URL in HTML');
      return;
    }

    // Clean up the URL (remove size modifiers to get original or set a specific size)
    // Often Play Store URLs have something like =w240-h480-rw. We can change it to =w512
    iconUrl = iconUrl.split('=')[0] + '=w512';
    if (!iconUrl.startsWith('http')) {
        iconUrl = 'https:' + (iconUrl.startsWith('//') ? iconUrl.substring(2) : iconUrl);
    }

    console.log(`Found icon URL: ${iconUrl}`);
    console.log(`Downloading to ${outputPath}...`);

    const imgResponse = await fetch(iconUrl);
    if (!imgResponse.ok) {
        throw new Error(`Failed to download image: ${imgResponse.status}`);
    }
    const buffer = await imgResponse.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    console.log(`Successfully downloaded ${appId} icon.`);
    
  } catch (err) {
    console.error(`Error processing ${appId}:`, err);
  }
}

async function main() {
  await fetchPlayStoreIcon('sd.bankofkhartoum.bankak', './public/bankak_logo.png');
  await fetchPlayStoreIcon('com.fib.fawrysd', './public/fawry_logo.png');
}

main();
