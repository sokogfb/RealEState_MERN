const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//model
const Property = require('../models/Properties');

const PropertyRouter = express.Router();

PropertyRouter.use(bodyParser.json())

//**************************    About all property     ************************************ */
PropertyRouter.route('/')
.get((req,res,next)=>{
    Property.find({})
    .then((home)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(home);
    })
    .catch(err => console.log(err));
})

.post((req,res,next)=>{
    Property.create(req.body)
    .then((home)=>{
        console.log('Home entered: ' , home);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(home);
    })
    .catch(err => console.log(err));
})

.put((req,res,next)=>{
    res.send('Not applicable');
})

.delete((req,res,next)=>{
    Property.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    })
    .catch((err) => console.log(err)); 
})


/********************************* About Specific Property  ***************************************** */

PropertyRouter.route('/:propertyId')
.get((req,res,next)=>{
    Property.findById(req.params.propertyId)
    .then((home)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(home);
    })
    .catch(err=>console.log(err));
})

.put((req,res,next)=>{
    Property.findByIdAndUpdate(req.params.propertyId , {
        $set:req.body
    },{
        new:true
    })
    .then((home)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(home);
    })
    .catch(err=>console.log(err));
})

.delete((req,res,next)=>{
    Property.findByIdAndRemove(req.params.propertyId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})


/**************************    Comments   ************************************************** */
PropertyRouter.route('/:propertyId/comments')
.get((req,res,next)=>{
    Property.findById(req.params.propertyId)
    .then((home)=>{
        if(home != null) 
        {
            res.statusCode =200;
            res.setHeader('Content-Type', 'application/json');
            res.json(home.comments);
        }
        else
        {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json('Home not found or removed by admin');
        }
    })
    .catch(err=>console.log(err));
})

.post((req,res,next)=>{
    Property.findById(req.params.propertyId)
    .then((home)=>{
        if(home!= null)
        {
            home.comments.push(req.body);
            home.save()
            .then((prope)=>{
                res.statusCode =200;
                res.setHeader('Content-Type', 'application/json');
                res.json(prope);
            })
            .catch((er)=>console.log(err));
        }
        else
        {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json('Home not found or removed by admin');
        }
    })
    
})

.delete((req, res, next) => {
    Property.findById(req.params.propertyId)
    .then((home) => {
        if (home != null) {
            for (var i = (home.comments.length -1); i >= 0; i--) {
                home.comments.id(home.comments[i]._id).remove();
            }
            home.save()
            .then((house) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(house);                
            }, (err) => console.log(err));
        }
        else {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json('Home not found or removed by admin');
        }
    })
    .catch((err) => console.log(err));    
});

/*************************  Specific Comment   ******************************* */
PropertyRouter.route('/:propertyId/comments/:commentId')
.get((req,res,next)=>{
    Property.findById(req.params.propertyId)
    .then((home)=>{
        if(home!=null && home.comments.id(req.params.commentId)!=null) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json(home.comments.id(req.params.commentId));
        }
        else if(home!= null) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json('Property not found or removed by admin');
        }
        else
        {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json('Comment not found or removed by admin');
        }
    })
})

.put((req,res,next)=>{
    Property.findById(req.params.propertyId)
    .then((home) => {
        if (home != null && home.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
                home.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                home.comments.id(req.params.commentId).comment = req.body.comment;                
            }
            home.save()
            .then((homes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(homes);                
            });
        }
        else if (home == null) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json('Home not found or removed by admin');
        }
        else {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json('Comment not found or removed by admin');         
        }
    })
    .catch((err) => console.log(err));
})

.delete((req, res, next) => {
    Property.findById(req.params.propertyId)
    .then((home) => {
        if (home != null && home.comments.id(req.params.commentId) != null) {
            home.comments.id(req.params.commentId).remove();
            home.save()
            .then((home) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(home);                
            });
        }
        else if (home == null) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json('Home not found or removed by admin');
        }
        else {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json('Comment not found or removed by admin');           
        }
    })
    .catch((err) => console.log(err));
});

//export
module.exports = PropertyRouter;