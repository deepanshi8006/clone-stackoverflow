const initialState = { loading: false, success: false, error: null };

export const otpReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'OTP_GENERATE_REQUEST':
        case 'OTP_VERIFY_REQUEST':
            return { ...state, loading: true };
        case 'OTP_GENERATE_SUCCESS':
        case 'OTP_VERIFY_SUCCESS':
            return { ...state, loading: false, success: true };
        case 'OTP_GENERATE_FAILURE':
        case 'OTP_VERIFY_FAILURE':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};
