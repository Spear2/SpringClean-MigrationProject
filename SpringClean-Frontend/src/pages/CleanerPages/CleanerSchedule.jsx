import React, { useState } from "react";
import "./Styles/CleanerSchedule.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import NavBarCompany_Cleaner from "../../components/Navbar/NavBarCompany_Cleaner";

export default function CleanerSchedule() {
  const [date, setDate] = useState(new Date());

  // 1. YOUR EVENTS DATA
  // Note: Months are 0-indexed in JS (0 = Jan, 11 = Dec)
  const myJobs = [
    { date: new Date(2025, 11, 6), title: "Deep Clean" }, // Dec 6
    { date: new Date(2025, 11, 8), title: "Move Out" }, // Dec 8
    { date: new Date(2025, 11, 8), title: "Office" }, // Dec 8 (2nd job)
    { date: new Date(2025, 11, 20), title: "Standard" }, // Dec 20
  ];

  // 2. THE LOGIC TO DRAW DOTS
  // This function runs for every single day on the calendar
  const tileContent = ({ date, view }) => {
    // Only add dots in the "Month" view
    if (view === "month") {
      // Check if the current calendar tile matches any job date
      const hasJob = myJobs.some(
        (job) =>
          job.date.getDate() === date.getDate() &&
          job.date.getMonth() === date.getMonth() &&
          job.date.getFullYear() === date.getFullYear()
      );

      // If match, return a JSX element (the dot)
      if (hasJob) {
        return <div className="event-dot"></div>;
      }
    }
  };

  // 3. Filter jobs to show below the calendar when a date is clicked
  const jobsForSelectedDate = myJobs.filter(
    (job) => job.date.toDateString() === date.toDateString()
  );

  return (
    <div className="cleanerCalendar-container">
      <NavBarCompany_Cleaner />

      <div className="calendar-header">
        <h1>Schedule</h1>
        <h1>{date.toDateString()}</h1>
      </div>

      <div className="calendar-content">
        {/* Pass the tileContent function here */}
        <Calendar onChange={setDate} value={date} tileContent={tileContent} />

        {/* Optional: Show details for the selected day */}
        <div className="selected-date-jobs">
          <h3>Jobs for {date.toDateString()}:</h3>
          {jobsForSelectedDate.length > 0 ? (
            <ul>
              {jobsForSelectedDate.map((job, index) => (
                <li key={index}>{job.title}</li>
              ))}
            </ul>
          ) : (
            <p>No jobs scheduled.</p>
          )}
        </div>
      </div>
    </div>
  );
}
