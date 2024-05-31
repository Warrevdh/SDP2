import React from "react";
import "./index.scss";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>Oops!</h1>
      <h2>404 - Page Not Found</h2>
      <p>
        The page you are looking for might have been removed or is temporarily
        unavailable.
      </p>
      <Link to="/" className="btn btn-primary">
        <span>Go back to home</span>
      </Link>
    </div>
  );
};

export default NotFound;
