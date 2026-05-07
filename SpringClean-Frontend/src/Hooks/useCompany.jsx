import { useEffect, useState } from "react";

export default function useCleaner() {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const companyCleanerId = localStorage.getItem("userId");
    const type = localStorage.getItem("type");

    if (!companyCleanerId || type !== "company") {
      console.error("No company ID found in localStorage");
      return;
    }

    fetch(`http://localhost:8080/api/company-cleaners/${companyCleanerId}`)
      .then((res) => res.json())
      .then((data) => setCompany(data))
      .catch((err) => console.error("Error fetching cleaner:", err));
  }, []);

  return company;
}
