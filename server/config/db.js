const mongoose = require('mongoose');


mongoose.set('strictQuery', true);

function connect() {
mongoose.connect('mongodb+srv://rh701164:Mrhrashid%401998@cluster0.scnprjh.mongodb.net/login')
mongoose.connection.once('open',()=>{
  console.log('connection established successfully');
})
}

module.exports ={
  connect
};

