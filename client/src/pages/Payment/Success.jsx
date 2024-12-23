import React, { useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setcurrentuser } from "../../action/currentuser";
import { jwtDecode } from "jwt-decode";
import { sendInvoice } from "../../api/paymentApi"; 
import moment from "moment"
import "./Success.css"; 

function Success() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchQuery = useSearchParams()[0];
  const Reciepts = searchQuery.get("reference");
  const Reciept = Reciepts ? JSON.parse(decodeURIComponent(Reciepts)) : null;
  const User = JSON.parse(localStorage.getItem("Profile"));
  const decoded = User?.token ? jwtDecode(User.token) : null;

  useEffect(() => {
    const userDataString = searchQuery.get("user");
    if (userDataString && User?.token) {
      const decodedUserData = decodeURIComponent(userDataString);
      const result = JSON.parse(decodedUserData);
      if (decoded?.id === result._id) {
        localStorage.setItem(
          "Profile",
          JSON.stringify({ result, token: User?.token })
        );
        dispatch(setcurrentuser(JSON.parse(localStorage.getItem("Profile"))));
      } else {
        navigate("/");
      }
    }
    if (!userDataString || !Reciept || !User?.token) {
      navigate("/");
    } else {
      
      sendInvoice({
        email: User?.result?.email,
        planName: Reciept.planName,
        orderId: Reciept.razorpay_order_id,
        paymentId: Reciept.razorpay_payment_id,
        purchasedOn: moment(Reciept.purchasedOn).format("DD MMM, YYYY"),
      }).catch((error) => {
        console.error("Failed to send invoice email:", error);
      });
    }
  }, [searchQuery, User, Reciept, decoded, dispatch, navigate]);

  return (
    <div className="success-container">
      <h1 className="success-title">Congratulations! Your Payment Was Successful</h1>
      <div className="receipt-container">
        <h1 className="receipt-header">Payment Receipt</h1>
        <div className="receipt-details">
          <h1>
            <span className="font-bold">Plan Name:</span> {Reciept?.planName}
          </h1>
          <h1>
            <span className="font-bold">Order ID:</span> {Reciept?.razorpay_order_id}
          </h1>
          <h1>
            <span className="font-bold">Payment ID:</span> {Reciept?.razorpay_payment_id}
          </h1>
          <h1>
            <span className="font-bold">Purchased On:</span>{" "}
            {moment(Reciept?.purchasedOn).format("DD MMM, YYYY")}
          </h1>
        </div>
      </div>
      <Link to="/" className="back-link">
        Back to Home
      </Link>
    </div>
  );
}

export default Success;