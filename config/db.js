const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI'); //get values in that json file 

const connectDB = async () => { //we will call this in our server.js
  try {
    await mongoose.connect(db, { //this gives a promis , wrap async await with try catch block
      useNewUrlParser: true, //gives a warning if you don't do this
      // useCreateIndex: true,
    //   useFindAndModify: false,
    //   useUnifiedTopology: true
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message); // err value has a property on it called method 
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;