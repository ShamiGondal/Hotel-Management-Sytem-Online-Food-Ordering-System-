const cloudinary = require('cloudinary').v2;
     
cloudinary.config({ 
  cloud_name: 'IndianHouse-storage', 
  api_key: '576873454453943', 
  api_secret: 'SeT_wbJrpNLYPtglVm4nvSAGAMA' 
});

module.exports = cloudinary;