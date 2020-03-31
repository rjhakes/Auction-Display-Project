const express = require('express')
const processorRoutes = express.Router()

const Processor = require('../models/processor.js')

// Add a processor
processorRoutes.route('/add').post(function (req, res) {
    var processor = new Processor(req.body)
    if (processor.processorName) {
        processor.save()
        .then(processor => {
        res.status(200).json({'processor': 'processor added successfully'})
        })
        .catch(err => {
        res.status(400).send("unable to save to database")
        })
    }
})

// Fetch all processors
processorRoutes.route('/').get(function (req, res) {
    Processor.find(function (err, processors){
    if(err){
        console.log(err);
    }
    else {
        res.json(processors);
    }
    })
})

// Fetch single processor
processorRoutes.route('/:id').get((req, res) => {
  var id = req.params.id;
  Processor.findById(id, (err, processor) =>{
      res.json(processor);
  });
});

// Fetch single processor by name
processorRoutes.route('/processorName/:processorName').get((req, res) => {
    var processorN = req.params.processorName;
    Processor.findOne({'processorName': processorN}, (err, processor) => {
        if (err) {
            console.log(err);
            res.json(err)
        }
        else {
            res.json(processor);
        }
    });
});

// Update processor
processorRoutes.route('/:id').put((req, res) => {
  Processor.findById(req.params.id, (err, processor) => {
    if (!processor)
      return next(new Error('Error getting the processor!'));
    else {
      processor.processorName = req.body.processorName;
      processor.save().then( processor => {
          res.json('Processor updated successfully');
      })
      .catch(err => {
            res.status(400).send("Error when updating the Processor");
      });
    }
  });
});

// Delete a processor
processorRoutes.route('/:id').delete((req, res) => {
  var id = req.params.id;
  Processor.findByIdAndRemove(id, (err,processor) =>{
        if(err) res.json(err);
        else res.json('Processor successfully removed');
    });
});

 module.exports = processorRoutes;
