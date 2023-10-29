
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const cors=require('cors')
const mongoose=require('mongoose');
const jwt = require('jsonwebtoken')
const db =require('./config/db')
const restaurantRoutes = require('./routes/restaurantRoutes');
const cartRoutes=require('./routes/cartRoutes')
const partnerRoutes=require('./routes/partnerRoutes')
const forgotPassword=require('./routes/forgotPassword')
const orderRoutes=require("./routes/orderRoutes")


var app = express();
port=4000

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));


const userRouter = require('./routes/users');
app.use('/api', restaurantRoutes);


app.use('/uploads', express.static('uploads'));

app.use('/api',cartRoutes)
app.use('/', userRouter);
app.use('/api',partnerRoutes)
app.use('/api',forgotPassword)
app.use('/api',orderRoutes)

async function startApp() {
    try {
  
    db.connect()
      app.listen(port, () => {
        console.log(`Server is up and running at ${port}`);
      });
     
  
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
      process.exit(1);
    }
  }
  
  startApp()

module.exports = app;
