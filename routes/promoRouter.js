const express = require("express");
const bodyParser=require("body-parser");
const promoRouter=express.Router();
const Promotions=require('../models/promotions');
const authenticate=require('../authenticate');
const cors=require('./cors');
promoRouter.use(bodyParser.json());
promoRouter.route("/")
.get(cors.cors, (req,res,next)=>{
    Promotions.find(req.query)
    .then((promotions)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotions); 
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
   Promotions.create(req.body)
   .then((promotion)=>{
        console.log("promotion created ",promotion);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion); 
   },(err)=>next(err))
   .catch((err)=>next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Promotions.remove({})
    .then((resp)=>{

        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});


promoRouter.route("/:promoId")
.get(cors.cors, (req,res,next)=>{
    Promotions.findById(req.params.promoId)
    .then((promotions)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotions); 
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Promotions.findByIdAndUpdate(req.params.promoId,{
        $set:req.body
    },{new:true})
    .then((promo)=>{
        console.log("promotion updated ",promo);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo); 
   },(err)=>next(err))
   .catch((err)=>next(err));
  })
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp)=>{

        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));

});
module.exports=promoRouter;
