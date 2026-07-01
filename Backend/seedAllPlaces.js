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
  budget: { type: DataTypes.STRING, allowNull: true }
}, { tableName: 'places', timestamps: true });

const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);

const placesData = [
  // Kodaikanal
  { destId: 2, name: 'Kodai Lake', desc: 'Star-shaped artificial lake, popular for boating and cycling.', type: 'lake' },
  { destId: 2, name: 'Coaker\'s Walk', desc: 'A scenic 1-km walking plaza offering panoramic views of the plains.', type: 'peak' },
  { destId: 2, name: 'Bryant Park', desc: 'A wonderfully maintained botanical garden with thousands of flowers.', type: 'garden' },
  { destId: 2, name: 'Pillar Rocks', desc: 'Three giant rock pillars standing 400 feet tall, offering a bird\'s eye view.', type: 'peak' },
  { destId: 2, name: 'Silver Cascade Falls', desc: 'Beautiful waterfall formed by the overflow of Kodai Lake.', type: 'lake' },
  { destId: 2, name: 'Dolphin\'s Nose', desc: 'Flat rock projecting over a breathtaking 6,600-foot chasm.', type: 'peak' },
  { destId: 2, name: 'Guna Caves', desc: 'Fascinating caves surrounded by shola trees, known for their deep, dark nature.', type: 'peak' },

  // Yercaud
  { destId: 3, name: 'Yercaud Lake', desc: 'Picturesque pool surrounded by gardens and well-wooded trees.', type: 'lake' },
  { destId: 3, name: 'Lady\'s Seat', desc: 'A viewpoint that offers spectacular views of the winding ghat road.', type: 'peak' },
  { destId: 3, name: 'Pagoda Point', desc: 'Offers a beautiful panoramic view of Salem city and the neighboring villages.', type: 'peak' },
  { destId: 3, name: 'Killiyur Falls', desc: 'A magnificent 300 ft waterfall nestled in the Servaroyan hill range.', type: 'lake' },
  { destId: 3, name: 'Botanical Garden', desc: 'Houses hundreds of plants, including rare orchids.', type: 'garden' },
  { destId: 3, name: 'Shevaroy Temple', desc: 'Situated at the highest point in Yercaud, dedicated to Lord Shevaroyan.', type: 'garden' },

  // Munnar
  { destId: 4, name: 'Eravikulam National Park', desc: 'Home to the endangered Nilgiri Tahr and beautiful rolling hills.', type: 'garden' },
  { destId: 4, name: 'Mattupetty Dam', desc: 'A storage concrete gravity dam offering boating and stunning views.', type: 'lake' },
  { destId: 4, name: 'Tea Museum', desc: 'Chronicles the growth of tea plantations in Munnar.', type: 'garden' },
  { destId: 4, name: 'Anamudi Peak', desc: 'The highest peak in South India, popular for trekking.', type: 'peak' },
  { destId: 4, name: 'Echo Point', desc: 'Famous for its natural echo phenomenon and serene lake view.', type: 'peak' },

  // Goa
  { destId: 5, name: 'Baga Beach', desc: 'Vibrant beach famous for water sports, nightlife, and shacks.', type: 'lake' },
  { destId: 5, name: 'Calangute Beach', desc: 'Known as the Queen of Beaches, highly popular among tourists.', type: 'lake' },
  { destId: 5, name: 'Dudhsagar Falls', desc: 'A magnificent four-tiered waterfall on the Mandovi River.', type: 'lake' },
  { destId: 5, name: 'Aguada Fort', desc: 'A well-preserved 17th-century Portuguese fort and lighthouse.', type: 'peak' },
  { destId: 5, name: 'Basilica of Bom Jesus', desc: 'A UNESCO World Heritage site housing the remains of St. Francis Xavier.', type: 'garden' },

  // Kerala
  { destId: 6, name: 'Alleppey Backwaters', desc: 'Famous for houseboat cruises through tranquil backwater canals.', type: 'lake' },
  { destId: 6, name: 'Kovalam Beach', desc: 'Internationally renowned beach with a beautiful lighthouse.', type: 'lake' },
  { destId: 6, name: 'Thekkady', desc: 'Home to the Periyar National Park, known for elephants and spices.', type: 'garden' },
  { destId: 6, name: 'Varkala Beach', desc: 'A unique beach famous for its dramatic cliffs backing the Arabian Sea.', type: 'lake' },

  // Manali
  { destId: 7, name: 'Rohtang Pass', desc: 'A high mountain pass offering breathtaking views of glaciers and peaks.', type: 'peak' },
  { destId: 7, name: 'Solang Valley', desc: 'A paradise for adventure sports like paragliding and skiing.', type: 'peak' },
  { destId: 7, name: 'Hidimba Temple', desc: 'An ancient cave temple surrounded by a cedar forest.', type: 'garden' },
  { destId: 7, name: 'Beas River', desc: 'A pristine river known for river rafting and beautiful shorelines.', type: 'lake' },

  // Kashmir
  { destId: 8, name: 'Dal Lake', desc: 'The Jewel of Srinagar, famous for Shikara rides and houseboats.', type: 'lake' },
  { destId: 8, name: 'Gulmarg Gondola', desc: 'One of the highest cable cars in the world, offering snow-capped views.', type: 'peak' },
  { destId: 8, name: 'Pahalgam', desc: 'A beautiful valley known for lush meadows and the Lidder river.', type: 'garden' },

  // Dubai
  { destId: 9, name: 'Burj Khalifa', desc: 'The tallest building in the world, offering incredible city views.', type: 'peak' },
  { destId: 9, name: 'Dubai Mall', desc: 'One of the world\'s largest shopping and entertainment destinations.', type: 'garden' },
  { destId: 9, name: 'Palm Jumeirah', desc: 'An iconic man-made island shaped like a palm tree.', type: 'lake' },

  // Singapore
  { destId: 10, name: 'Gardens by the Bay', desc: 'Futuristic nature park featuring massive Supertrees and conservatories.', type: 'garden' },
  { destId: 10, name: 'Marina Bay Sands', desc: 'An iconic resort with a spectacular rooftop infinity pool.', type: 'lake' },
  { destId: 10, name: 'Sentosa Island', desc: 'A sunny island resort filled with attractions and beaches.', type: 'lake' },

  // Thailand
  { destId: 11, name: 'Phi Phi Islands', desc: 'Stunning islands famous for clear waters and limestone cliffs.', type: 'lake' },
  { destId: 11, name: 'Grand Palace', desc: 'A magnificent royal complex showcasing intricate Thai architecture.', type: 'garden' },
  { destId: 11, name: 'Doi Suthep', desc: 'A sacred mountain overlooking Chiang Mai, crowned with a golden temple.', type: 'peak' },

  // Maldives
  { destId: 12, name: 'Male Atoll', desc: 'The heart of the Maldives, perfect for luxury resorts and diving.', type: 'lake' },
  { destId: 12, name: 'Banana Reef', desc: 'A fantastic diving site full of vibrant marine life and corals.', type: 'lake' },
  { destId: 12, name: 'Bioluminescent Beach', desc: 'A magical beach where the waves glow blue at night.', type: 'lake' }
];

async function seed() {
  try {
    // Delete all places EXCEPT Ooty (which is destId 1)
    const { Op } = require('sequelize');
    await Place.destroy({ where: { destinationId: { [Op.ne]: 1 } } });
    
    // Insert new places
    for (const p of placesData) {
      let imagePath = '';
      if (p.type === 'lake') imagePath = 'uploads/places/ooty_lake.png'; // Reusing for all water/beach bodies
      else if (p.type === 'garden') imagePath = 'uploads/places/botanical_garden.png'; // Reusing for all parks/temples
      else imagePath = 'uploads/places/doddabetta_peak.png'; // Reusing for all peaks/views/monuments

      await Place.create({
        destinationId: p.destId,
        name: p.name,
        slug: generateSlug(p.name),
        description: p.desc,
        image: imagePath,
        entryFee: '₹' + (Math.floor(Math.random() * 5) + 1) * 50, // Random 50, 100, 150...
        openingTime: '08:00 AM - 06:00 PM',
        budget: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
      });
    }
    console.log('Successfully seeded real places for ALL destinations!');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    process.exit(0);
  }
}

seed();

