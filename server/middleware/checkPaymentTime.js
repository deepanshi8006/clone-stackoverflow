
const checkPaymentTime = (req, res, next) => {
    const currentTime = new Date();
    const start = new Date().setHours(10, 0, 0); // 10:00 AM IST
    const end = new Date().setHours(11, 0, 0); // 11:00 AM IST
  
    if (currentTime >= start && currentTime <= end) {
    
    } else {
      alert('Payment is allowed only between 10:00 AM and 11:00 AM IST' );
    }
  };
  
  export default checkPaymentTime;
  