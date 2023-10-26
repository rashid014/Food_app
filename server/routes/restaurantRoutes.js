const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const multer = require('multer');
const adminControllers= require('../controllers/adminControllers')
const {  verifyToken1 } = require('../controllers/restaurantController');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
}); 

const upload = multer({ storage: storage });

// Handle form submission
router.post('/signup', upload.single('restaurantImageFile'),restaurantController.signup);
router.post('/restaurantlogin', restaurantController.login);
router.post('/verifytoken1',restaurantController.verifyToken1)
router.post('/submit-kyc/:restaurantId',upload.single('idProof'), restaurantController.submitKyc);
router.post('/restaurantHome/:restaurantId',restaurantController.verifyToken1);
// for categories and items 

router.get('/:restaurantId/categories', restaurantController.getCategories);
router.get('/restaurants/items',restaurantController.getItem);
router.get('/restaurants/:restaurantId', restaurantController.getAllRestaurants);

router.post('/:restaurantId/categories', upload.single('image'), restaurantController.addCategory);
router.post('/:restaurantId/categories/:categoryId/items', upload.single('image'), restaurantController.addItemToCategory);

router.post('/logout', restaurantController.logout);
router.get('/kyc-status/:restaurantId', restaurantController.kycStatus);
router.get('/getRestaurantsByCategory/:categoryId', restaurantController.getRestaurantsByCategory);
router.post('/restaurantHome/:restaurantId',restaurantController.verifyToken1);
router.delete('/:restaurantId/categories/:categoryId/items', restaurantController.deleteItem);
//admin route
// Route to approve KYC by ID

router.get('/kyc-submissions', adminControllers. getKycSubmissions);  
router.put('/approve-kyc/:id', adminControllers.approveKYCSubmission); 
router.put('/reject-kyc/:id', adminControllers.rejectKYCSubmission); 
router.put('/validate-kyc/:id', adminControllers.validateKYC);
router.get('/restaurant-management', adminControllers.getAllRestaurants);
router.put('/restaurant-management/:restaurantId', adminControllers.toggleRestaurantStatus);


//placeorder
// router.post('/checkout', restaurantController.placeOrder);

module.exports= router;