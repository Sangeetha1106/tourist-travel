const sequelize = require('./config/sequelize');
const Guide = require('./modules/guide/guide.model');
const Vehicle = require('./modules/vehicle/vehicle.model');
const Hotel = require('./modules/hotel/hotel.model');

const guidesData = [
  { fullName: 'Arun Kumar', email: 'arun@example.com', phone: '9876543210', gender: 'Male', experience: 5, languages: 'English, Hindi, Tamil', specialization: 'Historical Tours', rating: 4.8, status: 'AVAILABLE', address: 'Chennai, TN' },
  { fullName: 'Priya Sharma', email: 'priya@example.com', phone: '9876543211', gender: 'Female', experience: 3, languages: 'English, Hindi', specialization: 'Cultural Tours', rating: 4.5, status: 'AVAILABLE', address: 'Delhi, DL' },
  { fullName: 'Rahul Verma', email: 'rahul@example.com', phone: '9876543212', gender: 'Male', experience: 7, languages: 'English, French', specialization: 'Adventure Tours', rating: 4.9, status: 'AVAILABLE', address: 'Mumbai, MH' },
  { fullName: 'John Peter', email: 'john@example.com', phone: '9876543213', gender: 'Male', experience: 4, languages: 'English, Spanish', specialization: 'City Tours', rating: 4.2, status: 'AVAILABLE', address: 'Goa' },
  { fullName: 'Sathish Kumar', email: 'sathish@example.com', phone: '9876543214', gender: 'Male', experience: 8, languages: 'English, Tamil, Telugu', specialization: 'Nature Trails', rating: 4.7, status: 'AVAILABLE', address: 'Coimbatore, TN' },
  { fullName: 'Anita Desai', email: 'anita@example.com', phone: '9876543215', gender: 'Female', experience: 2, languages: 'English, Hindi, Marathi', specialization: 'Food Tours', rating: 4.1, status: 'AVAILABLE', address: 'Pune, MH' },
  { fullName: 'Karthik Raja', email: 'karthik@example.com', phone: '9876543216', gender: 'Male', experience: 6, languages: 'English, Malayalam', specialization: 'Heritage Tours', rating: 4.6, status: 'AVAILABLE', address: 'Kochi, KL' },
  { fullName: 'Meera Reddy', email: 'meera@example.com', phone: '9876543217', gender: 'Female', experience: 4, languages: 'English, Telugu', specialization: 'Pilgrimage', rating: 4.4, status: 'AVAILABLE', address: 'Tirupati, AP' },
  { fullName: 'Vikram Singh', email: 'vikram@example.com', phone: '9876543218', gender: 'Male', experience: 10, languages: 'English, Hindi, Punjabi', specialization: 'Mountain Treks', rating: 5.0, status: 'AVAILABLE', address: 'Manali, HP' },
  { fullName: 'Lakshmi Narayan', email: 'lakshmi@example.com', phone: '9876543219', gender: 'Female', experience: 5, languages: 'English, Kannada', specialization: 'Temple Tours', rating: 4.5, status: 'AVAILABLE', address: 'Mysore, KA' },
  { fullName: 'Sanjay Dutt', email: 'sanjay@example.com', phone: '9876543220', gender: 'Male', experience: 12, languages: 'English, Gujarati', specialization: 'Desert Safaris', rating: 4.8, status: 'AVAILABLE', address: 'Jaisalmer, RJ' },
  { fullName: 'Sneha Patel', email: 'sneha@example.com', phone: '9876543221', gender: 'Female', experience: 3, languages: 'English, Hindi, Gujarati', specialization: 'Wildlife', rating: 4.3, status: 'AVAILABLE', address: 'Ahmedabad, GJ' },
  { fullName: 'Ramesh Babu', email: 'ramesh@example.com', phone: '9876543222', gender: 'Male', experience: 7, languages: 'English, Tamil', specialization: 'Hill Stations', rating: 4.6, status: 'AVAILABLE', address: 'Ooty, TN' },
  { fullName: 'Geeta Phogat', email: 'geeta@example.com', phone: '9876543223', gender: 'Female', experience: 2, languages: 'English, Haryanvi', specialization: 'Sports Tours', rating: 4.0, status: 'AVAILABLE', address: 'Rohtak, HR' },
  { fullName: 'Mohammad Ali', email: 'mohammad@example.com', phone: '9876543224', gender: 'Male', experience: 9, languages: 'English, Urdu, Arabic', specialization: 'Historical Tours', rating: 4.9, status: 'AVAILABLE', address: 'Hyderabad, TS' }
];

