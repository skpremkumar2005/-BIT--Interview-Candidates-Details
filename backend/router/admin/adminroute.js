const express=require('express');
const User=require('../../models/user');
const router=express.Router();
router.use(express.json());
//------------------------------post request-----------------------------------------------------------------
async function post(req,res,Intern){
    try {
        const {
          personal_details,
          educational_details,
          identification_documents,
          internship_details,
          skills_preferences,
          banking_details,
          emergency_contact,
          additional_info
        } = req.body;
    
        // Check for required fields
        if (!personal_details || !personal_details.email || !educational_details || !internship_details) {
          return res.status(400).json({ message: "Missing required fields." });
        }
    
        // Check if email already exists
        // const emailExists = await EmailTracker.findOne({ email: personal_details.email });
        // if (emailExists) {
        //   return res.status(400).json({ message: "Email already exists." });
        // }
    
        // Create new Intern entry
        const newIntern = new Intern({
          personal_details,
          educational_details,
          identification_documents,
          internship_details,
          skills_preferences,
          banking_details,
          emergency_contact,
          additional_info
        });
    
        // Save intern details
        await newIntern.save();
    
        // Save email to prevent duplicate registrations
        // await new EmailTracker({ email: personal_details.email }).save();
    
        console.log("Intern registration completed.");
        res.status(201).json(await Intern.find());
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred." });
      }}
//------------------------------get request------------------------------------------------------------------
async function get(req, res, user) {
    try {
     
        const u = await user.find();
        if (u.length === 0) {
            return res.json({ message: "No users found" });  
        }
        res.status(200).json(u);
    } catch (error) {
        console.log(error);
        res.status(500).send("No data available or server error");
    }
}
//-------------------------------------------------------------------------------------------------------------
async function getid(req, res, user) {
  try {
   
      const u = await user.findOne({ _id: req.params.id });
     
      if (u.length === 0) {
          return res.json({ message: "No users found" });  
      }
      res.status(200).json(u);
  } catch (error) {
      console.log(error);
      res.status(500).send("No data available or server error");
  }
}
//------------------------------------------------------------------------------------------------------------
async function put(req,res,user){
  try{
    await user.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
      res.status(200).json(await user.find());
      console.log("updated");
     
  }
  catch(error){
    res.status(400).send("same mail");
  }
}
//------------------------------------------------------------------------------------------------------------
async function delet(req,res,user){
    try{
     
        await  user.findByIdAndDelete(req.params.id);
        res.status(200).json(await user.find());
    }
    catch(error){
        res.status(400).send("same mail");
        // console.log("can not delete ",error)
    }

}
//------------------------------------------------------------------------------------------------------------
router.get('/',(req,res)=>{
    res.send("i am admin");
})
//-------------------------------------------------------------------------------------------------------------
router.get('/t&p',(req,res)=>{get(req,res,User.TP)})
router.get('/t&p/:id',(req,res)=>{getid(req,res,User.TP)})
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
router.delete('/dc/:id',(req,res)=>{delet(req,res,User.dc)
})
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