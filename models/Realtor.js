const mongoose = require('mongoose');

const RealtorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true //no 2 ppl with same email
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// module.exports = Realtor = mongoose.model('realtor', RealtorSchema)
module.exports = mongoose.model('realtor', RealtorSchema);
//this holds the schema to interact with DB for each of our routes...