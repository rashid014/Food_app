const mongoose = require('mongoose');


mongoose.set('strictQuery', true);

function connect() {
mongoose.connect('mongodb://127.0.0.1:27017/login')
mongoose.connection.once('open',()=>{
  console.log('connection established successfully');
})
}

module.exports ={
  connect
};

