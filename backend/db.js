const mongoose=require('mongoose');
const connection=async()=>{
 try{
    await mongoose.connect('mongodb://localhost:27017/mydatabase');
    console.log("db connected");
   
 }
 catch(error){
    console.log(error);
    process.exit();

 }


}
module.exports=connection; 