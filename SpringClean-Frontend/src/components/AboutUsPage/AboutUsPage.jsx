import React from "react";
import "./AboutUsStyle.css";

export default function AboutUsPage() {
  return (
    <div className="aboutus-hero">
      <div className="explanation-wrapper">
        <div className="explanation-container">
          <div className="title">
            <h1>Who We Are</h1>
          </div>
          <div className="description">
            <p style={{ color: "white" }}>
              At <strong>SpringClean</strong>, we believe that a clean space
              creates a clear mind. We’re a team of dedicated cleaners and
              organizers passionate about helping you live comfortably and
              stress-free.
            </p>
          </div>
        </div>

        <div className="explanation-container">
          <div className="title">
            <h1>What We Do</h1>
          </div>
          <div className="description">
            <p style={{ color: "white" }}>
              We offer a range of services — from{" "}
              <strong>Basic Cleaning</strong> for quick refreshes, to{" "}
              <strong>Premium Deep Cleaning</strong> for a spotless
              transformation. Our cleaners are trained, reliable, and committed
              to ensuring your satisfaction every single time.
            </p>
          </div>
        </div>

        <div className="explanation-container">
          <div className="title">
            <h1>Our Mission</h1>
          </div>
          <div className="description">
            <p style={{ color: "white" }}>
              To make cleaning simple, affordable, and dependable — giving you
              more time for the things that matter most. We aim to connect
              customers with trusted cleaners while providing fair opportunities
              for cleaners to grow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