const vehiclesData = [
  { vehicleName: 'Toyota Innova Crysta', vehicleType: 'SUV', vehicleNumber: 'TN38AB1234', driverName: 'Ramu', driverPhone: '9988776655', capacity: 7, fuelType: 'Diesel', status: 'AVAILABLE' },
  { vehicleName: 'Force Traveller', vehicleType: 'Van', vehicleNumber: 'TN66CD4567', driverName: 'Somu', driverPhone: '9988776656', capacity: 12, fuelType: 'Diesel', status: 'AVAILABLE' },
  { vehicleName: 'Tempo Traveller 17 Seater', vehicleType: 'Minibus', vehicleNumber: 'KL07XY8899', driverName: 'Raju', driverPhone: '9988776657', capacity: 17, fuelType: 'Diesel', status: 'AVAILABLE' },
  { vehicleName: 'Ashok Leyland Bus', vehicleType: 'Bus', vehicleNumber: 'KA01AB9876', driverName: 'Mani', driverPhone: '9988776658', capacity: 40, fuelType: 'Diesel', status: 'AVAILABLE' },
  { vehicleName: 'Mahindra Scorpio', vehicleType: 'SUV', vehicleNumber: 'MH12CD3456', driverName: 'Karan', driverPhone: '9988776659', capacity: 7, fuelType: 'Diesel', status: 'AVAILABLE' },
  { vehicleName: 'Maruti Suzuki Ertiga', vehicleType: 'MUV', vehicleNumber: 'GJ01EF7890', driverName: 'Vijay', driverPhone: '9988776660', capacity: 6, fuelType: 'Petrol', status: 'AVAILABLE' },
  { vehicleName: 'Honda City', vehicleType: 'Sedan', vehicleNumber: 'DL04GH1234', driverName: 'Sunil', driverPhone: '9988776661', capacity: 4, fuelType: 'Petrol', status: 'AVAILABLE' },
  { vehicleName: 'Hyundai Verna', vehicleType: 'Sedan', vehicleNumber: 'UP32IJ5678', driverName: 'Amit', driverPhone: '9988776662', capacity: 4, fuelType: 'Petrol', status: 'AVAILABLE' },
  { vehicleName: 'Tata Safari', vehicleType: 'SUV', vehicleNumber: 'RJ14KL9012', driverName: 'Raj', driverPhone: '9988776663', capacity: 7, fuelType: 'Diesel', status: 'AVAILABLE' },
  { vehicleName: 'Kia Carnival', vehicleType: 'MUV', vehicleNumber: 'TS09MN3456', driverName: 'Srinu', driverPhone: '9988776664', capacity: 8, fuelType: 'Diesel', status: 'AVAILABLE' },
  { vehicleName: 'Volvo B11R', vehicleType: 'Bus', vehicleNumber: 'PB01OP7890', driverName: 'Singh', driverPhone: '9988776665', capacity: 45, fuelType: 'Diesel', status: 'AVAILABLE' },
  { vehicleName: 'Scania Metrolink', vehicleType: 'Bus', vehicleNumber: 'HR26QR1234', driverName: 'Jat', driverPhone: '9988776666', capacity: 41, fuelType: 'Diesel', status: 'AVAILABLE' },
  { vehicleName: 'Mercedes-Benz Sprinter', vehicleType: 'Van', vehicleNumber: 'WB02ST5678', driverName: 'Das', driverPhone: '9988776667', capacity: 15, fuelType: 'Diesel', status: 'AVAILABLE' },
  { vehicleName: 'Chevrolet Tavera', vehicleType: 'MUV', vehicleNumber: 'MP04UV9012', driverName: 'Sharma', driverPhone: '9988776668', capacity: 9, fuelType: 'Diesel', status: 'AVAILABLE' },
  { vehicleName: 'Ford Endeavour', vehicleType: 'SUV', vehicleNumber: 'CG04WX3456', driverName: 'Verma', driverPhone: '9988776669', capacity: 7, fuelType: 'Diesel', status: 'AVAILABLE' },
  { vehicleName: 'Renault Duster', vehicleType: 'SUV', vehicleNumber: 'BR01YZ7890', driverName: 'Yadav', driverPhone: '9988776670', capacity: 5, fuelType: 'Petrol', status: 'AVAILABLE' },
  { vehicleName: 'Nissan Sunny', vehicleType: 'Sedan', vehicleNumber: 'JH01AB1234', driverName: 'Munda', driverPhone: '9988776671', capacity: 4, fuelType: 'Petrol', status: 'AVAILABLE' },
  { vehicleName: 'Volkswagen Vento', vehicleType: 'Sedan', vehicleNumber: 'OR02CD5678', driverName: 'Patra', driverPhone: '9988776672', capacity: 4, fuelType: 'Petrol', status: 'AVAILABLE' },
  { vehicleName: 'Skoda Rapid', vehicleType: 'Sedan', vehicleNumber: 'AS01EF9012', driverName: 'Bora', driverPhone: '9988776673', capacity: 4, fuelType: 'Petrol', status: 'AVAILABLE' },
  { vehicleName: 'MG Hector', vehicleType: 'SUV', vehicleNumber: 'UK07GH3456', driverName: 'Bhatt', driverPhone: '9988776674', capacity: 5, fuelType: 'Petrol', status: 'AVAILABLE' }
];

