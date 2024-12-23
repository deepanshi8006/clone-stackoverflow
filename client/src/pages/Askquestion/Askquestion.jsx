import React, { useState, useRef } from 'react';
import './Askquestion.css';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { askquestion } from '../../action/question';
import { generateOtpAction, verifyOtpAction } from '../../action/otpActions';
import { uploadVideo } from '../../api';
import moment from "moment-timezone";


const Askquestion = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.currentuserreducer);
    const [questiontitle, setquestiontitle] = useState("");
    const [questionbody, setquestionbody] = useState("");
    const [questiontag, setquestiontags] = useState([]);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [verified, setVerified] = useState(false);
    const [isUploadAllowed, setIsUploadAllowed] = useState(false);
    const [video, setVideo] = useState(null);
    const [uploadError, setUploadError] = useState("");
    const videoRef = useRef();

    const generateOtp = async () => {
        try {
            await dispatch(generateOtpAction(email));
            alert("OTP has been sent to your email.");
        } catch (error) {
            console.error("Error in OTP generation:", error);
            alert("Failed to send OTP. Please try again.");
        }
    };

    const verifyOtp = async () => {
        try {
            await dispatch(verifyOtpAction(email, otp));
            setVerified(true);
            setIsUploadAllowed(true);
            alert("OTP verified successfully.");
        } catch (error) {
            alert(error.message || "Invalid OTP. Please try again.");
        }
    };
    const handleVideoUpload = async () => {
        const video = videoRef.current?.files[0];
    
        if (!video) {
            setUploadError("Please select a video file to upload.");
            return;
        }
    
       const currentTime = moment().tz("Asia/Kolkata");
        const hour = currentTime.hour();
        if (hour < 14 || hour >= 19) {
            setUploadError("Uploads are only allowed between 2 PM and 7 PM.");
            return;
        }
    
       const maxFileSize = 50 * 1024 * 1024; // 50MB
        if (video.size > maxFileSize) {
            setUploadError("Video size exceeds 50MB.");
            return;
        }
    
        const isVideoDurationValid = await new Promise((resolve) => {
            const videoElement = document.createElement("video");
            videoElement.preload = "metadata";
    
            videoElement.onloadedmetadata = () => {
                window.URL.revokeObjectURL(videoElement.src);
                resolve(videoElement.duration <= 120); 
            };
    
            videoElement.onerror = () => resolve(false);
            videoElement.src = URL.createObjectURL(video);
        });
    
        if (!isVideoDurationValid) {
            setUploadError("Video length exceeds 2 minutes.");
            return;
        }
    
        const formData = new FormData();
        formData.append("video", video);
    
        try {
            const response = await uploadVideo(formData);
            alert(response.data.message);
            setUploadError("");
        } catch (error) {
            setUploadError(
                error.response?.data?.error || "Video upload failed. Please try again."
            );
        }
    };
    
    const handlesubmit = async (e) => {
        e.preventDefault();
    
        if (!user) {
            alert("Login to ask a question");
            return;
        }
    
        if (!questionbody || !questiontitle || !questiontag.length) {
            alert("Please fill all the fields and verify OTP");
            return;
        }

        const video = videoRef.current?.files[0];
        if (video) {
           
            const currentTime = moment().tz("Asia/Kolkata");
            const hour = currentTime.hour();
            if (hour < 14 || hour >= 19) {
                alert("Uploads are only allowed between 2 PM and 7 PM.");
                return;
            }
    
            const maxFileSize = 50 * 1024 * 1024; // 50MB
            if (video.size > maxFileSize) {
                alert("Video size exceeds 50MB.");
                return;
            }
    
            const isVideoDurationValid = await new Promise((resolve) => {
                const videoElement = document.createElement("video");
                videoElement.preload = "metadata";
    
                videoElement.onloadedmetadata = () => {
                    window.URL.revokeObjectURL(videoElement.src);
                    resolve(videoElement.duration <= 120); 
                };
    
                videoElement.onerror = () => resolve(false);
                videoElement.src = URL.createObjectURL(video);
            });
    
            if (!isVideoDurationValid) {
                alert("Video length exceeds 2 minutes.");
                return;
            }
        }

     
        const formData = new FormData();
        formData.append("questiontitle", questiontitle);
        formData.append("questionbody", questionbody);
        formData.append("questiontag", questiontag.join(", "));
        formData.append("userposted", user.result.name);
        if (video) {
            formData.append("video", video); 
        }
        try {
            const response = await dispatch(askquestion(formData, navigate));
            console.log("Response:", response);
    
            if (response?.error) {
                alert(response.error);
            } else {
                alert("You have successfully posted a question");
            }
        } catch (error) {
            alert("Failed to post the question.");
        }
    };
    
    return (
        <div className="ask-question">
            <div className="ask-ques-container">
                <h1>Ask a public Question</h1>
                <form onSubmit={handlesubmit}>
                    <div className="ask-form-container">
                        <label htmlFor="ask-ques-title">
                            <h4>Title</h4>
                            <p>Be specific and imagine you're asking a question to another person</p>
                            <input
                                type="text"
                                id="ask-ques-title"
                                onChange={(e) => setquestiontitle(e.target.value)}
                                placeholder='e.g. Is there an R function for finding the index of an element in a vector?' />
                        </label>
                        <label htmlFor="ask-ques-body">
                            <h4>Body</h4>
                            <p>Include all the information someone would need to answer your question</p>
                            <textarea
                                id="ask-ques-body"
                                onChange={(e) => setquestionbody(e.target .value)}
                                cols="30"
                                rows="10" />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button type="button" onClick={generateOtp}>Send OTP</button>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <button type="button" onClick={verifyOtp}>Verify OTP</button>
                            { verified && isUploadAllowed && (
                                <>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        ref={videoRef}
                                        onChange={(e) => {
                                            const selectedFile = e.target.files[0];
                                            setVideo(selectedFile);
                                        }}
                                    />
                                    <button type="button" onClick={handleVideoUpload}>Upload Video</button>
                                    {uploadError && <p className="error-message">{uploadError}</p>}
                                </>
                            )}
                        </label>
                        <label htmlFor="ask-ques-tags">
                            <h4>Tags</h4>
                            <p>Add up to 5 tags to describe what your question is about</p>
                            <input
                                type="text"
                                id='ask-ques-tags'
                                onChange={(e) => setquestiontags(e.target.value.split(" "))}
                                placeholder='e.g. (xml typescript wordpress)' />
                        </label>
                    </div>
                    <input type="submit" value="Review your question" className='review-btn' />
                </form>
            </div>
        </div>
    );
};

export default Askquestion;