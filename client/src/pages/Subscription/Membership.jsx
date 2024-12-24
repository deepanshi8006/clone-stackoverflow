import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { baseURL } from "../../api/index";
import axios from "axios";
import logo from "../../Assets/icon.png";
import { IoMdCloseCircle } from "react-icons/io";
import "./Membership.css"; 

function Membership() {
  const user = useSelector((state) => state.currentuserreducer);
  const [reciept, setReciept] = useState(false);
  const [currentPlan, setcurrentPlan] = useState("Free");
  const [payment, setPayments] = useState([]);
  const navigate = useNavigate();

  const updateBronzeMembership = async () => {
    
    try {
      const currentTime = new Date();
    const start = new Date().setHours(10, 0, 0); // 10:00 AM IST
    const end = new Date().setHours(24, 0, 0); // 11:00 AM IST
    if (currentTime >= start && currentTime <= end) {
      if (user) {
        const price = 100;
        const {
          data: { order },
        } = await axios.post(`${baseURL}/user/checkout-session`, { price });

        const options = {
          key: "rzp_test_N3HoANUD6EFB1H",
          amount: order.amount,
          currency: "INR",
          name: "Bronze Membership of Stack Overflow",
          description: "User allowed to Post 5 Questions a day",
          image: logo,
          order_id: order.id,
          callback_url: `${baseURL}/user/payment-verification/${user?.result._id}/Bronze`,

          prefill: {
            name: `${user?.result.name}`,
            email: `${user?.result.email}`,
            contact: "9999999999",
          },
          notes: {
            address: "Stack Overflow",
          },
          theme: {
            color: "#121212",
          },
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        alert("Login Before Purchasing a Membership");
        navigate("/Auth");
      }
    
    } else {
      alert('Payment is allowed only between 10:00 AM and 11:00 AM IST' );
    }
      
    } catch (err) {
      console.log(err);
    }
  };

  const updateSilverMembership = async () => {
    try {
      const currentTime = new Date();
    const start = new Date().setHours(10, 0, 0); // 10:00 AM IST
    const end = new Date().setHours(24, 0, 0); // 11:00 AM IST
    if (currentTime >= start && currentTime <= end) {
      if (user) {
        const price = 300;
        const {
          data: { order },
        } = await axios.post(`${baseURL}/user/checkout-session`, { price });

        const options = {
          key: "rzp_test_N3HoANUD6EFB1H",
          amount: order.amount,
          currency: "INR",
          name: "Silver Membership of Stack Overflow",
          description: "User allowed to Post 10 Questions a day",
          image: logo,
          order_id: order.id,
          callback_url: `${baseURL}/user/payment-verification/${user?.result._id}/Silver`,

          prefill: {
            name: `${user?.result.name}`,
            email: `${user?.result.email}`,
            contact: "9999999999",
          },
          notes: {
            address: "Stack Overflow",
          },
          theme: {
            color: "#121212",
          },
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        alert("Login Before Purchasing a Membership");
        navigate("/Auth");
      }
    
    } else {
      alert('Payment is allowed only between 10:00 AM and 11:00 AM IST' );
    }
     
    } catch (err) {
      console.log(err);
    }
  };

  const updateGoldMembership = async () => {
    try {
      const currentTime = new Date();
    const start = new Date().setHours(10, 0, 0); // 10:00 AM IST
    const end = new Date().setHours(24, 0, 0); // 11:00 AM IST
  
    if (currentTime >= start && currentTime <= end) {
      if (user) {
        const price = currentPlan === "Silver" ? 900 : 1000;
        const {
          data: { order },
        } = await axios.post(`${baseURL}/user/checkout-session`, { price });

        const options = {
          key: "rzp_test_N3HoANUD6EFB1H",
          amount: order.amount,
          currency: "INR",
          name: "Gold Membership of Stack Overflow",
          description: "User allowed to Post Unlimited Questions a day",
          image: logo,
          order_id: order.id,
          callback_url: `${baseURL}/user/payment-verification/${user?.result._id}/Gold`,
          prefill: {
            name: `${user?.result.name}`,
            email: `${user?.result.email}`,
            contact: "9999999999",
          },
          notes: {
            address: "Stack Overflow",
          },
          theme: {
            color: "#121212",
          },
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        alert("Login Before Purchasing a Membership");
        navigate("/Auth");
      }
    } else {
      alert('Payment is allowed only between 10:00 AM and 11:00 AM IST' );
    }
      
    } catch (err) {
      console.log(err);
    }
  };

  const FetchCurrentPlan = async () => {
    try {
      const id = user?.result._id;
      const { data } = await axios.get(`${baseURL}/user/getUserPlan/${id}`);
      if (data.success) {
        setPayments(data.payment);
        setcurrentPlan(data.plan);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    user && FetchCurrentPlan();
  },[user] );

  return (
    <div className="main-bar">
      {reciept && (
        <div className="overlay">
          <div className="reciept-container">
            <h1 className="reciept-header">
              Payment Receipts
              <IoMdCloseCircle
                onClick={() => setReciept(false)}
                className="close-icon"
              />
            </h1>
            <div>
              {payment && payment.length === 0 && (
                <div className="no-receipts">
                  <h1>No Payment Receipts</h1>
                </div>
              )}
              {payment &&
                payment
                  .slice()
                  .sort((a, b) => new Date(b.purchasedOn) - new Date(a.purchasedOn))
                  .map((e, index) => {
                    return (
                      <div className="receipt" key={index}>
                        <h1>
                          <span>Plan Name:</span> {e.planName}
                        </h1>
                        <h1>
                          <span>Order Id:</span> {e.razorpay_order_id}
                        </h1>
                        <h1>
                          <span>Payment Id:</span> {e.razorpay_payment_id}
                        </h1>
                        <h1>
                          <span>Purchased On:</span> {new Date(e.purchasedOn).toLocaleDateString()}
                        </h1>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      )}
      <h1 className="header">
        Membership Plans
        {user && (
          <button className="show-receipts-btn" onClick={() => setReciept(true)}>
            Show Receipts
          </button>
        )}
      </h1>
      <h1 className="current-plan">
        <span>Current Plan:</span> {user ? currentPlan : "Login to check your plan"}
      </h1>
      {currentPlan === "Free" && <p className="plan-details">Can post only 1 question per day.</p>}
      {currentPlan === "Bronze" && <p className="plan-details">Can post 5 questions per day.</p>}
      {currentPlan === "Silver" && <p className="plan-details">Can post 10 questions per day.</p>}
      {currentPlan === "Gold" && <p className="plan-details">Can post unlimited questions per day.</p>}
      <div className="plans-container">
        <div className="plan-card">
          <div className="plan-content">
            <h2>Bronze Plan</h2>
            <p>₹100/month</p>
            <p>Post 5 questions a day</p>
            <button
              className={`plan-btn ${currentPlan !== "Free" && "disabled"}`}
              onClick={updateBronzeMembership}
              disabled={currentPlan !== "Free"}
            >
              {currentPlan === "Bronze" ? "Already Bought" : "Buy Now"}
            </button>
          </div>
        </div>
        <div className="plan-card">
          <div className="plan-content">
            <h2>Silver Plan</h2>
            <p>₹300/month</p>
            <p>Post 10 questions a day</p>
            <button
              className={`plan-btn ${currentPlan === "Silver" && "disabled"}`}
              onClick={updateSilverMembership}
              disabled={currentPlan === "Silver"}
            >
              {currentPlan === "Silver" ? "Already Have Silver" : "Buy Now"}
            </button>
          </div>
        </div>
        <div className="plan-card">
          <div className="plan-content">
            <h2>Gold Plan</h2>
            <p>₹1000/month</p>
            <p>Post unlimited questions</p>
            <button
              className={`plan-btn ${currentPlan === "Gold" && "disabled"}`}
              onClick={updateGoldMembership}
              disabled={currentPlan === "Gold"}
            >
              {currentPlan === "Gold" ? "Already Have Gold" : "Buy Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Membership;
