const express = require('express')
const displayRoutes = express.Router()
const Display = require('../models/Display')

// Fetch single display by saleNumber
displayRoutes.route('/saleNumber/:saleNumber').get((req, res) => {
    var saleNum = req.params.saleNumber;
    Display.findOne({'saleNumber': saleNum}, (err, display) => {
        if (err) {
            console.log(err);
            res.json(err)
        }
        else {
            res.json(display);
        }
    });
});

// Fetch single display by id
displayRoutes.route('/:id').get((req, res) => {
  var id = req.params.id;
  Display.findById(id, (err, display) => {
      res.json(display);
  });
});

// Fetch all displays
displayRoutes.route('/').get(function (req, res) {
  Display.find(function (err, displays){
    if(err){
        console.log(err);
    }
    else {
        res.json(displays);
    }
  })
})

// Update display
displayRoutes.route('/:id').put((req, res) => {
  Display.findById(req.params.id, (err, display) => {
    if (!display)
      return next(new Error('Error getting the display!'));
    else {
        display.saleNumber = req.body.saleNumber;
        display.previousSaleNumber = req.body.previousSaleNumber;
        display.showCurrentSale = req.body.showCurrentSale;
        display.showPreviousSale = req.body.showPreviousSale;
        display.save().then( display => {
          res.json('Display updated successfully');
      })
      .catch(err => {
            res.status(400).send("Error when updating the display");
      });
    }
  });
});

 module.exports = displayRoutes;
