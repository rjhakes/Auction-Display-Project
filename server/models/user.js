const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
},{
    collection: 'User'
});

UserSchema.plugin(uniqueValidator);
var User = mongoose.model('User', UserSchema);
module.exports = User;
