import { generateOtp, verifyOtp } from "../api";

export const generateOtpAction = (email) => async (dispatch) => {
    try {
        dispatch({ type: "OTP_GENERATE_REQUEST" });
        const { data } = await generateOtp(email);
        dispatch({ type: "OTP_GENERATE_SUCCESS", payload: data });
        console.log("dispatching done")
    } catch (error) {
        dispatch({ type: "OTP_GENERATE_FAILURE", payload: error.response?.data?.message });
    }
};

export const verifyOtpAction = (email, otp) => async (dispatch) => {
    try {
        dispatch({ type: "OTP_VERIFY_REQUEST" });
        const { data } = await verifyOtp(email, otp);
        dispatch({ type: "OTP_VERIFY_SUCCESS", payload: data });
        console.log("verifying");
    } catch (error) {
        console.error("Error during OTP verification:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers,
        });

        dispatch({
            type: "OTP_VERIFY_FAILURE",
            payload: error.response?.data?.error || error.message
        });

        throw new Error(error.response?.data?.error || "OTP verification failed");
    }
};

