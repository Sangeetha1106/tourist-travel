const express = require('express');
const uploadController = require('./upload.controller');
const authenticate = require('../../shared/middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate);

// Error handling wrapper for multer
const handleUpload = (req, res, next) => {
  const uploadMiddleware = uploadController.upload.single('file');
  uploadMiddleware(req, res, function (err) {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

router.post('/id-proof', handleUpload, uploadController.uploadIdProof);

module.exports = router;
