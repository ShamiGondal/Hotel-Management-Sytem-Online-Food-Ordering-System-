// ErrorPage.js
import React from 'react';
import { Link } from 'react-router-dom'; // If using React Router

const ErrorPage = () => {
  return (
    <div className="error-page">
      <div className="error-message">
        <h1>Oops! Something went wrong.</h1>
        <p>We apologize for the inconvenience.</p>
        <p>Please try refreshing the page or go back to the <Link to="/">home page</Link>.</p>
      </div>
    </div>
  );
};

export default ErrorPage;
