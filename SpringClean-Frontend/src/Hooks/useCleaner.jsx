import { useEffect, useState } from "react";

export default function useCustomer() {
  const [cleaner, setCleaner] = useState(null);

  useEffect(() => {
    const cleanerId = localStorage.getItem("userId");
    const type = localStorage.getItem("type");

    if (!cleanerId || type !== "cleaner") {
      console.error("No cleaner ID found in localStorage");
      return;
    }

    fetch(`http://localhost:8080/api/cleaners/${cleanerId}`)
      .then((res) => res.json())
      .then((data) => setCleaner(data))
      .catch((err) => console.error("Error fetching customer:", err));
  }, []);

  return cleaner;
}
