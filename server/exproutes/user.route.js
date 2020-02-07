const express = require('express')
const userRoutes = express.Router()
const User = require('../models/user.js')

// adds a user
userRoutes.route('/add').post(function (req, res) {
    var user = new User(req.body)
    user.save()
    .then(user => {
    res.status(200).json({'user': 'user added successfully'})
    })
    .catch(err => {
    res.status(400).send("unable to save to database")
    })
})

// updates user
userRoutes.route('/:id').put((req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (!user)
      return next(new Error('Error getting the user!'));
    else {
        user.save().then( user => {
          res.json('User updated successfully');
      })
      .catch(err => {
            res.status(400).send("Error when updating the user");
      });
    }
  });
});

// gets all users
userRoutes.route('/').get(function (req, res) {
    User.find(function (err, users){
    if(err){
        console.log(err);
    }
    else {
        res.json(users);
    }
    })
})

// fetches a single user
userRoutes.route('/:id').get((req, res) => {
  var id = req.params.id;
  User.findById(id, (err, user) =>{
      res.json(user);
  });
});
 
 module.exports = userRoutes;