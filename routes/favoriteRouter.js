const express = require("express");
const bodyParser=require("body-parser");
const favoriteRouter=express.Router();
const mongoose=require('mongoose');
const Favorites=require('../models/favorite');
const authenticate=require('../authenticate');
const cors=require('./cors');
const User=require('../models/user');
favoriteRouter.use(bodyParser.json());

favoriteRouter.route("/")
.options(cors.corsWithOptions, (req,res)=>{res.sendStatus(200);})
.get(cors.cors,authenticate.verifyUser,  (req,res,next)=>{

    Favorites.findOne({user:req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorite)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(favorite); 
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
   Favorites.findOne({user:req.user._id})
   .then((favorite)=>{
       
    if(favorite!=null){
        console.log(favorite.dishes.indexOf(req.body.dishes[0].value));
        console.log(req.body.dishes[0]._id);

        for(var i=(req.body.dishes.length-1); i>=0;i--)
            {
                if(favorite.dishes.indexOf(req.body.dishes[i]._id)===-1){
                    favorite.dishes.push(req.body.dishes[i]);
                }
                else{
                    next(new Error("Dish already in favorites !"));
                }
            }
        favorite.save()
        
        .then((favorite)=>{
                favorite.populate('user','dishes')
                .then((favorite)=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorite);
                })
                .catch((err)=>next(err));
                
        })
        .catch((err)=>next(err));
      

        
    }
    else{
        
            req.body.user=req.user._id
            console.log(req.body);
            Favorites.create(req.body)
          
            .then((favorite)=>{
                favorite.populate('user','dishes')
                .then((favorite)=>{     
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(favorite);
                    })
                    .catch((err)=>next(err));
                    
                   
            })
            .catch((err)=>next(err));
                
        }
})
.catch((err)=>next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /Favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    console.log(Favorites.find({user:req.user._id}));
    Favorites.find({user:req.user._id}).remove()
    .then((resp)=>{

        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});


favoriteRouter.route("/:favoriteId")
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req,res,next)=>{
    res.statusCode = 403;
    res.end('GET operation not supported on /Favorites/:favoriteId');
})
.post(cors.corsWithOptions, authenticate.verifyUser , (req,res,next)=>{
    Favorites.findOne({user:req.user._id})
   .then((favorite)=>{
    if(favorite!=null){
       
        if(favorite.dishes.indexOf(req.params.favoriteId)===-1){
            favorite.dishes.push(req.params.favoriteId);
       

                    favorite.save()
                    .then((favorite)=>{
                        Favorites.findOne({user:req.user._id})
                            .populate('user')
                            .populate('dishes')
                            .then((favorite)=>{
                                res.statusCode=200;
                                res.setHeader('Content-Type','application/json');
                                res.json(favorite);
                            },err=>next(err));
                
                    },err=>next(err))
                    .catch((err)=>next(err));
            }
        else{
            next(new Error('Dish already in favorites !'));
        }
    }
    else{
        req.body.user=req.user._id
        req.body.dishes=req.params.favoriteId;
        console.log(req.body);
        Favorites.create(req.body)
      
        .then((favorite)=>{
            favorite.populate('user','dishes')
                .then((favorite)=>{   
                        
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorite);
                })
                .catch((err)=>next(err));
                
        })
        .catch((err)=>next(err));
             
         } 
        },(err)=>next(err))
        .catch((err)=>next(err));
     })
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/favoriteIds');
})
.delete(cors.corsWithOptions, authenticate.verifyUser , (req,res,next)=>{
    Favorites.findOne({user:req.user._id})
    .then((favorite)=>{
        console.log(favorite.dishes.indexOf(req.params.favoriteId));
        favorite.dishes.remove(req.params.favoriteId);
        //favorite.dishes.id(req.params.favoriteId).remove()
        favorite.save()
        .then((favorite)=>{
            Favorites.findOne({user:req.user._id})
            .populate('user')
            .populate('dishes')
            .then((favorite)=>{
                
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(favorite);
           
            },(err)=>next(err))
            .catch((err)=>next(err));
        },(err)=>next(err))
        .catch((err)=>next(err));
            
       
    }).catch((err)=>next(err));

    


});

module.exports=favoriteRouter;