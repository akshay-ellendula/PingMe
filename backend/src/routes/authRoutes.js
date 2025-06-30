import express from 'express';
import { signup, signin, logout, onBoarding } from "../controllers/authControllers.js";
import { protectRoute } from "../middleware/authMiddleware.js"
const route = express.Router();

route.post('/signup', signup);
route.post('/signin', signin);
route.post('/logout', logout);
route.post('/onBoarding', protectRoute, onBoarding);

route.get('/me',protectRoute,(req,res)=>{
    res.status(200).json({success :true , user : req.user})
})

export default route;