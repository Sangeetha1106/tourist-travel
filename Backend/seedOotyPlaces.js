// @ts-nocheck
const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');

// 1. Copy Images
const artifactsDir = 'C:\\Users\\SANGEETHA M\\.gemini\\antigravity-ide\\brain\\9c78b96c-8536-459b-8fba-497a89439ba0';
const uploadsDir = 'd:\\XTOWN\\tourist travel\\backend\\uploads\\places';

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Find generated images
const files = fs.readdirSync(artifactsDir);
const lakeImg = files.find(f => f.startsWith('ooty_lake_') && f.endsWith('.png'));
const gardenImg = files.find(f => f.startsWith('botanical_garden_') && f.endsWith('.png'));
const peakImg = files.find(f => f.startsWith('doddabetta_peak_') && f.endsWith('.png'));

if (lakeImg) fs.copyFileSync(path.join(artifactsDir, lakeImg), path.join(uploadsDir, 'ooty_lake.png'));
if (gardenImg) fs.copyFileSync(path.join(artifactsDir, gardenImg), path.join(uploadsDir, 'botanical_garden.png'));
if (peakImg) fs.copyFileSync(path.join(artifactsDir, peakImg), path.join(uploadsDir, 'doddabetta_peak.png'));

// 2. Database Update
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

const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const ootyPlaces = [
  { name: 'Ooty Lake', desc: 'Famous artificial lake for boating, cycling, and family activities.', type: 'lake' },
  { name: 'Government Botanical Garden', desc: 'Beautiful garden with thousands of flower species and rare plants.', type: 'garden' },
  { name: 'Doddabetta Peak', desc: 'The highest peak in the Nilgiris, offering panoramic views.', type: 'peak' },
  { name: 'Rose Garden', desc: 'One of India\'s largest rose gardens with thousands of rose varieties.', type: 'garden' },
  { name: 'Pykara Lake & Pykara Falls', desc: 'Scenic lake and waterfall, ideal for boating and photography.', type: 'lake' },
  { name: 'Emerald Lake', desc: 'Peaceful lake surrounded by tea plantations and hills.', type: 'lake' },
  { name: 'Avalanche Lake', desc: 'Popular for trekking, camping, and nature photography.', type: 'lake' },
  { name: 'Tea Museum & Tea Factory', desc: 'Learn about tea processing and enjoy fresh Nilgiri tea.', type: 'garden' },
  { name: 'Nilgiri Mountain Railway', desc: 'UNESCO World Heritage toy train offering scenic mountain views.', type: 'peak' },
  { name: 'Needle Rock View Point', desc: 'Famous viewpoint overlooking forests, valleys, and mountains.', type: 'peak' }
];

async function seed() {
  try {
    // Delete existing Ooty places
    await Place.destroy({ where: { destinationId: 1 } });
    
    // Insert new places
    for (const p of ootyPlaces) {
      let imagePath = '';
      if (p.type === 'lake') imagePath = 'uploads/places/ooty_lake.png';
      else if (p.type === 'garden') imagePath = 'uploads/places/botanical_garden.png';
      else imagePath = 'uploads/places/doddabetta_peak.png';

      await Place.create({
        destinationId: 1,
        name: p.name,
        slug: generateSlug(p.name),
        description: p.desc,
        image: imagePath,
        entryFee: '₹50',
        openingTime: '09:00 AM - 06:00 PM',
        budget: 'Low'
      });
    }
    console.log('Successfully seeded 10 real Ooty places!');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    process.exit(0);
  }
}

seed();

