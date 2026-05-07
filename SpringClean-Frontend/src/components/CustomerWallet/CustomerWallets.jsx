import { useEffect, useState } from "react";
import "./CustomerWallets.css";
import useCustomer from "../../Hooks/useCustomer";

export default function Wallet() {
  const paymentMethods = [
    {
      id: "mobileWallet",
      label: "Wallet",
      icon: "https://cdn-icons-png.flaticon.com/128/1796/1796819.png",
    },
  ];

  const customer = useCustomer();

  const [balances, setBalances] = useState({ mobileWallet: 0 });
  const [history, setHistory] = useState([]);
  const [activeMethod, setActiveMethod] = useState("mobileWallet");

  // Fetch balance
  useEffect(() => {
    if (!customer?.customerId) return;

    const fetchBalance = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/wallet/${customer.customerId}/balance`
        );
        const data = await res.json();
        setBalances({ mobileWallet: data.walletBalance });
      } catch (err) {
        console.error("Error fetching wallet balance:", err);
      }
    };

    fetchBalance();
  }, [customer]);

  // Fetch history
  useEffect(() => {
    if (!customer?.customerId) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/payments/customer/${customer.customerId}`
        );
        const data = await res.json();

        const mapped = data.map((tx) => ({
          id: tx.paymentId,
          date: new Date(tx.paidAt).toLocaleDateString(),
          time: new Date(tx.paidAt).toLocaleTimeString(),
          paymentMethod: tx.method,
          amount: tx.amount,
          status: tx.status,
        }));

        setHistory(mapped);
      } catch (err) {
        console.error("Error fetching wallet history:", err);
      }
    };

    fetchHistory();
  }, [customer]);

  const negativeOrPositive = (status, amount) => {
    const isPayment = status === "Paid";

    // Apply different classes for payment (debit) vs. refill (credit)
    const className = isPayment ? "amount-debit" : "amount-credit";
    const sign = isPayment ? "₱ -" : "₱ +";

    return (
      <td className={className}>
        {sign}
        {amount.toLocaleString()}
      </td>
    );
  };

  return (
    <div className="wallet-wrapper">
      {/* HEADER */}
      <header className="wallet-header">
        <h1>Wallet</h1>
        <p className="wallet-subtitle">View your balance & recent activity</p>
      </header>

      {/* CONTENT WRAPPER */}
      <div className="wallet-content">
        {/* Left Section – Balance */}
        <div className="wallet-left">
          {/* Method Buttons */}
          <div className="wallet-tabs">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                className={`wallet-tab ${
                  activeMethod === method.id ? "active" : ""
                }`}
                onClick={() => setActiveMethod(method.id)}
              >
                <img src={method.icon} alt="" />
                {method.label}
              </button>
            ))}
          </div>

          {/* Balance Card */}
          <div className="wallet-card">
            <div className="wallet-card-header">
              <img
                src={paymentMethods.find((m) => m.id === activeMethod)?.icon}
                alt=""
              />
              <span>
                {paymentMethods.find((m) => m.id === activeMethod)?.label}
              </span>
            </div>

            <div className="wallet-balance">
              <p>Available Balance</p>
              <h1>₱ {balances[activeMethod].toLocaleString()}</h1>
            </div>
          </div>
        </div>

        {/* Right Section – History */}
        <div className="wallet-right">
          <h2 className="history-title">Transaction History</h2>

          {history.length === 0 ? (
            <p className="history-empty">No transactions yet.</p>
          ) : (
            <div className="table-wrapper">
              <table className="history-table">
                {/* Fixed missing <thead> tag */}
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((tx) => (
                    <tr key={tx.id}>
                      <td>{tx.date}</td>
                      <td>{tx.time}</td>
                      <td>{tx.paymentMethod}</td>
                      {negativeOrPositive(tx.status, tx.amount)}
                      <td className={`status ${tx.status.toLowerCase()}`}>
                        {tx.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Closing div for wallet-right */}
      </div>
    </div>
  );
}
