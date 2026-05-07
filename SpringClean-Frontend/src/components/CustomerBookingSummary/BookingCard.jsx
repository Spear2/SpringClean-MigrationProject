export default function BookingCard({
  status,
  date,
  companyCleaner,
  cleaner,
  location,
  onEdit,
  onCancel,
  onPay,
  onViewHistory,
}) {
  const normalized = status?.trim() || "Pending";

  return (
    <div className="cbc-summary-card">

    <div className="cbc-booking-info">

      <h3>
        Company: <strong>{companyCleaner}</strong>
      </h3>

      <p className="status">Status:
        <strong className={`status-${normalized.toLowerCase()}`}> 
          {normalized}
        </strong> 
      </p>
      <p><strong>Date:</strong> {date}</p>

      <div className="cbc-cleaner-section">
        <strong>Cleaners Assigned:</strong>

        {cleaner?.length > 0 ? (
          <div className="cbc-cleaner-badges">
            {cleaner.map((item, index) => (
              <span key={index} className="cbc-cleaner-badge">
                {item}
              </span>
            ))}
          </div>
        ) : (
          <p className="cbc-no-cleaner">No cleaner assigned yet</p>
        )}
      </div>

      <p><strong>Location:</strong> {location}</p>

    </div>

    <div className="cbc-booking-actions">
      {normalized === "Pending" && (
        <>
          <button className="cbc-btn-pay" onClick={onPay}>Pay Now</button>
          <button className="cbc-btn-cancel" onClick={onCancel}>Cancel</button>
        </>
      )}

      {normalized === "Paid" && (
        <>
          <button className="cbc-btn-edit" onClick={onEdit}>Edit</button>
          <button className="cbc-btn-cancel" onClick={onCancel}>Cancel</button>
        </>
      )}

      {/* {normalized === "Accepted" && (
        // <button className="cbc-btn-view" onClick={onViewHistory}>View Details</button>
      )}

      {(normalized === "In Progress" || normalized === "Completed") && (
        // <button className="cbc-btn-view" onClick={onViewHistory}>View History</button>
      )} */}
    </div>

  </div>

  );
}
