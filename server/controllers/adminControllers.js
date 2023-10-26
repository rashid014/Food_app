const { json } = require('express');
const User=require('../model/userMode');
const jwt = require('jsonwebtoken')
const {KYC} = require('../model/kyc');

const Restaurant=require('../model/Restaurant')


// const getKycSubmissions=require('../model/kyc')
module.exports={
    adminLoginn:async(req,res)=>{
      
        try{
            let adminData=req.body
            let adminEmail="admin@gmail.com";
            let password="12345";
            if(adminEmail==adminData.email && password== adminData.password){
            //    console.log(adminData)
                res.json({status:"ok",admin:true})

            }else{
                res.json({status:"not Ok",error:"admin details invalid"})
            }

        }catch(err){
             res.json({status:"error",error:"oops catch error"})
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
      
      

    }