import express from "express"
import { Askquestion,getallquestion,deletequestion,votequestion,generateotp,verifyotp,uploadvideo } from "../controller/Question.js"
import auth from "../middleware/auth.js"
import multer from 'multer'

const router=express.Router();

const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 }, dest: 'uploads/' });


router.post('/generate-otp', generateotp);
router.post('/verify-otp',verifyotp);

router.post('/upload-video', upload.single('video'), uploadvideo);

router.post('/Ask',auth,(req, res, next) => {
    console.log('Reached /questions/Ask route');
    next();
  },Askquestion);
router.get('/get',getallquestion);
router.delete("/delete/:id",auth,deletequestion);
router.patch("/vote/:id",auth,votequestion)


export default router;