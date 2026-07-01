// @ts-nocheck
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./src/config/sequelize');
require('./src/models/initModels')();

const Destination = require('./src/modules/destination/destination.model');
const Place = require('./src/modules/place/place.model');

const europeData = {
  France: [
    "Eiffel Tower", "Louvre Museum", "Arc de Triomphe", "Palace of Versailles", 
    "Mont Saint Michel", "French Riviera", "Disneyland Paris", "Notre Dame Cathedral", 
    "Champs Elysees", "Provence Lavender Fields"
  ],
  Italy: [
    "Colosseum", "Leaning Tower of Pisa", "Venice Grand Canal", "Vatican City", 
    "Roman Forum", "Amalfi Coast", "Florence Cathedral", "Cinque Terre", 
    "Milan Cathedral", "Lake Como"
  ],
  Switzerland: [
    "Jungfraujoch", "Mount Titlis", "Interlaken", "Zermatt", "Matterhorn", 
    "Rhine Falls", "Lucerne", "Geneva Lake", "Grindelwald", "St. Moritz"
  ],
  Germany: [
    "Brandenburg Gate", "Neuschwanstein Castle", "Black Forest", "Cologne Cathedral", 
    "Berlin Wall Memorial", "Munich Marienplatz", "Heidelberg Castle", "Zugspitze", 
    "Hamburg Port", "Rothenburg ob der Tauber"
  ],
  Spain: [
    "Sagrada Familia", "Park Guell", "Alhambra Palace", "Plaza Mayor", 
    "Seville Cathedral", "Ibiza Beach", "Costa Brava", "Montserrat Monastery", 
    "Santiago Cathedral", "Valencia City of Arts"
  ],
  Netherlands: [
    "Amsterdam Canals", "Keukenhof Gardens", "Rijksmuseum", "Van Gogh Museum", 
    "Zaanse Schans", "Kinderdijk Windmills", "Rotterdam Cube Houses", "Giethoorn Village", 
    "Anne Frank House", "Dam Square"
  ],
  Greece: [
    "Acropolis of Athens", "Santorini", "Mykonos", "Delphi", "Meteora", 
    "Crete Island", "Navagio Beach", "Temple of Poseidon", "Rhodes Old Town", "Corfu Island"
  ],
  Austria: [
    "Schonbrunn Palace", "Hallstatt", "Salzburg Old Town", "Vienna State Opera", 
    "Belvedere Palace", "Innsbruck", "Grossglockner Road", "Melk Abbey", 
    "Wachau Valley", "St. Stephen Cathedral"
  ],
  Norway: [
    "Geiranger Fjord", "Trolltunga", "Lofoten Islands", "Preikestolen", 
    "Bergen", "Oslo Opera House", "North Cape", "Atlantic Ocean Road", 
    "Flam Railway", "Svalbard"
  ],
  "United Kingdom": [
    "Big Ben", "Tower Bridge", "Buckingham Palace", "London Eye", "Stonehenge", 
    "Edinburgh Castle", "Lake District", "Windsor Castle", "Tower of London", "Oxford University"
  ]
};

const mapLocations = [
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.2922926156744008!3d48.85837007928746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sEiffel%20Tower!5e0!3m2!1sen!2s!4v1689255000000!5m2!1sen!2s",
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2969.654246110993!2d12.4922309154415!3d41.89021017922123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f61b6532013ad%3A0x28f1c82e908503c4!2sColosseum!5e0!3m2!1sen!2s!4v1689255100000!5m2!1sen!2s"
];

async function seedEurope() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    for (const [country, places] of Object.entries(europeData)) {
      // Create or find destination
      let dest = await Destination.findOne({ where: { name: country } });
      if (!dest) {
        dest = await Destination.create({
          name: country,
          description: `Experience the beauty, culture, and rich history of ${country}.`,
          location: `Europe`,
          image: `https://picsum.photos/seed/${country.replace(/\s/g, '')}Dest/1000/600`,
          category: 'europe',
          status: true
        });
        console.log(`Created Destination: ${country}`);
      }

      // Clear existing places for this destination to prevent duplicates
      await Place.destroy({ where: { destinationId: dest.id } });

      for (let i = 0; i < places.length; i++) {
        const placeName = places[i];
        const slug = placeName.toLowerCase().replace(/\s+/g, '-') + '-' + dest.id;
        
        // Generate pseudo-random realistic data
        const rating = (4.5 + Math.random() * 0.5).toFixed(1);
        const fee = i % 2 === 0 ? '€25' : 'Free Entry';
        const budget = i % 3 === 0 ? 'High' : (i % 2 === 0 ? 'Low' : 'Medium');
        const seedStr = `${country.replace(/\s/g, '')}${placeName.replace(/\s/g, '')}`;
        
        // Unique gallery images
        const gallery = [
          `https://picsum.photos/seed/${seedStr}1/800/600`,
          `https://picsum.photos/seed/${seedStr}2/800/600`,
          `https://picsum.photos/seed/${seedStr}3/800/600`,
          `https://picsum.photos/seed/${seedStr}4/800/600`
        ];

        const highlights = [
          `Iconic landmark in ${country}`,
          `Breathtaking views and architecture`,
          `Rich historical significance`,
          `Perfect for photography and sightseeing`
        ];

        const nearby = [
          "Local Heritage Museum",
          "City Center Shopping District",
          "Traditional Authentic Restaurants"
        ];

        const tips = [
          "Book tickets in advance to avoid long queues.",
          "Best visited during early morning hours.",
          "Beware of pickpockets in crowded areas."
        ];

        await Place.create({
          destinationId: dest.id,
          name: placeName,
          slug: slug,
          description: `The ${placeName} is one of the most magnificent and must-visit attractions in ${country}. Discover the stunning architecture, deep cultural roots, and unforgettable experiences that await you. Whether you're traveling solo or with family, ${placeName} promises memories that will last a lifetime.`,
          image: `https://picsum.photos/seed/${seedStr}/1000/700`,
          entryFee: fee,
          openingTime: "09:00 AM - 06:00 PM",
          budget: budget,
          rating: rating,
          bestTime: "April to October",
          highlights: highlights,
          nearbyAttractions: nearby,
          travelTips: tips,
          gallery: gallery,
          mapLocation: mapLocations[i % 2],
          status: true
        });
      }
      console.log(`Successfully seeded 10 places for ${country}`);
    }

    console.log('Europe places seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding Europe places:', error);
  } finally {
    process.exit(0);
  }
}

seedEurope();

