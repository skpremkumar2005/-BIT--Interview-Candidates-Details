const mongoose=require('mongoose');
 const userschema=new mongoose.Schema({
    name:{type:String},
    email:{ type:String},
    password:{type:String},
    role:{type:String},
 })
 const Domain=new mongoose.Schema({
    name:{type:String},
    email:{ type:String},
    age:{type:String},
    education:{type:String},
    domain:{type:String},
 })
 const Email=new mongoose.Schema({email:{type:String}})
 const Id=new mongoose.Schema({Id:{type:String}})

 const user=mongoose.model('User',userschema);
 const TP=mongoose.model('T&P',Domain);
 const iqac=mongoose.model('iqac',Domain);
 const ps=mongoose.model('ps',Domain);
 const dc=mongoose.model('dc',Domain);
 const rp=mongoose.model('rp',Domain);
 const sp=mongoose.model('sp',Domain);
 const em=mongoose.model('Email',Email);
 const id=mongoose.model('id',Id);




 
 module.exports={user,TP,iqac,ps,dc,rp,sp,em,id};