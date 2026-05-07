import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import useCustomer from "../../Hooks/useCustomer";

export default function BookingForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { companyCleanerId, cleanerName, cleanerLocation } = location.state || {};
  const customer = useCustomer();

  const cleaningServices = [
    { type: "Basic", pricePerHour: 450 },
    { type: "Standard", pricePerHour: 750 },
    { type: "Premium", pricePerHour: 1000 },
  ];
  // ✅ formData initialized safely
  const [formData, setFormData] = useState({
    companyCleanerId: companyCleanerId || "",
    date: "",
    time: "",
    hours: "",
    minutes: "",
    serviceType: "",
    price: 0,
    cleaner: cleanerName || "",
    cleanerLocation: cleanerLocation || "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const service = cleaningServices.find(s => s.type === formData.serviceType);
    if (!service || !formData.hours) {
      setFormData(prev => ({ ...prev, price: 0 }));
      return;
    }

    const totalHours = Number(formData.hours) + Number(formData.minutes) / 60;
    const totalPrice = totalHours * service.pricePerHour;

    setFormData(prev => ({ ...prev, price: totalPrice.toFixed(2) }));
  }, [formData.serviceType, formData.hours, formData.minutes]);

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = "Please select a date.";
    if (!formData.time) newErrors.time = "Please select a time.";
    // if (!formData.hours) newErrors.hours = "Please enter duration in hours.";
    // if (!formData.minutes) newErrors.minutes = "Please enter duration in minutes.";
    if (!formData.address) newErrors.address = "Please enter your address.";
    if (!formData.serviceType) {
      newErrors.serviceType = "Please select a cleaning service.";
    }

      // NEW — allow booking less than 1 hour
  if (!formData.hours && !formData.minutes) {
    newErrors.hours = "Please enter at least 1 minute or 1 hour.";
    newErrors.minutes = "Please enter at least 1 minute or 1 hour.";
  }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if(!customer){
    return <div>Loading customer data...</div>;
  }


  // Submit booking
  const submitBooking = async () => {
    if (!validateForm()) return;

    if (!customer || !customer.customerId) {
      alert("Customer data not loaded yet. Try again.");
      return;
    }
    
    const bookingData = {
    companyCleanerId: Number(formData.companyCleanerId),
    address: formData.address,
    date: formData.date,
    time: formData.time,
    hours: Number(formData.hours),
    minutes: Number(formData.minutes),
    serviceType: formData.serviceType,
    totalPrice: formData.price
  };


      try {
        const response = await fetch(`http://localhost:8080/api/bookings/${customer.customerId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          alert(`${errorMessage}`);
          throw new Error("Failed to save booking");
        }

        const savedBooking = await response.json();
        // Get all existing bookings from localStorage
        const savedBookings = JSON.parse(localStorage.getItem("currentBookings")) || [];

        // Update the array: remove previous booking with same bookingId (if exists) and add new one
        const updatedBookings = [
          ...savedBookings.filter(b => b.bookingId !== savedBooking.bookingId),
          savedBooking
        ];
        localStorage.setItem("currentBookings", JSON.stringify(updatedBookings));
        // Redirect to payment page with saved booking
        navigate("/customer/payments", { state: { newBooking: savedBooking } });

      } catch (err) {
        
      }
    };

  


  return (
    <div className="cbf-main-wrapper">
      
      <header className="cbf-settings-header">
        <h1>Booking Form {companyCleanerId}</h1>
        <span>Book your cleaning in just a few clicks — we’ll handle the rest!</span>
      </header>

      <div className="cbf-form-container">

        <label>
          Selected Cleaner: 
          <input type="text" value={formData.cleaner} readOnly />
        </label>

        <label>
          Cleaner’s Location:
          <input type="text" value={formData.cleanerLocation} readOnly />
        </label>

        <label>
          Type of Cleaning Service:
          <div className="cbf-select-wrapper">
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
            >
              <option value="" disabled>
                -- Select Service --
              </option>
              {cleaningServices.map((service, index) => (
                <option key={index} value={service.type}>
                  {service.type} — ₱{service.pricePerHour}/hr
                </option>
              ))}
            </select>
          </div>
          {errors.serviceType && (
            <p className="cbf-error-text">{errors.serviceType}</p>
          )}
        </label>


        <label>
          Your Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your full home address"
          />
          {errors.address && <p className="cbf-error-text">{errors.address}</p>}
        </label>

        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
          {errors.date && <p className="cbf-error-text">{errors.date}</p>}
        </label>

        <label>
          Time:
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />
          {errors.time && <p className="cbf-error-text">{errors.time}</p>}
        </label>

        <label>
          Duration (hrs):
          <input
            type="number"
            name="hours"
            min="1"
            max="12"
            step="1"
            value={formData.hours}
            onChange={handleChange}
            placeholder="Enter hours"
          />
          {errors.hours && <p className="cbf-error-text">{errors.hours}</p>}
        </label>

        <label>
          Duration (mins):
          <input
            type="number"
            name="minutes"
            min="0"
            max="59"
            step="5"
            value={formData.minutes}
            onChange={handleChange}
            placeholder="Enter minutes"
          />
          {errors.minutes && <p className="cbf-error-text">{errors.minutes}</p>}
        </label>
        <label>
          Total Price:
          <input type="text" value={`₱${formData.price}`} readOnly />
        </label>

        <button className="cbf-btn-submit" onClick={submitBooking}>
          Submit Booking
        </button>

      </div>
    </div>
  );
}
