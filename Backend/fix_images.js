// @ts-nocheck
const sequelize = require('./src/config/sequelize');
const initializeAssociations = require('./src/models/initModels');
const { Destination, Place, Package } = initializeAssociations();

const getPollinationsUrl = (prompt, width, height) => {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true`;
};

async function fixImages() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    // Fix Destinations
    const destinations = await Destination.findAll();
    for (const dest of destinations) {
      // If image is unsplash, picsum, or missing
      if (!dest.image || dest.image.includes('unsplash') || dest.image.includes('picsum') || dest.image.includes('placeholder')) {
        dest.image = getPollinationsUrl(`beautiful tourism photography of ${dest.name} landscape`, 1200, 800);
        await dest.save();
        console.log(`Updated Destination Image: ${dest.name}`);
      }
    }

    // Fix Places
    const places = await Place.findAll({ include: Destination });
    for (const place of places) {
      if (!place.image || place.image.includes('unsplash') || place.image.includes('picsum') || place.image.includes('placeholder')) {
        const destName = place.Destination ? place.Destination.name : '';
        place.image = getPollinationsUrl(`beautiful photography of ${place.name} in ${destName}`, 800, 600);
        await place.save();
        console.log(`Updated Place Image: ${place.name}`);
      }
    }
    
    // Fix Packages (just in case they have unsplash/picsum)
    const packages = await Package.findAll();
    for (const pkg of packages) {
      if (!pkg.image || pkg.image.includes('unsplash') || pkg.image.includes('picsum') || pkg.image.includes('placeholder')) {
        pkg.image = getPollinationsUrl(`beautiful tourism package cover for ${pkg.packageName}`, 1200, 800);
        await pkg.save();
        console.log(`Updated Package Image: ${pkg.packageName}`);
      }
    }

    console.log('Successfully replaced all broken/blocked images with Pollinations AI images!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixImages();

