const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    // Determine the folder based on the route
    if (req.originalUrl.includes('users')) uploadPath += 'users/';
    else if (req.originalUrl.includes('destinations')) uploadPath += 'destinations/';
    else if (req.originalUrl.includes('packages')) uploadPath += 'packages/';
    else if (req.originalUrl.includes('reviews')) uploadPath += 'reviews/';
    else if (req.originalUrl.includes('guide/photos')) uploadPath += 'trips/';
    else uploadPath += 'misc/';

    // Create directory if it doesn't exist
    const fullPath = path.join(__dirname, '../../../', uploadPath);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Check file type
const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|pdf/; // Added pdf for other id proofs if any
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Invalid file type!');
  }
};

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB max
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
});

module.exports = upload;
