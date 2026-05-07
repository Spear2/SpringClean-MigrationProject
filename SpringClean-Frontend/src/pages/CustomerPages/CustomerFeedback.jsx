import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Star } from "lucide-react";
import HomeBar from "../../components/Navbar/NavBarCustomer";
import "../../CustomersStyles/CustomerReviewPage.css";
const ReviewPage = () => {
  const [ratingFilter, setRatingFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortMode, setSortMode] = useState("Newest");

  const location = useLocation();
  const companyId = location.state?.companyCleanerId;

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
  if (!companyId) return;

  fetch(`http://localhost:8080/api/reviews/company/${companyId}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched reviews:", data); // <-- DEBUGGING
      setReviews(data);
    })
    .catch((err) => console.error("Error fetching reviews:", err));
}, [companyId]);

  // Add a type classification dynamically since backend does not provide it
  const classifyType = (rating) => {
    if (rating >= 4) return "Positive";
    if (rating === 3) return "Neutral";
    return "Complaint";
  };

  const filteredReviews = reviews
    .filter((review) => {
      const type = classifyType(review.rating);

      if (ratingFilter !== "All" && review.rating !== Number(ratingFilter))
        return false;

      if (typeFilter !== "All" && type !== typeFilter)
        return false;

      return true;
    })
    .sort((a, b) => {
      if (sortMode === "Newest") return new Date(b.date) - new Date(a.date);
      if (sortMode === "Oldest") return new Date(a.date) - new Date(b.date);
      if (sortMode === "Highest Rating") return b.rating - a.rating;
      if (sortMode === "Lowest Rating") return a.rating - b.rating;
      return 0;
    });

  return (
    <>
      <HomeBar />
      <div className="dashboard-header" style={{marginTop:"70px"}}>
            <h1>Customer Reviews & Complaints</h1>
        </div>
      <div className="review-container">
        

        {/* FILTERS */}
        <div className="filters-container">

          <div className="filter-item">
            <label>Filter by Rating</label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option>All</option>
              <option>5</option>
              <option>4</option>
              <option>3</option>
              <option>2</option>
              <option>1</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Filter by Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option>All</option>
              <option>Positive</option>
              <option>Complaint</option>
              <option>Neutral</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Sort by</label>
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value)}
            >
              <option>Newest</option>
              <option>Oldest</option>
              <option>Highest Rating</option>
              <option>Lowest Rating</option>
            </select>
          </div>

        </div>

        {/* REVIEWS */}
        <div className="reviews-list">
          {filteredReviews.length === 0 ? (
            <div className="no-reviews">
              <p>No Feedbacks or Complaints</p>
            </div>
          ) : (
            filteredReviews.map((review) => {
              const type = classifyType(review.rating);

              return (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <h2>{review.customerName}</h2>
                    <span className={`tag ${type.toLowerCase()}`}>{type}</span>
                  </div>

                  <div className="star-row">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        size={18}
                        fill={idx < review.rating ? "gold" : "none"}
                        stroke={idx < review.rating ? "gold" : "gray"}
                      />
                    ))}
                  </div>

                  <p className="review-message">{review.text}</p>

                  <p className="review-date">{review.date}</p>
                </div>
              );
            })
          )}
        </div>

      </div>
    </>
  );
};

export default ReviewPage;
