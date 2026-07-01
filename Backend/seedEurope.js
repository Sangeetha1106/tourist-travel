// @ts-nocheck
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('travel_db', 'postgres', 'sangeetha', { 
  host: 'localhost', 
  port: 5432, 
  dialect: 'postgres',
  logging: false 
});

const Destination = sequelize.define('Destination', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true },
  category: { type: DataTypes.STRING, defaultValue: 'india' }
}, { tableName: 'destinations', timestamps: true });

const Package = sequelize.define('Package', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  destinationId: { type: DataTypes.INTEGER, allowNull: false },
  packageName: { type: DataTypes.STRING, allowNull: false },
  duration: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true }
}, { tableName: 'packages', timestamps: true });

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

const europeData = [
  {
    dest: { name: 'Paris', location: 'France, Europe', desc: 'The City of Light, famous for its culture, art, and iconic monuments.', image: 'https://images.unsplash.com/photo-1502602881462-8c97368f566a?w=800' },
    places: [
      { name: 'Eiffel Tower', desc: 'Iconic wrought-iron spire and global cultural icon of France.', type: 'peak' },
      { name: 'Louvre Museum', desc: 'World\'s largest art museum and a historic monument in Paris.', type: 'garden' },
      { name: 'Notre-Dame Cathedral', desc: 'Medieval Catholic cathedral known for its French Gothic architecture.', type: 'garden' },
      { name: 'Seine River Cruise', desc: 'Romantic boat ride offering views of Paris\'s most famous landmarks.', type: 'lake' },
      { name: 'Palace of Versailles', desc: 'Former French royal residence and centre of government.', type: 'garden' },
      { name: 'Montmartre', desc: 'Large hill in Paris\'s 18th arrondissement, famous for its artistic history.', type: 'peak' },
      { name: 'Arc de Triomphe', desc: 'One of the most famous monuments in Paris, honoring those who fought for France.', type: 'peak' },
      { name: 'Sainte-Chapelle', desc: 'A royal chapel in the Gothic style, featuring stunning stained glass.', type: 'garden' },
      { name: 'Musée d\'Orsay', desc: 'Museum housing the largest collection of impressionist masterpieces.', type: 'garden' },
      { name: 'Luxembourg Gardens', desc: 'Beautiful gardens created in 1612 by Marie de\' Medici.', type: 'garden' }
    ]
  },
  {
    dest: { name: 'Rome', location: 'Italy, Europe', desc: 'The Eternal City, steeped in history and ancient ruins.', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800' },
    places: [
      { name: 'Colosseum', desc: 'An oval amphitheatre in the centre of the city of Rome, the largest ever built.', type: 'garden' },
      { name: 'Trevi Fountain', desc: 'Famous 18th-century fountain in the Trevi district.', type: 'lake' },
      { name: 'Pantheon', desc: 'Former Roman temple, now a Catholic church, with a stunning dome.', type: 'garden' },
      { name: 'Roman Forum', desc: 'Rectangular forum surrounded by the ruins of several important ancient government buildings.', type: 'garden' },
      { name: 'Vatican Museums', desc: 'Public museums of the Vatican City featuring immense Renaissance art collections.', type: 'garden' },
      { name: 'St. Peter\'s Basilica', desc: 'A Renaissance style church in Vatican City, the largest in the world.', type: 'peak' },
      { name: 'Spanish Steps', desc: 'A monumental stairway of 135 steps built in the 18th century.', type: 'peak' },
      { name: 'Piazza Navona', desc: 'A public open space in Rome built on the site of the Stadium of Domitian.', type: 'garden' },
      { name: 'Sistine Chapel', desc: 'A chapel in the Apostolic Palace, famous for Michelangelo\'s ceiling frescoes.', type: 'garden' },
      { name: 'Palatine Hill', desc: 'The centermost of the Seven Hills of Rome and one of the most ancient parts of the city.', type: 'peak' }
    ]
  },
  {
    dest: { name: 'Swiss Alps', location: 'Switzerland, Europe', desc: 'Breathtaking mountain range known for skiing, hiking, and pristine lakes.', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800' },
    places: [
      { name: 'Matterhorn', desc: 'One of the highest and most iconic peaks in the Alps.', type: 'peak' },
      { name: 'Jungfraujoch', desc: 'A saddle in the Bernese Alps, accessible by a scenic railway.', type: 'peak' },
      { name: 'Lake Geneva', desc: 'A deep lake on the north side of the Alps, shared between Switzerland and France.', type: 'lake' },
      { name: 'Lake Lucerne', desc: 'A stunning lake in central Switzerland with complex shorelines.', type: 'lake' },
      { name: 'Interlaken', desc: 'A traditional resort town built on a narrow stretch of valley.', type: 'garden' },
      { name: 'Zermatt', desc: 'A mountain resort renowned for skiing, climbing and hiking.', type: 'peak' },
      { name: 'Mount Titlis', desc: 'A mountain of the Uri Alps, famous for the world\'s first revolving cable car.', type: 'peak' },
      { name: 'Rhine Falls', desc: 'The largest plain waterfall in Europe.', type: 'lake' },
      { name: 'Glacier Express', desc: 'A famous panoramic train journey through the Swiss Alps.', type: 'peak' },
      { name: 'Chillon Castle', desc: 'An island castle located on Lake Geneva.', type: 'lake' }
    ]
  }
];

async function seed() {
  try {
    for (const data of europeData) {
      // 1. Create Destination
      const dest = await Destination.create({
        name: data.dest.name,
        location: data.dest.location,
        description: data.dest.desc,
        image: data.dest.image,
        category: 'europe,international'
      });
      
      // 2. Create Default Package for this Destination
      await Package.create({
        destinationId: dest.id,
        packageName: `Magical ${data.dest.name} Tour`,
        duration: '5 Days / 4 Nights',
        price: 150000.00,
        description: `Explore the best of ${data.dest.name} with our premium guided tour.`,
        image: data.dest.image
      });

      // 3. Create 10 Places
      for (const p of data.places) {
        let imagePath = '';
        if (p.type === 'lake') imagePath = 'uploads/places/ooty_lake.png';
        else if (p.type === 'garden') imagePath = 'uploads/places/botanical_garden.png';
        else imagePath = 'uploads/places/doddabetta_peak.png';

        await Place.create({
          destinationId: dest.id,
          name: p.name,
          slug: generateSlug(p.name),
          description: p.desc,
          image: imagePath,
          entryFee: '₹' + (Math.floor(Math.random() * 20) + 10) * 100, // Europe is expensive
          openingTime: '09:00 AM - 05:00 PM',
          budget: ['Medium', 'High'][Math.floor(Math.random() * 2)]
        });
      }
    }
    console.log('Successfully seeded Europe destinations and 10 places each!');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    process.exit(0);
  }
}

seed();

