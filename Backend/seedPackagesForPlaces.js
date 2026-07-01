// @ts-nocheck
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('travel_db', 'postgres', 'sangeetha', { 
  host: 'localhost', 
  port: 5432, 
  dialect: 'postgres',
  logging: false 
});

const Package = require('./src/modules/package/package.model');
const Place = require('./src/modules/place/place.model');
const Destination = require('./src/modules/destination/destination.model');
const PackagePlaces = sequelize.define('PackagePlaces', {
  packageId: { type: DataTypes.INTEGER, primaryKey: true },
  placeId: { type: DataTypes.INTEGER, primaryKey: true }
}, { tableName: 'PackagePlaces', timestamps: true });

async function seed() {
  try {
    // Delete all existing packages to start fresh
    require('./src/models/initModels')();
    await Package.destroy({ where: {} });
    await PackagePlaces.destroy({ where: {} });

    const places = await Place.findAll({ include: Destination });

    for (const place of places) {
      const destName = place.Destination ? place.Destination.name : 'Tour';
      
      let price = 5000;
      if (place.budget === 'Medium') price = 15000;
      if (place.budget === 'High') price = 25000;
      
      const slug = place.slug + '-pkg';

      const pkg = await Package.create({
        destinationId: place.destinationId,
        placeId: place.id,
        slug: slug,
        packageName: `${destName} Package - ${place.name}`,
        duration: '3 Days / 2 Nights',
        price: price,
        description: `Experience the beautiful ${place.name} in ${destName}. This package includes premium accommodation, guided tours, and comfortable transfers.`,
        image: place.image,
        status: true
      });

      // Link package and place
      await PackagePlaces.create({
        packageId: pkg.id,
        placeId: place.id
      });
    }

    console.log(`Successfully seeded ${places.length} packages for all places!`);
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    process.exit(0);
  }
}

seed();

