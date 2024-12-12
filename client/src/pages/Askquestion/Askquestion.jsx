import React, { useState } from 'react';
import './Askquestion.css';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { askquestion } from '../../action/question';
import { generateOtpAction, verifyOtpAction } from '../../action/otpActions';
import { uploadVideo } from '../../api';

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


    const generateOtp = async () => {
        console.log("Sending OTP to:", email);
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
            console.log(otp, "hey");
        } catch (error) {

            alert(error.message || "Invalid OTP. Please try again.");
        }
    };

    const handleVideoUpload = async () => {
        if (!video) {
            setUploadError("Please select a video file to upload.");
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
        console.log(formData)
    };
    const handlesubmit = (e) => {
        e.preventDefault();
        if (user) {
            if (questionbody && questiontitle && questiontag.length) {
                dispatch(askquestion({ questiontitle, questionbody, questiontag, video, userposted: user.result.name }, navigate));
                alert("You have successfully posted a question");
            } else {
                alert("Please fill all the fields and verify OTP");
            }
        } else {
            alert("Login to ask a question");
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
                                onChange={(e) => setquestionbody(e.target.value)}
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
                            {verified && isUploadAllowed && (
                                <>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => setVideo(e.target.files[0])}
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
