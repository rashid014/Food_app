const Item=require('../model/RestaurantItem')
const User=require('../model/userMode')
const jwt = require('jsonwebtoken');
const user=require('../model/userMode')
const Order=require('../model/Order')





exports.getAllCartItems = async (req, res) => {
  try {
    const token = req.headers.authorization; // Extract the token from the Authorization header

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decodedToken = jwt.verify(token, 'secret123');
    const userId = decodedToken.id;

    const user = await User.findById(userId).populate('cart.itemId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract the cart items with restaurant information
    const cartItems = user.cart.map(async (cartItem) => {
      const item = cartItem.itemId;

      // Fetch the restaurant information using the item model
      const restaurantItem = await Item.findById(item._id).populate('restaurant');
      
      return {
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: cartItem.quantity,
        image: item.image,
        restaurantId: restaurantItem.restaurant._id,
        restaurantName: restaurantItem.restaurant.restaurantName,
      };
    });

    // Wait for all the cart items to be processed and then send the response
    Promise.all(cartItems).then((items) => {
      res.json({ cartItems: items });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};





exports.addToCart = async (req, res) => {
  const { itemId } = req.body;

  try {
    const token = req.headers.authorization; // Extract the token from the Authorization header

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify and decode the token to get the user's information
    const decodedToken = jwt.verify(token, 'secret123');
    const userId = decodedToken.id;

    // Check if the item exists
    const itemToAdd = await Item.findById(itemId);

    if (!itemToAdd) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Fetch the user's cart
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the item is already in the user's cart
    const existingCartItem = user.cart.find((cartItem) => cartItem.itemId.toString() === itemId.toString());

    if (existingCartItem) {
      // If it's in the cart, you can update the quantity or take other actions as needed
      existingCartItem.quantity += 1;
    } else {
      // If it's not in the cart, create a new cart item

      // Check if the cart contains items from the same restaurant
      if (user.cart.length > 0) {
        const firstCartItem = user.cart[0];
        const firstItem = await Item.findById(firstCartItem.itemId);
        if (firstItem.restaurant && firstItem.restaurant.toString() !== itemToAdd.restaurant.toString()) {
          return res.status(400).json({ message: 'Discard items from the previous restaurant before adding new items.' });
        }
      }

      user.cart.push({
        itemId,
        quantity: 1,
        restaurantId: itemToAdd.restaurant, // Include restaurantId from the item in the cart item
      });
    }

    await user.save();

    // Fetch the updated cart items and send them in the response
    const updatedCartItems = user.cart;

    res.json({ message: 'Item added to cart', updatedCart: updatedCartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.removeFromCart = async (req, res) => {
  const { itemId } = req.body;

  try {
    const token = req.headers.authorization; // Extract the token from the Authorization header

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify and decode the token to get the user's information
    const decodedToken = jwt.verify(token, 'secret123');
    const userId = decodedToken.id;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });``
    }

    // Find the cart item to decrement its quantity
    const cartItemIndex = user.cart.findIndex((cartItem) => cartItem.itemId.toString() === itemId);

    if (cartItemIndex == -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    const cartItem = user.cart[cartItemIndex];

    // If the cart item is found and the quantity is greater than 1, decrement its quantity by 1
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
    } else {
      // If the quantity is 1, remove the item from the cart
      user.cart.splice(cartItemIndex, 1);
    }

    await user.save();

    res.json({ message: 'Item quantity decremented in cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




exports.removeItem = async (req, res) => {
  const { itemId } = req.body;

  try {
    const token = req.headers.authorization; // Extract the token from the Authorization header

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify and decode the token to get the user's information
    const decodedToken = jwt.verify(token, 'secret123');
    const userId = decodedToken.id;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the cart item to remove it
    const cartItemIndex = user.cart.findIndex((cartItem) => cartItem.itemId.toString() === itemId);

    if (cartItemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Remove the item from the cart
    user.cart.splice(cartItemIndex, 1);

    await user.save();

    res.json({ message: 'Item removed from cart', updatedCart: user.cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.updateCartItemQuantity = async (req, res) => {
  const { itemId, quantity } = req.body;
  const token = req.headers.authorization;
  
  try {
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify and decode the JWT token
    const decodedToken = jwt.verify(token, 'secret123');

    // Find the user by ID
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the cart item in the user's cart
    const cartItem = user.cart.find((item) => item.itemId.toString() === itemId);
    if (!cartItem) {
      return res.status(404).json({ error: 'Item not found in the cart.' });
    }

    // Update the item's quantity
    cartItem.quantity = quantity;

    // Save the user document to update the cart in the database
    await user.save();

    // Calculate the updated cart total (if needed)
    const updatedCartTotal = user.cart.reduce((total, item) => total + item.quantity, 0);

    // Respond with the updated cart data
    res.json({
      updatedCart: user.cart,
      updatedTotal: updatedCartTotal,
    });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
exports.getOrderDetails = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate('user')// Populate relevant fields as needed
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Cancel an order by order ID
exports.cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    console.log('Order ID from params:', orderId);
    const order = await Order.findById(orderId);
    console.log('Order ID from params:', JSON.stringify(order));
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Set isPresent to false
    order.isPresent = false;
    
    // Save the updated order
    await order.save();

    res.json({ message: 'Order canceled successfully' });
  } catch (error) {
    console.error('Error canceling order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.removeEntireItems = async (req, res) => {
  try {
    const token = req.headers.authorization; // Extract the token from the Authorization header

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify and decode the token to get the user's information
    const decodedToken = jwt.verify(token, 'secret123');
    const userId = decodedToken.id;

    // Use Mongoose to remove all cart items for the user
    await User.updateOne({ _id: userId }, { $set: { cart: [] }});

    // Fetch the updated user data
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'All items removed from cart', updatedCart: user.cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



