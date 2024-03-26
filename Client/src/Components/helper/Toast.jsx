import React, { useState, useEffect } from 'react';

const Toast = ({ message, type }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 5000); // Change 5000 to the desired duration in milliseconds

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  return (
    <div className={`toast ${type}`} style={{ display: show ? 'block' : 'none' }}>
      <button className="close-button" onClick={handleClose}>×</button>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
