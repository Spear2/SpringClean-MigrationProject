import { useState, useEffect } from "react";
import "./Reviews.css";
import useCustomer from "../../Hooks/useCustomer";

export default function ReviewPage() {
  const customer = useCustomer();
  const [reviewFor, setReviewFor] = useState("company"); 
  const [companyId, setCompanyId] = useState("");
  const [cleanerId, setCleanerId] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [companies, setCompanies] = useState([]);
  const [cleaners, setCleaners] = useState([]);
  const [customerReviews, setCustomerReviews] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/company-cleaners")
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch(console.error);

    fetch("http://localhost:8080/api/cleaners") 
      .then((res) => res.json())
      .then((data) => setCleaners(data))
      .catch(console.error);
  }, []);


  useEffect(() => {
    if (!customer?.customerId) return;

    fetch(`http://localhost:8080/api/reviews/customer/${customer.customerId}`)
      .then((res) => res.json())
      .then((data) => setCustomerReviews(data))
      .catch(console.error);
  }, [customer]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      return alert("Please select a star rating.");
    }
    if (!text.trim()) {
      return alert("Please enter your review.");
    }

    const formData = new FormData();
    const reviewData = {
      reviewFor,
      companyId: reviewFor === "company" ? Number(companyId) : null,
      cleanerId: reviewFor === "cleaner" ? Number(cleanerId) : null,
      rating,
      text,
      customerId: customer.customerId,
    };

    formData.append("data", new Blob([JSON.stringify(reviewData)], { type: "application/json" }));
    if (file) formData.append("file", file);

    const res = await fetch("http://localhost:8080/api/reviews", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      alert("Error submitting review.");
      return;
    }else{
      alert("Reviews Submitted");
    }

    setSubmitted(true);
    setRating(0);
    setText("");
    setFile(null);
    setCleanerId("");
    setCompanyId("");

    // Reload reviews
    fetch(`http://localhost:8080/api/reviews/customer/${customer.customerId}`)
      .then((res) => res.json())
      .then((data) => setCustomerReviews(data));
  };

  return (
    <div className="review-wrapper">

      <header className="review-header">
        <h1>Send a Review or Complaint</h1>
        <span>We value your feedback!</span>
      </header>

      <form className="review-form" onSubmit={handleSubmit}>

        <select
          className="review-select"
          value={reviewFor}
          onChange={(e) => setReviewFor(e.target.value)}
        >
          <option value="company">Company</option>
          <option value="cleaner">Cleaner</option>
        </select>

        {/* Company selection */}
        {reviewFor === "company" && (
          <select
            className="review-select"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
          >
            <option value="">Select Company</option>
            {companies.map((co) => (
              <option key={co.companyCleanerId} value={co.companyCleanerId}>
                {co.companyName}
              </option>
            ))}
          </select>
        )}

        {/* Cleaner selection */}
        {reviewFor === "cleaner" && (
          <select
            className="review-select"
            value={cleanerId}
            onChange={(e) => setCleanerId(e.target.value)}
          >
            <option value="">Select Cleaner</option>
            {cleaners.map((c) => (
              <option key={c.cleanerId} value={c.cleanerId}>
                {c.cleanerName}
              </option>
            ))}
          </select>
        )}

        {/* Stars */}
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= rating ? "filled" : ""}`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          className="review-text"
          rows="5"
          placeholder="Write your review..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <label className="attachment-label">
          Attach Image (optional)
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        </label>

        <button className="review-submit-btn">Submit</button>
      </form>

      {submitted && (
        <div className="review-success">
          <p>Thank you! Your review has been submitted.</p>
        </div>
      )}

      {/* ======================== */}
      {/*      REVIEW HISTORY      */}
      {/* ======================== */}
      <section className="review-history">
        <h2>Your Previous Reviews</h2>

        {customerReviews.length === 0 && <p>No reviews submitted yet.</p>}

        {customerReviews.map((r) => (
          <div className="review-card" key={r.id}>
            <div className="review-top">
              <strong>
                {r.reviewFor === "company"
                  ? `Company: ${r.company?.companyName}`
                  : `Cleaner: ${r.cleaner?.cleanerName}`}
              </strong>

              <span className="review-date">
                {r.date} • {r.time}
              </span>
            </div>

            <div className="review-stars">
              {"★".repeat(r.rating)}{" "}
              {"☆".repeat(5 - r.rating)}
            </div>

            <p className="review-text-display">{r.text}</p>

            {r.imageUrl && (
              <img
                src={r.imageUrl}
                alt="attachment"
                className="review-img"
              />
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
