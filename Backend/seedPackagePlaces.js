// @ts-nocheck
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('travel_db', 'postgres', 'sangeetha', { 
  host: 'localhost', 
  port: 5432, 
  dialect: 'postgres',
  logging: false 
});

const Package = sequelize.define('Package', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  destinationId: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'packages', timestamps: true });

const Place = sequelize.define('Place', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  destinationId: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'places', timestamps: true });

const PackagePlaces = sequelize.define('PackagePlaces', {
  packageId: { type: DataTypes.INTEGER, primaryKey: true },
  placeId: { type: DataTypes.INTEGER, primaryKey: true }
}, { tableName: 'PackagePlaces', timestamps: true });

async function seed() {
  try {
    const packages = await Package.findAll();
    const places = await Place.findAll();

    let count = 0;
    
    // Clear existing connections to avoid duplicates
    await PackagePlaces.destroy({ where: {} });

    for (const pkg of packages) {
      // Find all places for this package's destination
      const destPlaces = places.filter(p => p.destinationId === pkg.destinationId);
      
      for (const place of destPlaces) {
        await PackagePlaces.create({
          packageId: pkg.id,
          placeId: place.id
        });
        count++;
      }
    }
    
    console.log(`Successfully mapped ${count} Places to their respective Packages!`);
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    process.exit(0);
  }
}

seed();

