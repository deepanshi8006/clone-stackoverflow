import Question from "../models/Question.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import moment from "moment-timezone";
import ffmpeg from "fluent-ffmpeg";
import multer from 'multer';

const OTP_STORE = {};

export const generateotp = async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("Verify OTP endpoint hit");

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL, pass: process.env.PASSWORD },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        OTP_STORE[email] = { otp, createdAt: Date.now() };
        
        

        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send OTP" });
    }
};

export const verifyotp = async (req, res) => {
    const { email, otp } = req.body;
    const otpEntry = OTP_STORE[email];
   
    if (!otpEntry) {
        return res.status(400).json({ error: "OTP not found or expired" });
    }

    const isOtpValid = String(otpEntry.otp)  === String(otp) && Date.now() - otpEntry.createdAt <= 10 * 60 * 1000;

    if (isOtpValid) {
        delete OTP_STORE[email];
        res.json({ message: "OTP verified" });
    } else {
        res.status(400).json({ error: "Invalid or expired OTP" });
    }
};

export const uploadvideo = async (req, res) => {
    const videoFile = req.file; 
    console.log(req.file)
    const currentTime = moment().tz("Asia/Kolkata");
    const hour = currentTime.hour();


    if (hour < 0 || hour >= 21) {
        return res.status(403).json({ error: "Uploads allowed only between 2 PM and 7 PM" });
    }

    if (videoFile.size > 50 * 1024 * 1024) {
        return res.status(400).json({ error: "Video size exceeds 50MB" });
    }
   
    ffmpeg.ffprobe(videoFile.path, async (err, metadata) => {
        if (err) {
            console.error("ffprobe Error:", err.message);
            console.error("File Path:", normalizedPath);
            console.error("ffmpeg Path:", ffmpeg.getFfmpegPath());
            return res.status(500).json({ error: "Video processing failed" });
        }
    
        console.log("Video Metadata:", metadata);

        if (metadata.format.duration > 120) {
            return res.status(400).json({ error: "Video length exceeds 2 minutes" });
        }

        res.json({ message: "Video uploaded successfully", file: videoFile.filename });
    });
};


export const Askquestion = async (req, res) => {
    const postquestiondata = req.body;
    const userid = req.userid;
    const postquestion = new Question({ ...postquestiondata, userid })
    try {
        await postquestion.save();
        res.status(200).json("Posted a question successfully");
    } catch (error) {
        console.log(error)
        res.status(404).json("couldn't post a new question");
        return
    }
};

export const getallquestion = async (req, res) => {
    try {
        const questionlist = await Question.find().sort({ askedon: -1 });
        res.status(200).json(questionlist)
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: error.message });
        return
    }
};

export const deletequestion = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("question unavailable...");
    }
    try {
        await Question.findByIdAndDelete(_id);
        res.status(200).json({ message: "successfully deletd..." })
    } catch (error) {
        res.status(404).json({ message: error.message });
        return
    }
};

export const votequestion = async (req, res) => {
    const { id: _id } = req.params;
    const { value } = req.body;
    const userid = req.userid;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("question unavailable...");
    }
    try {
        const question = await Question.findById(_id);
        const upindex = question.upvote.findIndex((id) => id === String(userid))
        const downindex = question.downvote.findIndex((id) => id === String(userid))
        if (value === "upvote") {
            if (downindex !== -1) {
                question.downvote = question.downvote.filter((id) => id !== String(userid))
            }
            if (upindex === -1) {
                question.upvote.push(userid);
            } else {
                question.upvote = question.upvote.filter((id) => id !== String(userid))
            }
        } else if (value === "downvote") {
            if (upindex !== -1) {
                question.upvote = question.upvote.filter((id) => id !== String(userid))
            }
            if (upindex === -1) {
                question.downvote.push(userid);
            } else {
                question.downvote = question.downvote.filter((id) => id !== String(userid))
            }
        }
        await Question.findByIdAndUpdate(_id, question);
        res.status(200).json({ message: "voted successfully.." })

    } catch (error) {
        res.status(404).json({ message: "id not found" });
        return
    }
}