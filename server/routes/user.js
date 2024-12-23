import express from "express"
import  { login, signup,checkoutSession,paymentVerfication} from '../controller/auth.js'
import { getallusers,updateprofile,getUserPlan } from "../controller/users.js";
import auth from "../middleware/auth.js"
const router=express.Router();
router.post("/signup",signup);
router.post("/login",login);
router.post("/checkout-session", checkoutSession);
router.post("/payment-verification/:userId/:plan", paymentVerfication);
router.get("/getUserPlan/:id",getUserPlan)
router.get("/getallusers",getallusers)
router.patch("/update/:id",auth,updateprofile)


export default router