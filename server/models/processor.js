const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

var ProcessorSchema = new Schema({
  processorName: {
    type: String,
    required: true,
    unique: true
  }
},{
    collection: 'Processor'
});

ProcessorSchema.plugin(uniqueValidator);
var Processor = mongoose.model('Processor', ProcessorSchema);
module.exports = Processor;
