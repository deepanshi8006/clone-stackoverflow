import React, { useState } from 'react';
import axios from 'axios';

const UploadVideo = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [verified, setVerified] = useState(false);
    const [video, setVideo] = useState(null);

    const sendOtp = async () => {
        try {
            await axios.post('/generate-otp', { email });
            alert('OTP sent to your email.');
        } catch (error) {
            alert('Failed to send OTP');
        }
    };

    const verifyOtp = async () => {
        try {
            await axios.post('/verify-otp', { email, otp });
            setVerified(true);
            alert('OTP verified');
        } catch (error) {
            alert('Invalid OTP');
        }
    };

    const uploadVideo = async () => {
        if (!video) {
            alert('Please select a video');
            return;
        }

        const formData = new FormData();
        formData.append('video', video);
        formData.append('email', email);

        try {
            const response = await axios.post('/upload-video', formData);
            alert(response.data.message);
        } catch (error) {
            alert(error.response?.data?.error || 'Upload failed');
        }
    };

    return (
        <div>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={sendOtp}>Send OTP</button>
            <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={verifyOtp}>Verify OTP</button>
            {verified && (
                <>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideo(e.target.files[0])}
                    />
                    <button onClick={uploadVideo}>Upload Video</button>
                </>
            )}
        </div>
    );
};

export default UploadVideo;
