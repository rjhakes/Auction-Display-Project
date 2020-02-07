const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

var ExhibitorSchema = new Schema({
  saleNumber: {
    type: Number,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  tag: {
    type: String,
  },
  species: {
    type: String,
    required: true
  },
  checkInWeight: {
    type: Number,
    required: true
  },
  animalDescription: {
    type: String
  },
  clubName: {
    type: String
  },
  showClassName: {
    type: String
  },
  placing: {
    type: String
  },
  buyback: {
    type: Number
  }
},{
    collection: 'Exhibitor'
});

ExhibitorSchema.plugin(uniqueValidator);
var Exhibitor = mongoose.model('Exhibitor', ExhibitorSchema);
module.exports = Exhibitor;
