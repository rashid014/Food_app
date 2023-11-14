const express = require('express');
const router = express.Router();



const { userSignup, userLogin, verifyToken,userImageUpdate } = require('../controllers/userController');
const { adminLoginn,getAllUsers,deleteUsers,updateUsers,getUserDetails,adminSearchUser } = require('../controllers/adminControllers');
const { uploadSingleFile } = require('../util/multer');
const {updateUserProfile,placeOrder,getOrderDetails}=require('../controllers/userController')
const {updateName,updateEmail,verifyOTP1} =require('../controllers/userController')
const {sendOTP,verifyOTP,checkDuplicate}=require("../controllers/userController")

const { searchRestaurants,searchItems} = require('../controllers/userController');
/* GET home page. */
router.post('/signup',userSignup);
router.post('/login',userLogin);
router.post('/verifyUserToken',verifyToken)
router.post('/adminLogin',adminLoginn)
router.get('/getallusers',getAllUsers)
router.delete('/deleteUser/:id',deleteUsers)
router.get('/admineditUser/:id',getUserDetails)
router.put('/updateUser/:id',updateUsers);
router.post('/updateImage/:id',uploadSingleFile,userImageUpdate)
router.get('/searchUser/:userkey',adminSearchUser)
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/verifyemail',verifyOTP1)
router.get('/api/orders/:orderId', getOrderDetails);
router.get('/search/restaurants', searchRestaurants);
router.get('/search/items', searchItems);



router.put('/update/name', updateName);
router.put('/update/email', updateEmail);
router.post('/api/placeOrder', placeOrder);


module.exports = router;
