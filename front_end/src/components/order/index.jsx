// Description: This file contains the code for the order page

// import styles
import "./index.scss";

//import icons
import { FiCopy } from "react-icons/fi";

import { useState, useEffect } from "react";

// Order component
const Order = ({ order, showDetails }) => {
  const [isCopied, setIsCopied] = useState(false);

  const orderDate = new Date(order.orderDate);
  const dateString = orderDate.toLocaleDateString();
  const timeString = orderDate.toLocaleTimeString();
  const humanReadableDate = `${dateString} at ${timeString}`;

  const succesTimeout = 3000;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(order.trackTraceCode);
    setIsCopied(true);
  };

  useEffect(() => {
    let timeoutId;
    if (isCopied) {
      timeoutId = setTimeout(() => {
        setIsCopied(false);
      }, succesTimeout);

      return () => clearTimeout(timeoutId);
    }
  }, [isCopied]);

  const handleClick = () => {
    showDetails(order);
  };

  return (
    <div className="order">
      <div className="order__header">
        <h2 className="order__header__title" onClick={handleClick}>
          Order #{order.orderId}
        </h2>
      </div>
      <div className="order__body">
        <div className="order__body__item">
          <h3 className="order__body__item__title">Order date</h3>
          <p className="order__body__item__text">{humanReadableDate}</p>
        </div>
        <div className="order__body__item">
          <h3 className="order__body__item__title">Order status</h3>
          <p className="order__body__item__text__status">{order.status}</p>
        </div>

        <div className="order__body__item">
          <h3 className="order__body__item__title">Track & Trace: </h3>
          <p
            className="order__body__item__text__trace"
            onClick={copyToClipboard}
          >
            <span>
              {order.trackTraceCode} <FiCopy />
            </span>
            {isCopied && (
              <p style={{ color: "green" }}>Code copied to clipboard!</p>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

// export Order component
export default Order;
