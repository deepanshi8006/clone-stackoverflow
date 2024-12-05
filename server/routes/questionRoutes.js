const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const moment = require('moment-timezone');
const ffmpeg = require('fluent-ffmpeg');
const router = express.Router();

const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 }, dest: 'uploads/' });

const OTP_STORE = {};

// Generate OTP
router.post('/generate-otp', async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    OTP_STORE[email] = otp;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL, pass: process.env.PASSWORD },
    });

    const mailOptions = {
        from: 'no-reply@example.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP is ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (OTP_STORE[email] && OTP_STORE[email] == otp) {
        delete OTP_STORE[email];
        res.json({ message: 'OTP verified' });
    } else {
        res.status(400).json({ error: 'Invalid OTP' });
    }
});

// Upload video
router.post('/upload-video', upload.single('video'), (req, res) => {
    const { email } = req.body;
    const currentTime = moment().tz('Asia/Kolkata');
    const hour = currentTime.hour();

    if (hour < 14 || hour >= 19) {
        return res.status(403).json({ error: 'Uploads allowed only between 2 PM and 7 PM' });
    }

    const videoFile = req.file;
    ffmpeg.ffprobe(videoFile.path, (err, metadata) => {
        if (err) return res.status(500).json({ error: 'Video processing failed' });

        if (metadata.format.duration > 120) {
            return res.status(400).json({ error: 'Video length exceeds 2 minutes' });
        }

        res.json({ message: 'Video uploaded successfully', file: videoFile.filename });
    });
});

module.exports = router;
