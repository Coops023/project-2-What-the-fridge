const multer = require('multer')
const cloudinary = require('cloudinary').v2
<<<<<<< HEAD
const { CloudinaryStorage } = require('multer-storage-cloudinary')
=======
const { CloudinaryStorage} = require('multer-storage-cloudinary')
>>>>>>> ba1af9504f9b9b41999d6bdabfaa757d2d6ba153

cloudinary.config(
  {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
  }
)

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: ['svg', 'png', 'jpg'],
    folder: 'cloudinary-test' // Folder name on the Cloudinary disk
  }
})
<<<<<<< HEAD

module.exports = multer({ storage }) // Multer will be responsible for reading the forma and store on the cloud
=======
cl
module.exports = multer({storage}) // Multer will be responsible for reading the forma and store on the cloud
>>>>>>> ba1af9504f9b9b41999d6bdabfaa757d2d6ba153
