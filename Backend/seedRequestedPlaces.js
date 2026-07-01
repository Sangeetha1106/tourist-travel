// @ts-nocheck
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('travel_db', 'postgres', 'sangeetha', { 
  host: 'localhost', 
  port: 5432, 
  dialect: 'postgres',
  logging: false 
});

const Place = sequelize.define('Place', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  destinationId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true },
  entryFee: { type: DataTypes.STRING, allowNull: true },
  openingTime: { type: DataTypes.STRING, allowNull: true },
  budget: { type: DataTypes.STRING, allowNull: true },
  rating: { type: DataTypes.STRING, allowNull: true }
}, { tableName: 'places', timestamps: true });

const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const data = {
  7: [ // Manali
    { name: 'Solang Valley', desc: 'Adventure hub of Manali, famous for paragliding, skiing, and zorbing.' },
    { name: 'Rohtang Pass', desc: 'High mountain pass offering spectacular views and snow activities year-round.' },
    { name: 'Hadimba Temple', desc: 'Ancient cave temple dedicated to Hidimbi Devi, surrounded by a cedar forest.' },
    { name: 'Mall Road', desc: 'The heart of Manali, bustling with shops, cafes, and local handicrafts.' },
    { name: 'Vashisht Hot Springs', desc: 'Natural hot water springs located near the ancient Vashisht temple.' },
    { name: 'Jogini Waterfalls', desc: 'A scenic trek leads to this beautiful cascading waterfall in the valley.' },
    { name: 'Manu Temple', desc: 'Dedicated to Sage Manu, this temple offers panoramic views of the hills.' },
    { name: 'Old Manali', desc: 'Known for its laid-back vibe, charming cafes, and beautiful apple orchards.' },
    { name: 'Bhrigu Lake', desc: 'A high-altitude glacial lake offering a thrilling trekking experience.' },
    { name: 'Nehru Kund', desc: 'A natural spring named after India\'s first Prime Minister, surrounded by lush greenery.' }
  ],
  1: [ // Ooty
    { name: 'Ooty Lake', desc: 'Artificial lake surrounded by eucalyptus trees, popular for boating.' },
    { name: 'Botanical Garden', desc: 'Sprawling garden featuring rare trees, shrubs, and a fossilized tree trunk.' },
    { name: 'Doddabetta Peak', desc: 'The highest mountain in the Nilgiris, offering a bird\'s eye view of Ooty.' },
    { name: 'Rose Garden', desc: 'Home to thousands of rose varieties, making it one of the largest in India.' },
    { name: 'Pykara Lake', desc: 'A pristine lake and waterfall surrounded by the indigenous Toda settlements.' },
    { name: 'Emerald Lake', desc: 'A quiet and peaceful lake located in the Silent Valley, ideal for picnics.' },
    { name: 'Avalanche Lake', desc: 'Formed by a landslide, this scenic lake is perfect for camping and trekking.' },
    { name: 'Tea Museum', desc: 'Learn about the tea-making process and enjoy freshly brewed Nilgiri tea.' },
    { name: 'Nilgiri Toy Train', desc: 'A UNESCO World Heritage railway offering a scenic journey through the mountains.' },
    { name: 'Needle Rock View Point', desc: 'A famous vantage point offering a 360-degree view of the surrounding valleys.' }
  ],
  2: [ // Kodaikanal
    { name: 'Kodai Lake', desc: 'A star-shaped artificial lake, perfect for boating and cycling around the perimeter.' },
    { name: 'Pillar Rocks', desc: 'Three giant rock pillars standing tall, offering a dramatic view of the valley.' },
    { name: 'Coaker\'s Walk', desc: 'A scenic walking plaza providing breathtaking views of the plains below.' },
    { name: 'Bryant Park', desc: 'A beautifully maintained botanical garden famous for its colorful flowers and hybrids.' },
    { name: 'Pine Forest', desc: 'A majestic forest of tall pine trees, often featured in Indian cinema.' },
    { name: 'Guna Cave', desc: 'Also known as Devil\'s Kitchen, these deep, bat-infested caves are a thrilling visit.' },
    { name: 'Silver Cascade Falls', desc: 'A beautiful waterfall formed by the overflow of Kodai Lake, visible right from the road.' },
    { name: 'Berijam Lake', desc: 'A serene and secluded lake situated deep within the forest, requiring a permit to visit.' },
    { name: 'Green Valley View', desc: 'Formerly known as Suicide Point, offering a mesmerizing view of the Vaigai Dam.' },
    { name: 'Moir Point', desc: 'A popular viewpoint named after Sir Thomas Moir, offering stunning valley views.' }
  ],
  4: [ // Munnar
    { name: 'Tea Museum', desc: 'Showcases the history and evolution of tea plantations in Munnar.' },
    { name: 'Mattupetty Dam', desc: 'A scenic dam surrounded by tea gardens and forests, popular for speed boating.' },
    { name: 'Echo Point', desc: 'Famous for its natural echo phenomenon, located on the banks of a picturesque lake.' },
    { name: 'Top Station', desc: 'The highest point in Munnar, offering panoramic views of the Western Ghats.' },
    { name: 'Eravikulam National Park', desc: 'Home to the endangered Nilgiri Tahr and the blooming Neelakurinji flowers.' },
    { name: 'Rose Garden', desc: 'A beautiful garden showcasing a wide variety of roses and other exotic plants.' },
    { name: 'Photo Point', desc: 'A scenic spot with lush tea gardens, perfect for capturing beautiful memories.' },
    { name: 'Blossom Park', desc: 'A peaceful park featuring exotic flowers, a river, and a tranquil atmosphere.' },
    { name: 'Attukad Waterfalls', desc: 'A stunning waterfall surrounded by rolling hills and lush green jungles.' },
    { name: 'Pothamedu View Point', desc: 'Offers excellent views of tea, coffee, and cardamom plantations in the valley.' }
  ],
  3: [ // Yercaud
    { name: 'Yercaud Lake', desc: 'A beautiful lake surrounded by gardens and trees, offering boating facilities.' },
    { name: 'Pagoda Point', desc: 'A scenic viewpoint with a unique arrangement of stones resembling a pyramid.' },
    { name: 'Lady\'s Seat', desc: 'A rock formation that offers a panoramic view of the plains and the distant Mettur Dam.' },
    { name: 'Gent\'s Seat', desc: 'Another spectacular viewpoint located near Lady\'s Seat, offering equally stunning views.' },
    { name: 'Children\'s Seat', desc: 'A viewpoint offering beautiful scenery, often visited along with Lady\'s and Gent\'s Seat.' },
    { name: 'Botanical Garden', desc: 'Features a wide variety of exotic plants, including the rare Kurinji flower.' },
    { name: 'Bear\'s Cave', desc: 'A deep cave situated near the Norton\'s Bungalow, believed to be the home of bears.' },
    { name: 'Kiliyur Falls', desc: 'A mesmerizing waterfall that drops from a height of 300 feet, especially active during monsoons.' },
    { name: 'Anna Park', desc: 'A well-maintained park near Yercaud Lake, featuring a Japanese garden and various flower shows.' },
    { name: 'Silk Farm', desc: 'Learn about the lifecycle of silkworms and the process of silk production.' }
  ],
  5: [ // Goa
    { name: 'Baga Beach', desc: 'Famous for its vibrant nightlife, beach shacks, and water sports.' },
    { name: 'Calangute Beach', desc: 'Known as the Queen of Beaches, it is the largest and most popular beach in North Goa.' },
    { name: 'Candolim Beach', desc: 'A slightly quieter beach known for its clean sand and water sports activities.' },
    { name: 'Vagator Beach', desc: 'Known for its red cliffs, laid-back vibe, and stunning sunset views.' },
    { name: 'Anjuna Beach', desc: 'Famous for its trance parties, Wednesday flea market, and rocky shoreline.' },
    { name: 'Dudhsagar Falls', desc: 'A majestic four-tiered waterfall located on the Mandovi River.' },
    { name: 'Fort Aguada', desc: 'A 17th-century Portuguese fort offering panoramic views of the Arabian Sea.' },
    { name: 'Chapora Fort', desc: 'Offers spectacular views of Vagator Beach and the Chapora River, famous from Bollywood movies.' },
    { name: 'Basilica of Bom Jesus', desc: 'A UNESCO World Heritage site housing the mortal remains of St. Francis Xavier.' },
    { name: 'Palolem Beach', desc: 'A scenic crescent-shaped beach in South Goa, known for its calm waters and silent noise parties.' }
  ],
  6: [ // Kerala
    { name: 'Alleppey Backwaters', desc: 'Experience the iconic houseboat cruise through the serene backwaters.' },
    { name: 'Thekkady', desc: 'Home to the Periyar National Park, famous for its elephant sightings and spice plantations.' },
    { name: 'Kumarakom', desc: 'A tranquil village on Vembanad Lake, known for backwater tourism and bird watching.' },
    { name: 'Athirappilly Falls', desc: 'Often called the Niagara of India, this is the largest waterfall in Kerala.' },
    { name: 'Wayanad', desc: 'A picturesque district known for its waterfalls, caves, and spice plantations.' },
    { name: 'Bekal Fort', desc: 'The largest fort in Kerala, offering stunning views of the Arabian Sea.' },
    { name: 'Kovalam Beach', desc: 'A world-famous beach known for its three adjacent crescent beaches and lighthouse.' },
    { name: 'Varkala Beach', desc: 'Famous for its dramatic cliffs adjacent to the Arabian Sea and natural spring.' },
    { name: 'Poovar Island', desc: 'A beautiful island where the lake, river, and sea meet the land.' },
    { name: 'Vagamon', desc: 'A pristine hill station known for its pine forests, meadows, and tea estates.' }
  ],
  8: [ // Kashmir
    { name: 'Gulmarg', desc: 'A famous ski destination known for its Gondola ride and snow-capped peaks.' },
    { name: 'Pahalgam', desc: 'The Valley of Shepherds, famous for its scenic beauty and as the starting point of the Amarnath Yatra.' },
    { name: 'Sonamarg', desc: 'The Meadow of Gold, known for its stunning glaciers and serene lakes.' },
    { name: 'Dal Lake', desc: 'The Jewel in the crown of Kashmir, famous for its Shikara rides and houseboats.' },
    { name: 'Mughal Gardens', desc: 'Beautiful terraced gardens built by the Mughals, featuring stunning fountains and flowers.' },
    { name: 'Betaab Valley', desc: 'A lush green valley named after the Bollywood movie Betaab, surrounded by snow-clad mountains.' },
    { name: 'Aru Valley', desc: 'A scenic village offering breathtaking views, perfect for trekking and camping.' },
    { name: 'Shalimar Garden', desc: 'The largest of the Mughal gardens in Srinagar, built by Emperor Jahangir.' },
    { name: 'Nishat Garden', desc: 'The Garden of Joy, located on the eastern side of Dal Lake.' },
    { name: 'Srinagar Market', desc: 'Explore the bustling markets for authentic Kashmiri handicrafts, pashminas, and spices.' }
  ]
};

async function seedRequestedPlaces() {
  try {
    for (const [destId, places] of Object.entries(data)) {
      const destinationId = parseInt(destId);
      
      // Clear old places for this destination
      await Place.destroy({ where: { destinationId } });

      // Insert new 10 places
      for (const p of places) {
        const slug = generateSlug(`${destinationId}-${p.name}`);
        // Using picsum photos with a seed for unique images that are realistic landscape
        const image = `https://picsum.photos/seed/${slug}/800/600`;
        const rating = (4.0 + Math.random()).toFixed(1); // random rating between 4.0 and 5.0

        await Place.create({
          destinationId,
          name: p.name,
          slug: slug,
          description: p.desc,
          image: image,
          entryFee: '₹' + (Math.floor(Math.random() * 5) * 50 + 50),
          openingTime: '08:00 AM - 06:00 PM',
          budget: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
          rating: `${rating}/5.0`
        });
      }
      console.log(`Successfully seeded 10 places for destination ${destinationId}`);
    }
  } catch (err) {
    console.error('Failed to seed:', err);
  } finally {
    process.exit(0);
  }
}

seedRequestedPlaces();

