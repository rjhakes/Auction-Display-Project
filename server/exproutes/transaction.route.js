const express = require('express')
const transactionRoutes = express.Router()

const Transaction = require('../models/transaction.js')

// Add a transaction
transactionRoutes.route('/add').post(function (req, res) {
    var transaction = new Transaction(req.body)
    if (transaction.saleNumber && transaction.purchaseType) {
        transaction.save()
        .then(transaction => {
        res.status(200).json({'transaction': 'transaction added successfully'})
        })
        .catch(err => {
        res.status(400).send("unable to save to database")
        })
    }
})

// Fetch all transactions
transactionRoutes.route('/').get(function (req, res) {
    Transaction.find(function (err, transactions){
    if(err){
        console.log(err);
    }
    else {
        res.json(transactions);
    }
    })
})

// Fetch latest transaction
transactionRoutes.route('/saleNumber/:saleNumber').get((req, res) => {
  var saleNum = req.params.saleNumber
  Transaction.find({ 'saleNumber' : saleNum }, (err, transaction) => {
    if (err) {
      console.log(err);
      res.json(err)
    }
    else {
        res.json(transaction);
    }
  });
});

// Fetch single transaction
transactionRoutes.route('/:id').get((req, res) => {
  var id = req.params.id;
  Transaction.findById(id, (err, transaction) =>{
      res.json(transaction);
  });
});

// Fetch single transaction by saleNumber
transactionRoutes.route('/saleNumber/:saleNumber').get((req, res) => {
  var saleNumber = req.params.saleNumber;
  Transaction.findOne({'saleNumber': saleNumber}, (err, transaction) => {
    if (err) {
      console.log(err);
      res.json(err)
    }
    else {
      res.json(transaction)
    }
  })
})


// Update transaction
transactionRoutes.route('/:id').put((req, res) => {
  Transaction.findById(req.params.id, (err, transaction) => {
    if (!transaction)
      return next(new Error('Error getting the transaction!'));
    else {
        transaction.saleNumber = req.body.saleNumber;
        transaction.bidderNumber = req.body.bidderNumber;
        transaction.purchaseAmount = req.body.purchaseAmount;
        transaction.purchaseType = req.body.purchaseType;
        transaction.processor = req.body.processor;
        transaction.save().then( transaction => {
          res.json('Transaction updated successfully');
      })
      .catch(err => {
            res.status(400).send("Error when updating the transaction");
      });
    }
  });
});

// Delete a transaction
transactionRoutes.route('/:id').delete((req, res) => {
  var id = req.params.id;
  Transaction.findByIdAndRemove(id, (err,transaction) =>{
        if(err) res.json(err);
        else res.json('Transaction successfully removed');
    });
});

 module.exports = transactionRoutes;
