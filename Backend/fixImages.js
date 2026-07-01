// @ts-nocheck
const https = require('https');
const Destination = require('./src/modules/destination/destination.model');
const Package = require('./src/modules/package/package.model');
const sequelize = require('./src/config/sequelize');

// Helper to fetch Wikipedia image for a given title
const fetchWikiImage = (title) => {
  return new Promise((resolve) => {
    // Some manual disambiguation
    if (title === 'Andaman') title = 'Andaman Islands';
    if (title === 'Kashmir') title = 'Kashmir Valley';
    
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=1000`;
    
    https.get(url, { headers: { 'User-Agent': 'TouristTravelApp/1.0' } }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pages[pageId].thumbnail && pages[pageId].thumbnail.source) {
            resolve(pages[pageId].thumbnail.source);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
};

const run = async () => {
  try {
    await sequelize.authenticate();
    const destinations = await Destination.findAll();
    
    for (const dest of destinations) {
      const imageUrl = await fetchWikiImage(dest.name);
      if (imageUrl) {
        console.log(`Updating ${dest.name} -> ${imageUrl}`);
        await dest.update({ image: imageUrl });
        
        // Update all packages belonging to this destination to use the same image
        await Package.update({ image: imageUrl }, { where: { destinationId: dest.id } });
      } else {
        console.log(`No Wikipedia image found for ${dest.name}`);
        // Fallback to a reliable placeholder
        const fallback = `https://placehold.co/1000x800/222f3e/ffffff?text=${encodeURIComponent(dest.name)}`;
        await dest.update({ image: fallback });
        await Package.update({ image: fallback }, { where: { destinationId: dest.id } });
      }
    }
    
    console.log('Successfully updated all images to reliable sources.');
    process.exit(0);
  } catch (error) {
    console.error('Error updating images:', error);
    process.exit(1);
  }
};

run();

