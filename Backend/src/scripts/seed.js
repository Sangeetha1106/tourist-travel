const sequelize = require('../config/sequelize');
const initializeAssociations = require('../models/initModels');
const Role = require('../modules/role/role.model');
const User = require('../modules/auth/user.model');
const Destination = require('../modules/destination/destination.model');
const Package = require('../modules/package/package.model');
const Place = require('../modules/place/place.model');
const Booking = require('../modules/booking/booking.model');
const { hashPassword } = require('../shared/utils/bcrypt');
const { ROLES } = require('../shared/utils/constants');

const destinationsData = [
  { name: 'Ooty', location: 'Tamil Nadu, India', image: 'https://images.unsplash.com/photo-1596484552834-0a300a7a01a3?q=80&w=1000&auto=format&fit=crop', description: 'Queen of Hill Stations famous for tea gardens and toy train.', category: 'india,honeymoon' },
  { name: 'Kodaikanal', location: 'Tamil Nadu, India', image: 'https://images.unsplash.com/photo-1592650893081-37d4f95d12de?q=80&w=1000&auto=format&fit=crop', description: 'Princess of Hill stations known for its beautiful star-shaped lake.', category: 'india,honeymoon' },
  { name: 'Yercaud', location: 'Tamil Nadu, India', image: 'https://images.unsplash.com/photo-1582506698642-19e0cc1d59ae?q=80&w=1000&auto=format&fit=crop', description: 'A jewel of the south famous for coffee plantations and scenic viewpoints.', category: 'india' },
  { name: 'Munnar', location: 'Kerala, India', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1000&auto=format&fit=crop', description: 'Rolling hills covered with tea plantations and misty mountains.', category: 'india,honeymoon' },
  { name: 'Goa', location: 'Goa, India', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop', description: 'Beautiful beaches, vibrant nightlife, and Portuguese heritage.', category: 'india,honeymoon' },
  { name: 'Kerala', location: 'Kerala, India', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop', description: 'God\'s Own Country famous for backwaters and Ayurveda.', category: 'india,honeymoon' },
  { name: 'Manali', location: 'Himachal Pradesh, India', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000&auto=format&fit=crop', description: 'High-altitude Himalayan resort town known for backpacking and honeymooning.', category: 'india,honeymoon' },
  { name: 'Kashmir', location: 'Jammu & Kashmir, India', image: 'https://images.unsplash.com/photo-1602484394998-3f59e1c18c44?q=80&w=1000&auto=format&fit=crop', description: 'Paradise on earth with stunning lakes and snow-capped peaks.', category: 'india,honeymoon' },
  { name: 'Dubai', location: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop', description: 'Ultramodern architecture, luxury shopping, and lively nightlife.', category: 'international' },
  { name: 'Singapore', location: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1000&auto=format&fit=crop', description: 'A global financial center with a tropical climate and multicultural population.', category: 'international' },
  { name: 'Thailand', location: 'Thailand', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000&auto=format&fit=crop', description: 'Tropical beaches, opulent royal palaces, ancient ruins and ornate temples.', category: 'international' },
  { name: 'Maldives', location: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1000&auto=format&fit=crop', description: 'Tropical nation composed of 26 ring-shaped atolls, known for its beaches and blue lagoons.', category: 'international,honeymoon' }
];

const destinationImages = {
  'Ooty': [
    'https://images.unsplash.com/photo-1589136777351-fdc9c9cb15f9?q=80&w=1000&auto=format&fit=crop', // Tea Estate
    'https://images.unsplash.com/photo-1626243868212-0545934cc3f0?q=80&w=1000&auto=format&fit=crop', // Toy Train
    'https://images.unsplash.com/photo-1596484552834-0a300a7a01a3?q=80&w=1000&auto=format&fit=crop', // Lake/Hills
    'https://images.unsplash.com/photo-1616853703905-59b4c09d3ab2?q=80&w=1000&auto=format&fit=crop', // Botanical Garden style
  ],
  'Kodaikanal': [
    'https://images.unsplash.com/photo-1592650893081-37d4f95d12de?q=80&w=1000&auto=format&fit=crop', // Lake
    'https://images.unsplash.com/photo-1588661601614-7f1542f2ed84?q=80&w=1000&auto=format&fit=crop', // Pine Forest
    'https://images.unsplash.com/photo-1506461883276-594a12b11fc6?q=80&w=1000&auto=format&fit=crop', // Mist
    'https://images.unsplash.com/photo-1601724213601-ee2ed78566fa?q=80&w=1000&auto=format&fit=crop', // Hills
  ],
  'Yercaud': [
    'https://images.unsplash.com/photo-1582506698642-19e0cc1d59ae?q=80&w=1000&auto=format&fit=crop', // General
    'https://images.unsplash.com/photo-1600100397608-f010f41cb8ea?q=80&w=1000&auto=format&fit=crop', // Coffee Estate
    'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1000&auto=format&fit=crop', // Hills
    'https://images.unsplash.com/photo-1618774083321-72f5d9cc009f?q=80&w=1000&auto=format&fit=crop', // Viewpoint
  ],
  'Munnar': [
    'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1000&auto=format&fit=crop', // Tea Gardens
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop', // Mist Hills
    'https://images.unsplash.com/photo-1582506698642-19e0cc1d59ae?q=80&w=1000&auto=format&fit=crop', // Waterfalls/Nature
    'https://images.unsplash.com/photo-1623126861614-2eb9ce107293?q=80&w=1000&auto=format&fit=crop', // Mountains
  ],
  'Goa': [
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop', // Beach
    'https://images.unsplash.com/photo-1560179406-1c6c60e0dc26?q=80&w=1000&auto=format&fit=crop', // Church
    'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=1000&auto=format&fit=crop', // Sunset
    'https://images.unsplash.com/photo-1516815231560-8f41ec531527?q=80&w=1000&auto=format&fit=crop', // Resort
  ],
  'Kerala': [
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop', // Backwaters
    'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1000&auto=format&fit=crop', // Nature
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000&auto=format&fit=crop', // Houseboat
    'https://images.unsplash.com/photo-1574510001099-2a91e5e01c9b?q=80&w=1000&auto=format&fit=crop', // Coast
  ],
  'Manali': [
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000&auto=format&fit=crop', // Snow
    'https://images.unsplash.com/photo-1605649487212-4d4ce77fd444?q=80&w=1000&auto=format&fit=crop', // Valley
    'https://images.unsplash.com/photo-1590595304677-7d52a228fdd6?q=80&w=1000&auto=format&fit=crop', // Mountains
    'https://images.unsplash.com/photo-1542385150-13f389366e6d?q=80&w=1000&auto=format&fit=crop', // River
  ],
  'Kashmir': [
    'https://images.unsplash.com/photo-1602484394998-3f59e1c18c44?q=80&w=1000&auto=format&fit=crop', // Dal Lake
    'https://images.unsplash.com/photo-1610648937060-7ea008c2eb5f?q=80&w=1000&auto=format&fit=crop', // Snow peaks
    'https://images.unsplash.com/photo-1598463836371-3316d51cb592?q=80&w=1000&auto=format&fit=crop', // Valley
    'https://images.unsplash.com/photo-1616853703905-59b4c09d3ab2?q=80&w=1000&auto=format&fit=crop', // Garden
  ],
  'Dubai': [
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop', // Burj
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1000&auto=format&fit=crop', // Desert
    'https://images.unsplash.com/photo-1526495124232-a04e1849168c?q=80&w=1000&auto=format&fit=crop', // Palm
    'https://images.unsplash.com/photo-1582672060624-cb2d93e1b714?q=80&w=1000&auto=format&fit=crop', // Marina
  ],
  'Singapore': [
    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1000&auto=format&fit=crop', // Marina Bay
    'https://images.unsplash.com/photo-1565967511849-76a60a516170?q=80&w=1000&auto=format&fit=crop', // Supertree
    'https://images.unsplash.com/photo-1546412414-8035e1776c9a?q=80&w=1000&auto=format&fit=crop', // Cityscape
    'https://images.unsplash.com/photo-1573007974656-b958089e9f7b?q=80&w=1000&auto=format&fit=crop', // Merlion
  ],
  'Thailand': [
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000&auto=format&fit=crop', // Beach
    'https://images.unsplash.com/photo-1563492065599-3520f775eeed?q=80&w=1000&auto=format&fit=crop', // Temple
    'https://images.unsplash.com/photo-1586943101559-4ae5a04ce499?q=80&w=1000&auto=format&fit=crop', // Island
    'https://images.unsplash.com/photo-1508009603885-24740f135b67?q=80&w=1000&auto=format&fit=crop', // City
  ],
  'Maldives': [
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1000&auto=format&fit=crop', // Water Villas
    'https://images.unsplash.com/photo-1437719474928-e7100a4540d7?q=80&w=1000&auto=format&fit=crop', // Blue Ocean
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1000&auto=format&fit=crop', // Beach
    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1000&auto=format&fit=crop', // Aerial
  ]
};

const generatePlacesAndPackages = (destinations) => {
  const places = [];
  const packages = [];
  const packageTypes = [
    'Family Package', 'Honeymoon Package', 'Adventure Package', 'Luxury Package'
  ];

  destinations.forEach((dest) => {
    // Generate 4 places per destination
    const placeNames = [`${dest.name} Central Square`, `${dest.name} Historical Museum`, `${dest.name} Scenic Viewpoint`, `${dest.name} Local Market`];
    
    placeNames.forEach((placeName, pIdx) => {
      const placeSlug = `p-${dest.name.toLowerCase().replace(/\s+/g, '-')}-${pIdx + 1}`;
      places.push({
        slug: placeSlug,
        destinationId: dest.id,
        name: placeName,
        description: `Explore the amazing ${placeName} in ${dest.name}.`,
        image: destinationImages[dest.name] ? destinationImages[dest.name][pIdx % destinationImages[dest.name].length] : dest.image,
        entryFee: pIdx % 2 === 0 ? 'Free' : '₹100',
        openingTime: '9:00 AM - 6:00 PM',
        budget: 'Low'
      });

      // Generate packages for this place
      packageTypes.forEach((type, index) => {
        const destImgs = destinationImages[dest.name] || [dest.image];
        const uniqueImage = destImgs[index % destImgs.length];

        packages.push({
          slug: `pkg-${placeSlug}-${type.toLowerCase().replace(/\s+/g, '-')}`,
          placeSlug: placeSlug, // Temporary to map placeId later
          destinationId: dest.id,
          packageName: `${dest.name} ${type} - ${placeName}`,
          duration: `${Math.floor(Math.random() * 5) + 2} Days ${Math.floor(Math.random() * 4) + 1} Nights`,
          price: (Math.floor(Math.random() * 10) + 5) * 1000,
          description: `Experience the best of ${dest.name} at ${placeName} with our exclusive ${type}. \n\nDay 1: Arrival and local sightseeing. \nDay 2: Full day tour. \nDay 3: Departure.`,
          image: uniqueImage,
          status: true
        });
      });
    });
  });
  return { places, packages };
};

const seedData = async () => {
  try {
    initializeAssociations();
    await sequelize.sync({ force: true });

    console.log('Database synced. Seeding roles...');
    
    // Seed Roles
    const rolesToCreate = Object.values(ROLES).map(role => ({ roleName: role }));
    const createdRoles = await Role.bulkCreate(rolesToCreate);

    console.log('Roles seeded. Seeding users for each role...');

    const hashedPassword = await hashPassword('password123');

    const usersToCreate = createdRoles.map(role => {
      const prefix = role.roleName.toLowerCase();
      return {
        firstName: prefix.charAt(0).toUpperCase() + prefix.slice(1),
        lastName: 'User',
        email: `${prefix}@travel.com`,
        phone: '1234567890',
        password: hashedPassword,
        roleId: role.id,
        status: true
      };
    });

    const users = await User.bulkCreate(usersToCreate, { returning: true });

    console.log('Users seeded. Seeding 35 Destinations...');

    const createdDestinations = await Destination.bulkCreate(destinationsData, { returning: true });

    console.log('Destinations seeded. Generating and Seeding Places and Packages...');
    const { places, packages } = generatePlacesAndPackages(createdDestinations);
    
    // Create Places
    const createdPlaces = await Place.bulkCreate(places, { returning: true });
    
    // Map placeIds to packages based on slug
    const placeMap = {};
    createdPlaces.forEach(p => placeMap[p.slug] = p.id);
    packages.forEach(pkg => {
      pkg.placeId = placeMap[pkg.placeSlug];
      delete pkg.placeSlug; // Remove temporary field
    });

    const createdPackages = await Package.bulkCreate(packages, { returning: true });

    console.log(`Successfully seeded ${createdDestinations.length} Destinations, ${createdPlaces.length} Places, and ${createdPackages.length} Packages!`);

    console.log('Seeding Bookings...');
    const customer = users.find(u => u.email === 'customer@travel.com');
    if (customer && createdPackages.length > 0) {
      await Booking.create({
        packageId: createdPackages[0].id,
        packageName: createdPackages[0].packageName,
        userId: customer.id,
        customerName: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        phone: customer.phone,
        travelDate: '2026-12-01',
        totalPersons: 2,
        totalAmount: createdPackages[0].price * 2,
        bookingStatus: 'CONFIRMED'
      });
      await Booking.create({
        packageId: createdPackages[15].id,
        packageName: createdPackages[15].packageName,
        userId: customer.id,
        customerName: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        phone: customer.phone,
        travelDate: '2026-10-15',
        totalPersons: 4,
        totalAmount: createdPackages[15].price * 4,
        bookingStatus: 'COMPLETED'
      });
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
