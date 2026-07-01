// @ts-nocheck
const sequelize = require('./src/config/sequelize');
const initializeAssociations = require('./src/models/initModels');

const { Destination, Package, Place } = initializeAssociations();

const placeData = {
  Ooty: [
    "Government Botanical Garden", "Ooty Lake", "Doddabetta Peak", "Pykara Lake", 
    "Pykara Waterfalls", "Avalanche Lake", "Emerald Lake", "Tea Factory & Museum", 
    "Thread Garden", "Rose Garden", "Wenlock Downs", "Shooting Point", 
    "Mudumalai National Park", "Needle Rock View Point", "Upper Bhavani"
  ],
  Kodaikanal: [
    "Coaker's Walk", "Bryant Park", "Kodai Lake", "Pillar Rocks", "Guna Caves",
    "Silver Cascade Falls", "Green Valley View", "Berijam Lake", "Pine Forest",
    "Dolphin's Nose", "Moir Point", "Chettiar Park", "Kurinji Andavar Temple",
    "Silent Valley View", "Mannavanur Lake"
  ],
  Yercaud: [
    "Yercaud Lake", "Pagoda Point", "Lady's Seat", "Gent's Seat", "Children's Seat",
    "Killiyur Falls", "Botanical Garden", "Anna Park", "Bear's Cave", "Kiliyur View Point",
    "Silk Farm", "Orchidarium", "Loop Road", "Coffee Plantation", "Karadiyur View Point"
  ],
  Kashmir: [
    "Dal Lake", "Gulmarg", "Sonamarg", "Pahalgam", "Betaab Valley",
    "Aru Valley", "Shalimar Garden", "Nishat Garden", "Chashme Shahi", "Thajiwas Glacier",
    "Srinagar Old City", "Tulip Garden", "Apharwat Peak", "Verinag", "Yusmarg"
  ]
};

const getRandomEntryFee = () => `₹${Math.floor(Math.random() * 150) + 20}`;
const getRandomTiming = () => `${Math.floor(Math.random() * 3) + 7}:00 AM - ${Math.floor(Math.random() * 4) + 5}:00 PM`;
const getRandomRating = () => (Math.random() * (5.0 - 4.2) + 4.2).toFixed(1);
const getRandomBudget = () => `₹${Math.floor(Math.random() * 1000) + 500}`;

const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const getRandomImage = (destName, placeName, index) => {
  // Using picsum photos with a seed for uniqueness and consistency
  // The seed is the place name encoded
  const seed = encodeURIComponent(placeName.replace(/\s+/g, ''));
  return `https://picsum.photos/seed/${seed}/800/600`;
};

const getDestinationImage = (destName) => {
  const seed = encodeURIComponent(destName.replace(/\s+/g, ''));
  return `https://picsum.photos/seed/${seed}_main/1200/800`;
};

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    for (const [destName, placesList] of Object.entries(placeData)) {
      // Find destination
      let destination = await Destination.findOne({ where: { name: destName } });
      
      if (!destination) {
        console.log(`Destination ${destName} not found, creating it...`);
        destination = await Destination.create({
          name: destName,
          description: `Experience the breathtaking beauty of ${destName}.`,
          location: destName === 'Kashmir' ? 'Jammu & Kashmir' : 'Tamil Nadu',
          image: getDestinationImage(destName),
          category: 'HILL_STATION',
          status: true
        });
      } else {
        // Fix broken or empty destination image
        if (!destination.image || destination.image.trim() === '' || destination.image.includes('placeholder')) {
           destination.image = getDestinationImage(destName);
           await destination.save();
           console.log(`Updated missing image for destination: ${destName}`);
        }
      }

      // Delete existing places for this destination to prevent duplicates
      await Place.destroy({ where: { destinationId: destination.id } });
      console.log(`Cleared old places for ${destName}`);

      // Create exactly 15 unique places
      const createdPlaces = [];
      let i = 1;
      for (const placeName of placesList) {
        const place = await Place.create({
          destinationId: destination.id,
          name: placeName,
          slug: generateSlug(`${destName}-${placeName}`),
          description: `A must-visit attraction in ${destName}. Enjoy the natural beauty and serene environment at ${placeName}.`,
          image: getRandomImage(destName, placeName, i),
          entryFee: getRandomEntryFee(),
          openingTime: getRandomTiming(),
          budget: getRandomBudget(),
          rating: getRandomRating(),
          bestTime: 'Throughout the year',
          status: true
        });
        createdPlaces.push(place);
        i++;
      }
      console.log(`Created 15 unique places for ${destName}`);

      // Link these places to ALL packages belonging to this destination
      const packages = await Package.findAll({ where: { destinationId: destination.id } });
      if (packages.length > 0) {
        for (const pkg of packages) {
           await pkg.setPlaces(createdPlaces);
        }
        console.log(`Linked 15 places to ${packages.length} packages in ${destName}`);
      }
    }

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();

