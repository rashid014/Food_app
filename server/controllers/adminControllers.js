const { json } = require('express');
const User=require('../model/userMode');
const jwt = require('jsonwebtoken')
const {KYC} = require('../model/kyc');
const Order=require('../model/Order')
const Restaurant=require('../model/Restaurant')


// const getKycSubmissions=require('../model/kyc')
module.exports={
 adminLoginn : async (req, res) => {
    try {
      const adminData = req.body;
      const adminEmail = 'admin@gmail.com';
      const password = '12345';
  
      if (adminEmail === adminData.email && password === adminData.password) {
        // Generate a JWT token with user data
        const token = jwt.sign({ email: adminData.email, isAdmin: true }, 'secret123');
  
        res.json({ status: 'ok', admin: true, token });
      } else {
        res.json({ status: 'not ok', error: 'Admin details invalid' });
      }
    } catch (err) {
      console.error('Error in adminLoginn:', err);
      res.json({ status: 'error', error: 'Oops, catch error' });
    }
  },

    getAllUsers:async(req,res)=>{
        
        try{

            let users= await User.find();
            if(users){
               
                res.json({status:"ok",users:users})

            }else{
                console.log("no userrs found");
                res.json({status:"error",users:"users not found"})
            }

        }catch(err){

            res.json({status:"error",error:"Data not find"})
            console.log(err);
        }
    },


    deleteUsers:async(req,res)=>{
        try{
               
                
             
                const deletUser= await User.deleteOne({_id:req.params.id});
                console.log("delete user")
                res.json({status:"ok",message:"user deleted"})
        }catch(err){
                console.log("user not found")
                res.json({status:"error",error:"something sent wrong"})
        }
    },


    getUserDetails:async(req,res)=>{

        try{
            
            const user= await User.findOne({_id:req.params.id});
            if(!user){
                res.json({status:"error",message:"user not found"})
            }
            else{
                res.json({status:"ok",message:"user found",userData:user})
            }
        }catch(err){
                console.log("user not found with the edit id ");
                res.status(400).json({status:"error",message:"oops errror"})
        }

    },


    updateUsers:async(req,res)=>{
        try{
            const {userName,email}=req.body;
            let user=await User.findOne({email:email})
            console.log(user,"is this is the error")
            if(user){
                   
                const update=await User.findOneAndUpdate({_id:req.params.id},
                    {
                        $set:{
                            userName,
                            email
                        }
                    }
                    )
                    console.log(update,"user updated")
                res.json({status:"ok",message:"user updated",userexists:false})
            }else{

                console.log("user already regsiterd")
                res.json({status:"error",message:"user already registerd",userexists:true})
            }
        }catch(err){
            console.log("update catch errror")
            res.json({status:"error",error:"update error"})
        }
    },


    adminSearchUser:async(req,res)=>{
        const username=req.params.userkey;
        try{
            const users=await User.find({
                "$or": [
                    {
                        userName: { $regex: username }
                    },
                    {
                        email: { $regex: username }
                    }
                ]
            })
            res.json({status:"ok",message:"user found",users})

        }catch(err)
        {
            res.json({status:"error",message:"no user found"})
        }
    },

      // Controller function to approve a KYC submission

    //   createKYCSubmission : async (req, res) => {
    //     try {
            
    //       const kycSubmission = new KYC(req.body);
    //       await kycSubmission.save();
          
    //       res.status(201).json(kycSubmission);
    //     } catch (error) {
    //       res.status(500).json({ error: 'Error creating KYC submission' });
    //     }
    //   },
      
      // Get all KYC submissions
     // Fetch KYC submissions (include both approved and validated)
getKycSubmissions: async (req, res) => {
  try {
    const kycSubmissions = await KYC.find({
      $or: [{ isApproved: true }, { isKycValidated: true }],
    });
    res.json({ kycSubmissions });
  } catch (error) {
    console.error('Error fetching KYC submissions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
},

approveKYCSubmission : async (req, res) => {
  try {
    const { id } = req.params;
    // Update the KYC submission in your database to mark it as approved
    const updatedKycSubmission = await KYC.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );
    
    if (!updatedKycSubmission) {
      return res.status(404).json({ error: 'KYC submission not found' });
    }

    // Send the updated KYC submission back in the response
    res.status(200).json(updatedKycSubmission);
  } catch (error) {
    console.error('Error approving KYC submission:', error);
    res.status(500).json({ error: 'Error approving KYC submission' });
  }
},

      // Reject a KYC submission
      rejectKYCSubmission : async (req, res) => {
        try {
          const kycSubmission = await KYC.findByIdAndUpdate(
            req.params.id,
            { isApproved: false },
            { new: true }
          );
          if (!kycSubmission) {
            return res.status(404).json({ error: 'KYC submission not found' });
          }
          res.status(200).json(kycSubmission);
        } catch (error) {
          res.status(500).json({ error: 'Error rejecting KYC submission' });
        }

        
      },


       validateKYC : async (req, res) => {
        
      
        try {
          const { id } = req.params;
          // Update the KYC submission in your database to mark it as validated
          const updatedKycSubmission = await KYC.findByIdAndUpdate(
            id,
            { isValidated: true },
            { new: true }
          );
          
          if (!updatedKycSubmission) {
            return res.status(404).json({ error: 'KYC submission not found' });
          }
      
          // Send the updated KYC submission back in the response
          res.status(200).json(updatedKycSubmission);
        } catch (error) {
          console.error('Error validating KYC submission:', error);
          res.status(500).json({ error: 'Error validating KYC submission' });
        }
      
      },

      getAllRestaurants : async (req, res) => {
        try {
          const restaurants = await Restaurant.find();
          
          res.json(restaurants);
        } catch (error) {
          console.error('Error fetching restaurants:', error);
          res.status(500).json({ error: 'Failed to fetch restaurants' });
        }
      },
      
      // Toggle the block/unblock status of a restaurant
      toggleRestaurantStatus: async (req, res) => {
        try {
          const { restaurantId } = req.params;
          const { isBlocked } = req.body;
      
          // Find the restaurant management record by _id (assuming _id is the restaurantId)
          const restaurantManagement = await Restaurant.findById(restaurantId);
      
          if (!restaurantManagement) {
            return res.status(404).json({ error: 'Restaurant management record not found' });
          }
      
          // Toggle the isBlocked status
          restaurantManagement.isBlocked = isBlocked;
          await restaurantManagement.save();
      
          res.json({ message: 'Restaurant status updated successfully' });
        } catch (error) {
          console.error('Error toggling restaurant status:', error);
          res.status(500).json({ error: 'Failed to toggle restaurant status' });
        }
      },
      
      getFilteredOrders : async (req, res) => {
        try {
          // Query the database to find orders with a status not equal to 'Pending'
          const orders = await Order.find({ status: { $ne: 'Pending' } });
      
          // Return the filtered orders as a JSON response
          res.json({ orders });
        } catch (error) {
          // Handle any errors and send an error response
          console.error('Error fetching orders:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      },
      


      confirmOrder: async (req, res) => {
        const orderId = req.body.orderId;
      
        try {
          // Fetch the order from the database by its orderId
          const order = await Order.findById(orderId);
      
          if (!order) {
            return res.status(404).json({ message: 'Order not found' });
          }
      
          // Check if paymentStatus is 'paid', and if so, update partnerPayment and restaurantPayment
          if (order.paymentStatus === 'paid') {
            // Update partnerPayment and restaurantPayment fields
            await Order.findOneAndUpdate({ _id: orderId }, { partnerPayment: 'Payment Approved' });
            await Order.findOneAndUpdate({ _id: orderId }, { restaurantPayment: 'Payment Approved' });
          }
         
      
          // Save the updated order to the database
          await order.save();
      
          res.status(200).json({
            message: `Order ${orderId} confirmed successfully with status: Confirmed`,
            partnerPayment: 'Payment Approved', // Update the response accordingly
            restaurantPayment: 'Payment Approved', // Update the response accordingly
          });
        } catch (error) {
          console.error(`Error confirming order ${orderId}:`, error);
          res.status(500).json({ error: `Error confirming order ${orderId}.` });
        }
      },
      
      

// Reject an order and update payment status
rejectOrder :async (req, res) => {
  const orderId = req.body.orderId;
      
  try {
    // Fetch the order from the database by its orderId
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Get the paymentStatus from the order
    const paymentStatus = order.paymentStatus;

    // Determine partnerPayment and restaurantPayment based on paymentStatus
    const partnerPayment=order.partnerPayment;
    const restaurantPayment=order.restaurantPayment;
      partnerPayment = 'Payment Not Approved';
      restaurantPayment = 'Payment Not Approved';
    

    // Update the order's partnerPayment and restaurantPayment fields
    order.partnerPayment = partnerPayment;
    order.restaurantPayment = restaurantPayment;

    // Save the updated order to the database
    await order.save();

    res.status(200).json({
      message: `Order ${orderId} confirmed successfully with status: ${paymentStatus}`,
      partnerPayment,
      restaurantPayment,
    });
  } catch (error) {
    console.error(`Error confirming order ${orderId}:`, error);
    res.status(500).json({ error: `Error confirming order ${orderId}.` });
  }
},

    }