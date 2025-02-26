const express=require('express');
const app=express();
const admin=require('./router/admin/adminroute');
const user=require('./router/user/userroute');
const db=require('./db');
const cors = require('cors');
const User =require('./models/user');
db();

app.use(cors());

// const route=express.Router();
// app.use(route);
app.use(express.json())
app.post('/',async(req,res)=>{
   try{
    // console.log(req.body);
    if(req.body.name!=null){
        const u=await User.user.findOne({name:req.body.name});
        console.log("done");
     
           if(u.length!=0&&u.password==req.body.password){
            res.json(u);
           
           }
        else{
            res.status(400).send("password wrong"); 
        }
    }
    else if(req.body.email){
        const u=await User.user.findOne({email:req.body.email});
       
        if(u.length!=0&&u.password==req.body.password){
            res.json(u);
           
           }
        else{
            res.status(400).send("password wrong"); 
        }
    } 
    else{
        res.send("No user found").status(400);
    }   

}
    catch(err){
        console.log(err);
    }
})
// app.post('/',async(req,res)=>{
//    try{
//     const {name,email,password}=req.body;
//     await new User.user({name,email,password}).save();
//     res.json(await User.user.find());
//    }catch(error){console.log('error')}
// })

app.use('/admin',admin);
app.use('/user',user);


app.listen(3000,()=>{
    console.log("i am alliveee");
})