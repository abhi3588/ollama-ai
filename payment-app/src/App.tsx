import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import type { Payment } from "./Payment";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import parse from "html-react-parser";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [prompt, setPrompt] = useState("");
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [chartJSX, setChartJSX] = useState<string>("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/payments/list")
      .then((response) => setPayments(response.data))
      .catch((error) => {
        console.error("Error fetching payments:", error);
        setErrorMsg(
          "Something went wrong while fetching payments. Please try again later."
        );
      });

    axios
      .get("http://localhost:8080/api/payments/filter?prompt=")
      .then((response) => {
        if (typeof response.data === "string") {
          setChartJSX(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching filtered payments:", error);
        setErrorMsg(
          "Something went wrong while fetching filtered payments. Please try again later."
        );
      });
  }, []);

  // Fetch filtered chart JSX when searchPrompt changes
  useEffect(() => {
    if (searchPrompt === "") return;
    setIsLoading(true);
    setErrorMsg("");
    axios
      .get(
        "http://localhost:8080/api/payments/filter?prompt=" +
          encodeURIComponent(searchPrompt)
      )
      .then((response) => {
        if (typeof response.data === "string") {
          setChartJSX(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching filtered payments:", error);
        setErrorMsg(
          "Something went wrong while filtering payments. Please try again later."
        );
      })
      .finally(() => setIsLoading(false));
  }, [searchPrompt]);

  return (
    <>
      {errorMsg && <div className="error-banner">{errorMsg}</div>}
      <h1>Payment Charts</h1>
      <section className="chart-section">
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter prompt, ex: companyId is TEST1"
            className="filter-input wide-input"
            style={{ flex: 1, marginBottom: 0 }}
          />
          <button
            className="filter-btn"
            onClick={() => setSearchPrompt(prompt)}
            style={{
              height: 40,
              padding: "0 18px",
              fontSize: "1rem",
              borderRadius: 6,
              border: "none",
              background: "#36A2EB",
              color: "#fff",
              cursor: "pointer",
              transition: "background 0.2s",
              position: "relative",
              minWidth: 80,
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span
                className="spinner"
                style={{
                  display: "inline-block",
                  verticalAlign: "middle",
                  width: 20,
                  height: 20,
                }}
              ></span>
            ) : (
              "Filter"
            )}
          </button>
          <button
            className="filter-btn"
            onClick={() => setPrompt("")}
            style={{
              height: 40,
              padding: "0 14px",
              fontSize: "1rem",
              borderRadius: 6,
              border: "none",
              background: "#e0e0e0",
              color: "#333",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            Clear
          </button>
        </div>
        <div className="charts-row">{parse(chartJSX)}</div>
      </section>
      <h2 style={{ textAlign: "left" }}>Payments List</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="payments-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Status</th>
              <th>Company ID</th>
              <th>User ID</th>
              <th>Originating Account</th>
              <th>Recipient Bank ID</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, idx) => (
              <tr key={idx}>
                <td>{payment.paymentId}</td>
                <td>{payment.paymentDate}</td>
                <td>{payment.paymentAmount}</td>
                <td>{payment.currency}</td>
                <td>{payment.paymentStatus}</td>
                <td>{payment.companyId}</td>
                <td>{payment.userId}</td>
                <td>{payment.originatingAccount}</td>
                <td>{payment.recipientBankId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
