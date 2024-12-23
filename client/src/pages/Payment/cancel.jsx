import React, { useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import "./cancel.css"; 

function Cancel() {
  const navigate = useNavigate();
  const searchQuery = useSearchParams()[0];
  const reference = searchQuery.get("reference");

  useEffect(() => {
    if (!reference) {
      navigate("/");
    }
  }, [searchQuery]);

  return (
    <div className="cancel-container">
      <h1 className="cancel-title">Oops! Your Payment Got Cancelled</h1>
      <h2 className="cancel-subtitle">Something Went Wrong</h2>
      <Link to="/" className="cancel-link">Back to Home</Link>
    </div>
  );
}

export default Cancel;
