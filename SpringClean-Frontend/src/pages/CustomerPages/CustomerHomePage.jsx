import React, { useState, useEffect } from "react";
import HomeBar from "../../components/Navbar/NavBarCustomer";
import CleanerCardComponent from "../../components/CustomerHomePage/CleanerCardComponent";
import { useNavigate } from "react-router-dom";
import "../../CustomersStyles/CustomerHomePage.css";

export default function CustomerHomePage() {
  const [companyCleaner, setCompanyCleaner] = useState([]);

  const navigate = useNavigate();

    // 1. Define your image array at the top of your component
  const cleaningImages = [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
  "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800",
  "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800",
  "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800",
  "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800",
  "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800",
  "https://images.unsplash.com/photo-1607827448387-a67db1383b59?w=800",
  "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
  "https://images.unsplash.com/photo-1628744876497-eb30460be9f6?w=800",
  "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800",
  "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800",
  "https://images.unsplash.com/photo-1603712725038-dc0ee6c4fc78?w=800",
  "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800",
  "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800",
  "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800",
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800",
  "https://images.unsplash.com/photo-1603712725038-dc0ee6c4fc78?w=800"
  ];

  // 2. Helper function to get image by index (consistent assignment)
  const getImageByIndex = (index) => {
    return cleaningImages[index % cleaningImages.length];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/company-cleaners");
        const companies = await res.json();

        if (!res.ok) {
          throw new Error(
            typeof companies === "object"
              ? JSON.stringify(companies)
              : "Failed to load companies"
          );
        }

        const safeCompanies = Array.isArray(companies) ? companies : [];

        // Fetch rating for each companyCleaner
        const companiesWithRatings = await Promise.all(
          safeCompanies.map(async (com, index) => {
            const ratingRes = await fetch(
              `http://localhost:8080/api/reviews/company/${com.companyCleanerId}/rating`
            );
            const ratingData = await ratingRes.json();

            return {
              ...com,
              avgRating: ratingData.avgRating || 0,
              totalReviews: ratingData.totalReviews || 0,
              img: getImageByIndex(index),
            };
          })
        );

        setCompanyCleaner(companiesWithRatings);
      } catch (err) {
        console.error("Error fetching cleaners:", err);
      }
    };

    fetchData();
  }, []);


  const handleViewHistory = () => {
    navigate("/customer/bookingSummary");
  };

  return (
    <>
      <HomeBar />

      <div className="main-wrapper">
        {/* Page Header */}
        <header className="BookNow-header">
          <div className="top-content">
            <h1 style={{ fontFamily: "Cal Sans", letterSpacing: "1px" }}>
              Book Now!
            </h1>
            <span>Trusted professionals ready to make your home shine.</span>
          </div>
          <button className="btn-viewhistory" onClick={handleViewHistory}>
            View Booking History
          </button>
        </header>

        {/* Cleaner Cards */}
        <div className="chp-card-wrapper">
          {companyCleaner.map((com) =>
            <CleanerCardComponent
              key={com.companyCleanerId}
              index={com.companyCleanerId}
              name={com.companyName}
              loc={com.location}            // real location from DB
              rate={com.avgRating}
              count={com.totalReviews}          // real rating
              desc={com.description}        // real description from DB
              totalReviews={com.totalReviews}
              img={com.img}
            />
          )}
        </div>
      </div>
    </>
  );
}
