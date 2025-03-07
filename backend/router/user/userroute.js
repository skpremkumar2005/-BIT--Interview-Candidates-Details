const express=require('express');
const router=express.Router();
const User=require('../../models/user');
router.use(express.json());
//-------------------------------------------------------------------------------------------------------------
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

//-------------------------------------------------------------------------------------------------------------
router.get('/',(req,res)=>{(req,res)=>{get(req,res,User.all)}})
router.get('/:d',(req,res)=>{getid(req,res,User.all)})
router.get('/domain',(req,res)=>{(req,res)=>{get(req,res,User.Domainlist)}})
//-------------------------------------------------------------------------------------------------------------
router.get('/t&p',(req,res)=>{get(req,res,User.TP)})
router.get('/t&p/:id',(req,res)=>{getid(req,res,User.TP)})
router.get('/iqac',(req,res)=>{get(req,res,User.iqac)})
router.get('/dc',(req,res)=>{get(req,res,User.dc)})
router.get('/ps',(req,res)=>{get(req,res,User.ps)})
router.get('/sl',(req,res)=>{get(req,res,User.sp)})
router.get('/rp',(req,res)=>{get(req,res,User.rp)})
module.exports = router;