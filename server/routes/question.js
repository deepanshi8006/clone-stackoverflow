import express from "express"
import { Askquestion,getallquestion,deletequestion,votequestion,generateotp,verifyotp,uploadvideo } from "../controller/Question.js"
import auth from "../middleware/auth.js"
import multer from 'multer'
import { uploadVideoMiddleware } from '../middleware/uploadMiddleware.js';

const router=express.Router();

router.post('/generate-otp', generateotp);
router.post('/verify-otp',verifyotp);
router.post('/upload-video', uploadVideoMiddleware, uploadvideo);
// router.post('/upload-video', upload.single('video'), uploadvideo);
router.post('/Ask', auth, uploadVideoMiddleware, (req, res, next) => {
  next();
}, Askquestion);

// router.post('/Ask',auth,(req, res, next) => {
//     console.log('Reached /questions/Ask route');
//     next();
//   },Askquestion);
router.get('/get',getallquestion);
router.delete("/delete/:id",auth,deletequestion);
router.patch("/vote/:id",auth,votequestion)


export default router;