// Import necessary modules
const Restaurant = require('../model/Restaurant'); // Import your Restaurant model
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const config = require('./../config/token');
const { verifyToken1 } = require('./userController');
const {KYC}= require('../model/kyc')
const Category=require('../model/RestaurantCategory')
const Item=require('../model/RestaurantItem')
const Order= require('../model/Order')
const Razorpay = require('razorpay');


// Define the controller method for restaurant signup
exports.signup = async (req, res) => {
  try {
    const {
      email,
      password,
      confirmPassword,
      restaurantName,
      restaurantAddress,
      
    } = req.body;

    // Check if the email is already registered
    const existingUser = await Restaurant.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password before storing it/
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const restaurantImageFile = `/uploads/${req.file.filename}`

    // Create a new restaurant instance
    const newRestaurant = new Restaurant({
      email,
      password: hashedPassword, // Store the hashed password
      restaurantName,
      restaurantAddress,
      restaurantImageFile, 
     
    });

    // Save the restaurant to the database
    await newRestaurant.save();

    // Send a success response
    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to generate a JWT token
const generateToken = (restaurantId, restaurantName) => {
  return jwt.sign(
    { restaurantId, restaurantName },
    config.jwtSecret,
    { expiresIn: '1h' }
  );
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the restaurant exists
    const restaurant = await Restaurant.findOne({ email });

    if (!restaurant) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, restaurant.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Include restaurantId and isBlocked status in the response
    res.status(200).json({
      token: generateToken(restaurant._id, restaurant.restaurantName),
      restaurantId: restaurant._id,
      isBlocked: restaurant.isBlocked, // Include the isBlocked status
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const secretKey = 'secret123'
exports.verifyToken1 = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is missing.' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token is invalid or expired.' });
    }

    const { restaurantId, restaurantName } = decoded; // Assuming _id is included in the token payload

    // Send a response with the restaurant information
    res.json({ restaurantId, restaurantName });
  });
};

exports.logout = (req, res) => {
  try {
  
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Import your Restaurant model

// Assuming restaurantId is available as a parameter
exports.submitKyc = async (req, res) => {
  try {
    // Get restaurantId from request parameters
    const { restaurantId } = req.params;

    // Create a new KYC object using the data from the request body
    const newKyc = new KYC({
      restaurant: restaurantId,
      ...req.body, // This should include all the fields from the form
    });

    // Save the KYC data to the database
    await newKyc.save();

    // Respond with a success message
    res.status(201).json({ message: 'KYC submitted successfully' });
  } catch (error) {
    console.error('Error submitting KYC:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.kycStatus= async(req,res)=>{
  const { restaurantId } = req.params;

  try {
    const kycStatus = await KYC.findOne({ restaurant: restaurantId });

    if (!kycStatus) {
      return res.status(404).json({ message: 'KYC record not found for the restaurant' });
    }

    res.status(200).json({ isApproved: kycStatus.isApproved });
  } catch (error) {
    console.error('Error fetching KYC status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
},


//CATEGORY AND ITEM ADDING




exports.getCategories = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const categories = await Category.find({ restaurant: restaurantId }).populate('items');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};



exports.addCategory = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { name } = req.body; // Get the name from the request body
    const category = new Category({ name, restaurant: restaurantId });

    // Handle image upload for category
    if (req.file) {
      const imagePath = `/uploads/${req.file.filename}`;
      category.image = imagePath; // Set the image path for the category
    } else {
      // No image was uploaded for the category
      return res.status(400).json({ error: 'Category image is required' });
    }

    try {
      // Save the category with the provided data
      await category.save();
      res.json(category); // Respond with the newly created category
    } catch (error) {
      console.error('Error saving category:', error);
      return res.status(400).json({ error: 'Failed to add category' });
    }
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(400).json({ error: 'Failed to add category' });
  }
};


// Add an item to a category
exports.addItemToCategory = async (req, res) => {
  try {
    const { restaurantId, categoryId } = req.params;
    const { name, price, typeOfMeal, timeAvailable } = req.body; // Get item data from the request body

    const category = await Category.findOne({ _id: categoryId, restaurant: restaurantId });
    if (!category) {
      return res.status(404).json({ error: 'Category not found for this restaurant' });
    }

    // Handle item image upload
    if (!req.file) {
      return res.status(400).json({ error: 'Item image is required' });
    }

    const image = `/uploads/${req.file.filename}`;

    try {
      // Create a new item object with the provided data, including the image
      const newItem = new Item({
        name,
        price,
        image,
        typeOfMeal,
        timeAvailable,
        category: categoryId, // Set the category ID for the item
        restaurant: restaurantId, // Set the restaurant ID for the item
      });

      // Save the new item
      await newItem.save();

      // Add the item reference to the category
      category.items.push(newItem);

      // Save the category with the new item
      await category.save();

      res.json(newItem); // Respond with the newly created item
    } catch (error) {
      console.error('Error saving item to category:', error);
      return res.status(400).json({ error: 'Failed to add item to category' });
    }
  } catch (error) {
    console.error('Error adding item to category:', error);
    res.status(400).json({ error: 'Failed to add item to category' });
  }
};

exports.checker=async (req,res)=>{
  console.log("i am here");
}

exports.getItem= async(req,res)=>{
  console.log("i am here");
  try {
    const { restaurantId } = req.params;
    console.log("restuarant:"+restaurantId)
    const {categoryId} = req.params;
    console.log("category:"+categoryId)
   
     const items = await Item.find();
     console.log(items)
     res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllRestaurants = async (req, res) => {
  try {

    const kycData = await KYC.find({ isApproved: true });

    const restaurantIds = kycData.map((kyc) => kyc.restaurant);

    const restaurantData = await Restaurant.find({ _id: { $in: restaurantIds } });

    res.json(restaurantData);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports. getRestaurantsByCategory = async (req, res) => {
  console.log("category found  ")
  try {
    const { categoryId } = req.params;

    // Find the category with the specified ID
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find restaurants that are associated with the category
    const restaurants = await Restaurant.find({ 'categories': category._id });

    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants by category:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.deleteItem = async (req, res) => {
  try {
    const { restaurantId, categoryId, itemId } = req.body;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    // Check if the item belongs to the specified category and restaurant
    await item.remove();
    res.json({ success: true, message: 'Item deleted successfully.' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

 




