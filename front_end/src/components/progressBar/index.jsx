import React from "react";
import {
  FiShoppingBag,
  FiCheckCircle,
  FiCheckSquare,
  FiTruck,
  FiSettings,
} from "react-icons/fi";

import "./index.scss";

function ProgressBar({ status }) {
  const steps = [
    { label: "Placed", icon: <FiShoppingBag /> },
    { label: "Confirmed", icon: <FiCheckCircle /> },
    { label: "Processed", icon: <FiSettings /> },
    { label: "Shipped", icon: <FiTruck /> },
    { label: "Delivered", icon: <FiCheckSquare /> },
  ];

  const getStepClassName = (stepIndex) => {
    let className = "";
    if (stepIndex < steps.findIndex((step) => step.label === status)) {
      className = "step completed";
    } else if (stepIndex === steps.findIndex((step) => step.label === status)) {
      className = "step active";
    } else {
      className = "step";
    }
    if (stepIndex === steps.length - 1 && status === "Delivered") {
      className = "step completed";
    }
    return className;
  };
  return (
    <>
      <div className="progress-bar__bar">
        {steps.map((step, index) => (
          <div
            className={getStepClassName(index)}
            key={step.label}
            style={{
              [window.innerWidth <= 768 ? "height" : "width"]: `${
                100 / steps.length
              }%`,
            }}
          />
        ))}
      </div>
      <div className="progress-bar__label flex">
        {steps.map((step, index) => (
          <div className={getStepClassName(index)} key={step.label}>
            <div
              className="label"
              style={
                index % 2 === 0 ? { top: "-3.5rem" } : { bottom: "-3.5rem" }
              }
            >
              Order {step.label}
            </div>
            <div className="icon">{step.icon}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ProgressBar;