const hotelsData = [
  { hotelName: 'The Fern Munnar', city: 'Munnar', destination: 'Kerala', starRating: 4, roomType: 'Deluxe', availableRooms: 10, phone: '04865230000', email: 'info@fernmunnar.com', address: 'Munnar, Kerala', status: 'AVAILABLE' },
  { hotelName: 'Sterling Ooty', city: 'Ooty', destination: 'Tamil Nadu', starRating: 4, roomType: 'Standard', availableRooms: 15, phone: '04232442000', email: 'info@sterlingooty.com', address: 'Ooty, Tamil Nadu', status: 'AVAILABLE' },
  { hotelName: 'Club Mahindra Kodaikanal', city: 'Kodaikanal', destination: 'Tamil Nadu', starRating: 5, roomType: 'Suite', availableRooms: 5, phone: '04542240000', email: 'info@clubmahindrakodai.com', address: 'Kodaikanal, Tamil Nadu', status: 'AVAILABLE' },
  { hotelName: 'Le Meridien Kochi', city: 'Kochi', destination: 'Kerala', starRating: 5, roomType: 'Premium', availableRooms: 20, phone: '04842705777', email: 'info@lemeridienkochi.com', address: 'Kochi, Kerala', status: 'AVAILABLE' },
  { hotelName: 'Taj Kumarakom Resort', city: 'Kumarakom', destination: 'Kerala', starRating: 5, roomType: 'Villa', availableRooms: 8, phone: '04812525711', email: 'info@tajkumarakom.com', address: 'Kumarakom, Kerala', status: 'AVAILABLE' },
  { hotelName: 'Radisson Blu Goa', city: 'Cavelossim', destination: 'Goa', starRating: 5, roomType: 'Deluxe', availableRooms: 12, phone: '08326727272', email: 'info@radissongoa.com', address: 'Cavelossim, Goa', status: 'AVAILABLE' },
  { hotelName: 'Novotel Dubai', city: 'Dubai', destination: 'UAE', starRating: 4, roomType: 'Executive', availableRooms: 25, phone: '+97143320000', email: 'info@novoteldubai.com', address: 'Dubai, UAE', status: 'AVAILABLE' },
  { hotelName: 'Marina Bay Sands Singapore', city: 'Singapore', destination: 'Singapore', starRating: 5, roomType: 'Suite', availableRooms: 50, phone: '+6566888868', email: 'info@marinabaysands.com', address: 'Singapore', status: 'AVAILABLE' },
  { hotelName: 'Hilton Paris Opera', city: 'Paris', destination: 'France', starRating: 4, roomType: 'Standard', availableRooms: 30, phone: '+33140084444', email: 'info@hiltonparis.com', address: 'Paris, France', status: 'AVAILABLE' },
  { hotelName: 'ITC Grand Chola', city: 'Chennai', destination: 'Tamil Nadu', starRating: 5, roomType: 'Luxury', availableRooms: 40, phone: '04422200000', email: 'info@itcgrandchola.com', address: 'Chennai, Tamil Nadu', status: 'AVAILABLE' },
  { hotelName: 'The Oberoi', city: 'Mumbai', destination: 'Maharashtra', starRating: 5, roomType: 'Suite', availableRooms: 15, phone: '02266325757', email: 'info@oberoimumbai.com', address: 'Mumbai, Maharashtra', status: 'AVAILABLE' },
  { hotelName: 'The Leela Palace', city: 'New Delhi', destination: 'Delhi', starRating: 5, roomType: 'Royal', availableRooms: 10, phone: '01139331234', email: 'info@leeladelhi.com', address: 'New Delhi, Delhi', status: 'AVAILABLE' },
  { hotelName: 'Rambagh Palace', city: 'Jaipur', destination: 'Rajasthan', starRating: 5, roomType: 'Heritage', availableRooms: 5, phone: '01412385700', email: 'info@rambaghpalace.com', address: 'Jaipur, Rajasthan', status: 'AVAILABLE' },
  { hotelName: 'Umaid Bhawan Palace', city: 'Jodhpur', destination: 'Rajasthan', starRating: 5, roomType: 'Palace', availableRooms: 4, phone: '02912510101', email: 'info@umaidbhawan.com', address: 'Jodhpur, Rajasthan', status: 'AVAILABLE' },
  { hotelName: 'JW Marriott', city: 'Pune', destination: 'Maharashtra', starRating: 5, roomType: 'Deluxe', availableRooms: 22, phone: '02066833333', email: 'info@jwmarriottpune.com', address: 'Pune, Maharashtra', status: 'AVAILABLE' },
  { hotelName: 'Hyatt Regency', city: 'Kolkata', destination: 'West Bengal', starRating: 5, roomType: 'Standard', availableRooms: 18, phone: '03323351234', email: 'info@hyattkolkata.com', address: 'Kolkata, West Bengal', status: 'AVAILABLE' },
  { hotelName: 'Sheraton Grand', city: 'Bangalore', destination: 'Karnataka', starRating: 5, roomType: 'Premium', availableRooms: 20, phone: '08042521000', email: 'info@sheratonbangalore.com', address: 'Bangalore, Karnataka', status: 'AVAILABLE' },
  { hotelName: 'Vivanta by Taj', city: 'Guwahati', destination: 'Assam', starRating: 5, roomType: 'Suite', availableRooms: 8, phone: '03612777777', email: 'info@vivantaguwahati.com', address: 'Guwahati, Assam', status: 'AVAILABLE' },
  { hotelName: 'The Lalit', city: 'Chandigarh', destination: 'Chandigarh', starRating: 5, roomType: 'Deluxe', availableRooms: 12, phone: '01723007777', email: 'info@lalitchandigarh.com', address: 'Chandigarh', status: 'AVAILABLE' },
  { hotelName: 'Lemon Tree Premier', city: 'Ahmedabad', destination: 'Gujarat', starRating: 4, roomType: 'Standard', availableRooms: 25, phone: '07944232323', email: 'info@lemontreeahmedabad.com', address: 'Ahmedabad, Gujarat', status: 'AVAILABLE' },
  { hotelName: 'Courtyard by Marriott', city: 'Bhopal', destination: 'Madhya Pradesh', starRating: 4, roomType: 'Executive', availableRooms: 15, phone: '07556690000', email: 'info@courtyardbhopal.com', address: 'Bhopal, Madhya Pradesh', status: 'AVAILABLE' },
  { hotelName: 'Trident', city: 'Bhubaneswar', destination: 'Odisha', starRating: 5, roomType: 'Premium', availableRooms: 10, phone: '06742301010', email: 'info@tridentbhubaneswar.com', address: 'Bhubaneswar, Odisha', status: 'AVAILABLE' },
  { hotelName: 'Novotel', city: 'Visakhapatnam', destination: 'Andhra Pradesh', starRating: 5, roomType: 'Ocean View', availableRooms: 14, phone: '08912822222', email: 'info@novotelvizag.com', address: 'Visakhapatnam, Andhra Pradesh', status: 'AVAILABLE' },
  { hotelName: 'Fairmont', city: 'Jaipur', destination: 'Rajasthan', starRating: 5, roomType: 'Signature', availableRooms: 6, phone: '01413301515', email: 'info@fairmontjaipur.com', address: 'Jaipur, Rajasthan', status: 'AVAILABLE' },
  { hotelName: 'Pullman', city: 'New Delhi', destination: 'Delhi', starRating: 5, roomType: 'Deluxe', availableRooms: 20, phone: '01146080808', email: 'info@pullmandelhi.com', address: 'New Delhi, Delhi', status: 'AVAILABLE' }
];

async function seedData() {
  try {
    console.log('Syncing database...');
    // We use force: true for these models to drop and recreate the tables with new schema
    await Guide.sync({ force: true });
    await Vehicle.sync({ force: true });
    await Hotel.sync({ force: true });
    
    console.log('Seeding Guides...');
    await Guide.bulkCreate(guidesData);
    
    console.log('Seeding Vehicles...');
    await Vehicle.bulkCreate(vehiclesData);
    
    console.log('Seeding Hotels...');
    await Hotel.bulkCreate(hotelsData);
    
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seedData();
