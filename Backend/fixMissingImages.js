// @ts-nocheck
const Destination = require('./src/modules/destination/destination.model');
const Package = require('./src/modules/package/package.model');
const sequelize = require('./src/config/sequelize');

const imageMap = {
  // Missing Indian
  'Wayanad': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Wayanad_landscape.jpg/1280px-Wayanad_landscape.jpg',
  'Coorg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Abbey_Falls_Coorg.jpg/1280px-Abbey_Falls_Coorg.jpg',
  'Andaman Islands': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Radhanagar_Beach_in_Havelock_Island.jpg/1280px-Radhanagar_Beach_in_Havelock_Island.jpg',
  'Andaman': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Radhanagar_Beach_in_Havelock_Island.jpg/1280px-Radhanagar_Beach_in_Havelock_Island.jpg',
  'Manali': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Manali_City.jpg/1280px-Manali_City.jpg',
  'Shimla': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Shimla_-_View_from_the_Ridge.jpg/1280px-Shimla_-_View_from_the_Ridge.jpg',
  'Kashmir Valley': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Dal_Lake_Srinagar_Kashmir.jpg/1280px-Dal_Lake_Srinagar_Kashmir.jpg',
  'Kashmir': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Dal_Lake_Srinagar_Kashmir.jpg/1280px-Dal_Lake_Srinagar_Kashmir.jpg',
  'Ladakh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Pangong_Tso_Lake_Ladakh.jpg/1280px-Pangong_Tso_Lake_Ladakh.jpg',
  'Jaipur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Hawa_Mahal_Jaipur.jpg/1280px-Hawa_Mahal_Jaipur.jpg',
  'Udaipur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Lake_Palace_Udaipur.jpg/1280px-Lake_Palace_Udaipur.jpg',
  'Agra': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1280px-Taj_Mahal_%28Edited%29.jpeg',
  'Delhi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/India_Gate_in_New_Delhi_03-2016.jpg/1280px-India_Gate_in_New_Delhi_03-2016.jpg',
  'Darjeeling': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Darjeeling_Tea_Estate.jpg/1280px-Darjeeling_Tea_Estate.jpg',

  // International
  'Dubai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Dubai_Skylines_at_night_%28Pexels_3787839%29.jpg/1280px-Dubai_Skylines_at_night_%28Pexels_3787839%29.jpg',
  'Singapore': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Singapore_skyline_at_night.jpg/1280px-Singapore_skyline_at_night.jpg',
  'Malaysia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Kuala_Lumpur_skyline_at_dusk.jpg/1280px-Kuala_Lumpur_skyline_at_dusk.jpg',
  'Thailand': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Wat_Arun_at_sunset%2C_Bangkok.jpg/1280px-Wat_Arun_at_sunset%2C_Bangkok.jpg',
  'Bali': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Pura_Ulun_Danu_Bratan.jpg/1280px-Pura_Ulun_Danu_Bratan.jpg',
  'Maldives': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Maldives_bungalows.jpg/1280px-Maldives_bungalows.jpg',
  'Paris': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques_000222.jpg/1280px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques_000222.jpg',
  'Switzerland': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Matterhorn_from_Domh%C3%BCtte_-_2.jpg/1280px-Matterhorn_from_Domh%C3%BCtte_-_2.jpg',
  'London': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall.jpg/1280px-Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall.jpg',
  'Turkey': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Hagia_Sophia_Mars_2013.jpg/1280px-Hagia_Sophia_Mars_2013.jpg',
  'Vietnam': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Ha_Long_Bay_Vietnam.jpg/1280px-Ha_Long_Bay_Vietnam.jpg',
  'Sri Lanka': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Sigiriya_from_Pidurangala.jpg/1280px-Sigiriya_from_Pidurangala.jpg',
  'Mauritius': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Le_Morne_Brabant_Mauritius.jpg/1280px-Le_Morne_Brabant_Mauritius.jpg',
  'Japan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Mt.Fuji_with_Chureito_Pagoda.jpg/1280px-Mt.Fuji_with_Chureito_Pagoda.jpg',
  'South Korea': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Gyeongbokgung_Palace_in_Seoul.jpg/1280px-Gyeongbokgung_Palace_in_Seoul.jpg'
};

const run = async () => {
  try {
    await sequelize.authenticate();
    const destinations = await Destination.findAll();
    
    for (const dest of destinations) {
      const imageUrl = imageMap[dest.name];
      if (imageUrl) {
        console.log(`Updating ${dest.name} -> ${imageUrl}`);
        await dest.update({ image: imageUrl });
        await Package.update({ image: imageUrl }, { where: { destinationId: dest.id } });
      }
    }
    
    console.log('Successfully updated the remaining images.');
    process.exit(0);
  } catch (error) {
    console.error('Error updating images:', error);
    process.exit(1);
  }
};

run();

