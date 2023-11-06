const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController')
const multer=require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
  }
});

const upload = multer({ storage: storage });

// Use multer middleware in your route handler
router.post('/partnersignup', upload.single('idProofJpg'), partnerController.signup);
router.get('/admin/submissions', partnerController.listSubmissions);

router.post('/admin/approve/:submissionId', partnerController.approveSubmission);

router.post('/admin/reject/:submissionId', partnerController.rejectSubmission);

router.post('/partnerlogin', partnerController.login);

router.get('/partnerorders', partnerController.getAllOrders);

router.post('/restaurant/partneraccept', partnerController.assignDeliveryPartner);

router.post('/restaurant/pickuporder', partnerController.pickUpOrder);

router.post('/restaurant/deliverorder', partnerController.markOrderAsDelivered);


router.post('/restaurant/notdeliverorder', partnerController.markOrderAsNotDelivered);

router.get('/partnerpayment', partnerController.getPartnerOrders);

module.exports=router;