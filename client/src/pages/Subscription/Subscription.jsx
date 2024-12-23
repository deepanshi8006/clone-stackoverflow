import React from "react";
import "../../App.css";
import Leftsidebar from "../../component/Leftsidebar/Leftsidebar";
import Rightsidebar from "../../component/Rightsidebar/Rightsidebar";
import Membership from "./Membership";

const Subscription = ({ handleslidein,slidein }) => {
  return (
    <div className="home-container-1">
      <Leftsidebar slidein={slidein} handleslidein={handleslidein}/>
      <div className="home-container-2">
        <Membership />
        <Rightsidebar />
      </div>
    </div>
  );
};

export default Subscription;
