const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

var TransactionSchema = new Schema({
  saleNumber: {
    type: Number,
    required: true
  },
  bidderNumber: {
    type: String,
    required: true
  },
  purchaseAmount: {
    type: Number,
    required: true
  },
  purchaseType: {
    type: String,
    required: true
  }
},{
    collection: 'Transaction'
});

TransactionSchema.plugin(uniqueValidator);
var Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;
