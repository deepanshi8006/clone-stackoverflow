import Question from "../models/Question.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import moment from "moment-timezone";
import ffmpeg from "fluent-ffmpeg";
import User from "../models/auth.js"
import path from "path"
import fs from "fs";
const OTP_STORE = {};

export const generateotp = async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);

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

    const isOtpValid = String(otpEntry.otp) === String(otp) && Date.now() - otpEntry.createdAt <= 10 * 60 * 1000;

    if (isOtpValid) {
        delete OTP_STORE[email];
        res.json({ message: "OTP verified" });
    } else {
        res.status(400).json({ error: "Invalid or expired OTP" });
    }
};


export const uploadvideo = async (req, res) => {
    const videoFile = req.file;


    const normalizedPath = path.normalize(videoFile.path);


    ffmpeg.ffprobe(normalizedPath, async (err, metadata) => {
        if (err) {
            console.error("ffprobe Error:", err.message);
            console.error("File Path:", normalizedPath);
            return res.status(500).json({ error: "Video processing failed" });
        }

        res.json({
            message: "Video uploaded successfully",
            file: videoFile.filename,
        });
    });
};

export const Askquestion = async (req, res) => {
    try {
        const postQuestionData = req.body;
        const userid = req.userid;

        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json("User  not found");
        }


        if (user.payments && Array.isArray(user.payments) && user.payments.length > 0) {
            const lastPaymentDate = user.payments[user.payments.length - 1].purchasedOn;
            const expiryDate = new Date(lastPaymentDate);
            expiryDate.setDate(expiryDate.getDate() + 30);
            if (user.Currentplan !== "Free" && expiryDate < new Date()) {
                await User.findByIdAndUpdate(userid, { Currentplan: "Free" }, { new: true });
                console.log('User  plan expired. Changed to Free plan.');
            }
        }
        console.log('User  Plan:', user.Currentplan);

       let maxQuestionsAllowed = 1; 

        switch (user.Currentplan) {
            case "Bronze":
                maxQuestionsAllowed = 5; // ₹100/month
                break;
            case "Silver":
                maxQuestionsAllowed = 10; // ₹300/month
                break;
            case "Gold":
                maxQuestionsAllowed = Infinity; // ₹1000/month
                break;
            default:
                maxQuestionsAllowed = 1; // Default is Free plan
                break;
        }
        console.log('Max Questions Allowed:', maxQuestionsAllowed);

        const questionsCount = await Question.countDocuments({
            userid,
            askedOn: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        });

        console.log('Questions Count in Last 24 Hours:', questionsCount);

       if (questionsCount >= maxQuestionsAllowed) {
            return res.status(400).json({
                message: `Upgrade Your Plan to exceed the daily limit of ${maxQuestionsAllowed} question${maxQuestionsAllowed > 1 ? 's' : ''}.`,
            });
        }
          const postQuestion = new Question({
            ...postQuestionData,
            userid,
            video: req.file ? req.file.filename : null, 
            askedOn: new Date(),
        });

        await postQuestion.save();
        return res.status(200).json("Posted a question successfully");
        alert("you have succesfully posted question")

    } catch (error) {
        console.error('Error in Askquestion:', error);
        return res.status(500).json("Couldn't post a new question");
        alert("please update your current plan")
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
