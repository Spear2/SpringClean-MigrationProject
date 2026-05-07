import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useCustomer from "../../Hooks/useCustomer";

export default function CustomerPayment({ onConfirm }) {
  const navigate = useNavigate();
  const location = useLocation();
  const customer = useCustomer();

  // --- Payment methods ---
  const paymentMethods = [
    {
      id: "creditCard",
      label: "Credit Card",
      brandImage: "https://cdn-icons-png.flaticon.com/128/8983/8983163.png",
      fields: [
        { name: "cardNumber", label: "Card Number", type: "text" },
        { name: "expiryDate", label: "Expiry Date", type: "text" },
        { name: "cvv", label: "CVV", type: "password" },
      ],
    },
    {
      id: "paypal",
      label: "PayPal",
      brandImage: "https://cdn-icons-png.flaticon.com/128/888/888870.png",
      fields: [{ name: "email", label: "PayPal Email", type: "email" }],
    },
    {
      id: "bankTransfer",
      label: "Bank Transfer",
      brandImage: "https://cdn-icons-png.flaticon.com/128/349/349229.png",
      fields: [
        { name: "accountNumber", label: "Account Number", type: "text" },
        { name: "bankName", label: "Bank Name", type: "text" },
      ],
    },
    {
      id: "cash",
      label: "Cash",
      brandImage: "https://cdn-icons-png.flaticon.com/512/3458/3458714.png",
      fields: [],
    },
    {
      id: "mobileWallet",
      label: "Mobile Wallet",
      brandImage: "https://cdn-icons-png.flaticon.com/128/1796/1796819.png",
      fields: [
        { name: "walletProvider", label: "Wallet Provider", type: "text" },
        { name: "phoneNumber", label: "Phone Number", type: "tel" },
      ],
    },
  ];

  // --- Get booking safely ---
  const bookingId = location.state?.bookingId;
  const allBookings = JSON.parse(localStorage.getItem("currentBookings")) || [];
  let newBooking = location.state?.newBooking;

  if (!newBooking && bookingId){
    newBooking = allBookings.find(b=> b.bookingId === bookingId || null);
  }

  // --- States ---
  const [booking, setBooking] = useState(newBooking);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [formData, setFormData] = useState({});
  const [amount, setAmount] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const selectedMethodObj = paymentMethods.find((m) => m.id === selectedMethod);

  // --- Handlers ---
  const handleSelectMethod = (id) => {
    setSelectedMethod(id);
    setFormData({});
    setErrors({});
  };

  useEffect(() => {
    if (newBooking){
      setAmount(newBooking.totalPrice || newBooking.price || "");
      
    }
  }, [newBooking]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};


    if (!selectedMethod) {
      newErrors.selectedMethod = "Please select a payment method.";
    } else {
      selectedMethodObj.fields.forEach((field) => {
        
        if (!formData[field.name]?.trim()) {
          newErrors[field.name] = `${field.label} is required.`;
        }
      });
    }

    if (!agreed) {
      newErrors.agreed = "You must agree to the terms.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleConfirmPayment = async () => {
    
    if (!customer?.customerId) return;

    const paymentData = {
      bookingId: newBooking.bookingId,
      amount: Number(amount),
      method: selectedMethodObj.label,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/payments/${customer.customerId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        }
      );

      if (!response.ok) {
        throw new Error("Payment failed");
      }

      const paymentResult = await response.json();

      // --- Update currentBookings in localStorage ---
      const savedBookings = JSON.parse(localStorage.getItem("currentBookings")) || [];
      const updatedBookings = [
        ...savedBookings.filter((b) => b.bookingId !== newBooking.bookingId),
        { ...newBooking, payment: paymentResult },
      ];
      localStorage.setItem("currentBookings", JSON.stringify(updatedBookings));

      // --- Navigate to summary ---
      navigate("/customer/bookingSummary", {
        state: {
          newBooking,
          payment: paymentResult,
        },
      });
    } catch (err) {
      alert("Payment failed. Try again.");
    }
  };

  const handlePayClick = () => {
    if (validate()) {
      setShowModal(true);
    }
  };

  const handleCancel = () => setShowModal(false);

  return (
    <>
      <header className="settings-header">
        <h1>Payment Options</h1>
        <span>Choose your preferred payment method.</span>
      </header>

      <section className="cpp-payment-container" aria-label="Payment options and details">
        <div className="cpp-payment-options" role="list">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`payment-card${selectedMethod === method.id ? " selected" : ""}`}
              onClick={() => handleSelectMethod(method.id)}
              tabIndex={0}
              role="listitem button"
              aria-pressed={selectedMethod === method.id}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleSelectMethod(method.id);
              }}
            >
              <img src={method.brandImage} alt={`${method.label} logo`} />
              <div>{method.label}</div>
            </div>
          ))}
        </div>

        <label htmlFor="amount" className="cpp-visually-hidden">
          Amount
        </label>
        <input
          id="amount"
          type="text"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          aria-invalid={!!errors.amount}
          aria-describedby={errors.amount ? "amount-error" : undefined}
          readOnly
        />
        {errors.amount && (
          <small id="amount-error" className="cpp-error-message">
            {errors.amount}
          </small>
        )}

        {selectedMethodObj &&
          selectedMethodObj.fields.map((field) => (
            <div key={field.name} className="cpp-field-group">
              <label htmlFor={field.name}>{field.label}</label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name] || ""}
                onChange={handleChange}
                aria-invalid={!!errors[field.name]}
                aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
              />
              {errors[field.name] && (
                <small id={`${field.name}-error`} className="cpp-error-message">
                  {errors[field.name]}
                </small>
              )}
            </div>
          ))}

        <label className="cpp-checkbox-label">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            aria-invalid={!!errors.agreed}
            aria-describedby={errors.agreed ? "agree-error" : undefined}
          />
          I agree to the terms and conditions applied.
        </label>
        {errors.agreed && (
          <small id="agree-error" className="cpp-error-message">
            {errors.agreed}
          </small>
        )}

        <button className="cpp-pay-btn" onClick={handlePayClick}>
          Pay
        </button>
      </section>

      {showModal && selectedMethodObj && (
        <div
          className="cpp-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-payment-title"
        >
          <div className="cpp-modal-content">
            <h2 id="confirm-payment-title">Confirm Payment</h2>
            <ul>
              <li>
                <strong>Payment Method:</strong> {selectedMethodObj.label}
              </li>
              <li>
                <strong>Amount:</strong> {amount}
              </li>
              {selectedMethodObj.fields.map((field) => (
                <li key={field.name}>
                  <strong>{field.label}:</strong> {formData[field.name]}
                </li>
              ))}
            </ul>
            <div className="cpp-modal-actions">
              <button onClick={handleConfirmPayment}>Confirm</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
