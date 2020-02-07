const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

var BuyerSchema = new Schema({
  bidderNumber: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  contactName: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  logoFileName: {
    type: String
  }
},{
    collection: 'Buyer'
});

BuyerSchema.plugin(uniqueValidator);
var Buyer = mongoose.model('Buyer', BuyerSchema);
module.exports = Buyer;
