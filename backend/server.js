const express=require('express');
const app=express();
const admin=require('./router/admin/adminroute');
const user=require('./router/user/userroute');
const db=require('./db');
db();
// const route=express.Router();
// app.use(route);
app.use(express.json())
app.get('/',(req,res)=>{
    res.send("hi bro i am prem");
})
app.put('/',(req,res)=>{
    console.log(req.body);
    res.send("u send it");
})

app.use('/admin',admin);
app.use('/user',user);


app.listen(3000,()=>{
    console.log("i am alliveee");
})