import React from "react";
import "./StepJourney.css";

export default function StepJourney({ currentStep }) {
  const steps = [
    { number: 1, label: "Choose Role" },
    { number: 2, label: "Create Account" },
    { number: 3, label: "Complete" },
  ];

  return (
    <div className="step-journey-container">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          {/* Step Circle */}
          <div className="step-item">
            <div
              className={`step-circle ${
                currentStep >= step.number ? "active" : ""
              } ${currentStep === step.number ? "current" : ""}`}
            >
              {currentStep > step.number ? (
                <span className="checkmark">✓</span>
              ) : (
                <span>{step.number}</span>
              )}
            </div>
            <p className="step-label">{step.label}</p>
          </div>

          {/* Connector Line (don't show after last step) */}
          {index < steps.length - 1 && (
            <div
              className={`step-connector ${
                currentStep > step.number ? "active" : ""
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
