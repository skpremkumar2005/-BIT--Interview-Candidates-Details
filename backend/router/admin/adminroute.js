const express=require('express');
const User=require('../../models/user');
const router=express.Router();
router.use(express.json());
//------------------------------post request-----------------------------------------------------------------
async function post(req,res,users){
    try{const {name,email,age,education,domain}=req.body;
    const a= await User.em.find({email:email})
    if(a.length!=0)return res.send("email duplicate");
    if (!name || !email || !age || !education || !domain) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
     const u=new users({name,email,age,education,domain})
     await  u.save();
     await new User.em({email}).save();
    console.log("finished");
    res.send("finished");
  }

  catch(error){console.log(error)}
}
//------------------------------get request------------------------------------------------------------------
async function get(req, res, user) {
    try {
     
        const u = await user.find();
        if (u.length === 0) {
            return res.json({ message: "No users found" });  
        }
        res.json(u);
    } catch (error) {
        console.log(error);
        res.status(500).send("No data available or server error");
    }
}

//------------------------------------------------------------------------------------------------------------
async function put(req,res,user){
  try{
    const a= req.body.email;
    const b= await user.find({ _id: req.params.id }).select('email -_id');
    console.log(a,b[0].email);
    if(a!=b[0].email){
        const c=await User.em.find({email:a});
        // console.log(c);
        if(c.length!=0)return res.send("duplicate email");
        else{
             await new User.em({ email: a }).save();
             const e = await User.em.findOne({ email: b[0].email }); 
             console.log(e);
             
             if (e) {
               await User.em.findByIdAndDelete(e._id); 
             }
    }

    }
    await user.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
      res.status(200).send("updated");
      console.log("updated");
  }
  catch(error){
    console.log(error);
  }
}
//------------------------------------------------------------------------------------------------------------
async function delet(req,res,user){
    try{
        const email=req.body.email;
        await  user.findByIdAndDelete(req.params.id);
        const e=await User.em.findOne({email:email});
        await User.em.findByIdAndDelete(e._id);
        res.send("successfull");
    }
    catch(error){
        console.log("can not delete ",error)
    }

}
//------------------------------------------------------------------------------------------------------------
router.get('/',(req,res)=>{
    res.send("i am admin");
})
//-------------------------------------------------------------------------------------------------------------
router.get('/t&p',(req,res)=>{get(req,res,User.TP)})
router.put('/t&p/:id',(req,res)=>{put(req,res,User.TP)})
router.post('/t&p', (req,res)=>{post(req,res,User.TP)});
router.delete('/t&p/:id',(req,res)=>{delet(req,res,User.TP)})
//-------------------------------------------------------------------------------------------------------------
router.get('/iqac',(req,res)=>{get(req,res,User.iqac)})
router.put('/iqac/:id',(req,res)=>{put(req,res,User.iqac)})
router.post('/iqac',(req,res)=>{post(req,res,User.iqac)});
router.delete('/iqac/:id',(req,res)=>{delet(req,res,User.iqac)})
//--------------------------------------------------------------------------------------------------------------
router.get('/dc',(req,res)=>{get(req,res,User.dc)})
router.put('/dc/:id',(req,res)=>{put(req,res,User.dc)})
router.post('/dc',(req,res)=>{post(req,res,User.dc)});
router.delete('/dc/:id',(req,res)=>{delet(req,res,User.dc)})
//--------------------------------------------------------------------------------------------------------------
router.get('/ps',(req,res)=>{get(req,res,User.ps)})
router.put('/ps/:id',(req,res)=>{put(req,res,User.ps)})
router.post('/ps',(req,res)=>{post(req,res,User.ps)});
router.delete('/ps/:id',(req,res)=>{delet(req,res,User.ps)})
//--------------------------------------------------------------------------------------------------------------
router.get('/sl',(req,res)=>{get(req,res,User.sp)})
router.put('/sl/:id',(req,res)=>{put(req,res,User.sp)})
router.post('/sl',(req,res)=>{post(req,res,User.sp)});
router.delete('/sl/:id',(req,res)=>{delet(req,res,User.sp)})
//--------------------------------------------------------------------------------------------------------------
router.get('/rp',(req,res)=>{get(req,res,User.rp)})
router.put('/rp/:id',(req,res)=>{put(req,res,User.rp)})
router.post('/rp',(req,res)=>{post(req,res,User.rp)});
router.delete('/rp/:id',(req,res)=>{delet(req,res,User.rp)})
//---------------------------------------------------------------------------------------------------------------

module.exports = router;