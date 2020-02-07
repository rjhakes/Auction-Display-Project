const express = require('express')
const buyerRoutes = express.Router()

const Buyer = require('../models/buyer.js')

// Add a buyer
buyerRoutes.route('/add').post(function (req, res) {
    var buyer = new Buyer(req.body)
    if (buyer.bidderNumber && buyer.name) {
        buyer.save()
        .then(buyer => {
        res.status(200).json({'buyer': 'buyer added successfully'})
        })
        .catch(err => {
        res.status(400).send("unable to save to database")
        })
    }
})

// Fetch all buyers
buyerRoutes.route('/').get(function (req, res) {
    Buyer.find(function (err, buyers){
    if(err){
        console.log(err);
    }
    else {
        res.json(buyers);
    }
    })
})

// Fetch single buyer
buyerRoutes.route('/:id').get((req, res) => {
  var id = req.params.id;
  Buyer.findById(id, (err, buyer) =>{
      res.json(buyer);
  });
});

// Fetch single buyer by bidderNumber
buyerRoutes.route('/bidderNumber/:bidderNumber').get((req, res) => {
    var bidderNum = req.params.bidderNumber;
    Buyer.findOne({'bidderNumber': bidderNum}, (err, buyer) => {
        if (err) {
            console.log(err);
            res.json(err)
        }
        else {
            res.json(buyer);
        }
    });
});

// Update buyer
buyerRoutes.route('/:id').put((req, res) => {
  Buyer.findById(req.params.id, (err, buyer) => {
    if (!buyer)
      return next(new Error('Error getting the buyer!'));
    else {
      buyer.bidderNumber = req.body.bidderNumber;
      buyer.name = req.body.name;
      buyer.contactName = req.body.contactName;
      buyer.phone = req.body.phone;
      buyer.email = req.body.email;
      buyer.logoFileName = req.body.logoFileName;
      buyer.save().then( buyer => {
          res.json('Buyer updated successfully');
      })
      .catch(err => {
            res.status(400).send("Error when updating the buyer");
      });
    }
  });
});

// Delete a buyer
buyerRoutes.route('/:id').delete((req, res) => {
  var id = req.params.id;
  Buyer.findByIdAndRemove(id, (err,buyer) =>{
        if(err) res.json(err);
        else res.json('Buyer successfully removed');
    });
});

 module.exports = buyerRoutes;
