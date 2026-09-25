import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import API from "../api/axios";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Reports = () => {
  const [monthly, setMonthly] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [mRes, cRes] = await Promise.all([
          API.get("/expenses/summary/monthly"),
          API.get("/expenses/summary/category"),
        ]);
        setMonthly(mRes.data.summary);
        setCategory(cRes.data.summary);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReports();
  }, []);

  const barData = {
    labels: monthly.map((m) => `${m.month} ${m.year}`),
    datasets: [{
      label: "Total Spending (₹)",
      data: monthly.map((m) => m.totalAmount),
      backgroundColor: "#e94560",
      borderRadius: 8,
    }],
  };

  const pieData = {
    labels: category.map((c) => c.category),
    datasets: [{
      data: category.map((c) => c.totalAmount),
      backgroundColor: ["#e94560","#1a1a2e","#16213e","#0f3460","#a8dadc","#457b9d","#e63946"],
    }],
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📈 Expense Reports</h2>

      <div style={styles.chartRow}>
        <div style={styles.chartBox}>
          <h3 style={styles.subHeading}>📅 Monthly Spending</h3>
          {monthly.length > 0
            ? <Bar data={barData} />
            : <p style={styles.empty}>No data available</p>}
        </div>
        <div style={styles.chartBox}>
          <h3 style={styles.subHeading}>🍕 Category Breakdown</h3>
          {category.length > 0
            ? <Pie data={pieData} />
            : <p style={styles.empty}>No data available</p>}
        </div>
      </div>

      {/* Monthly Table */}
      <h3 style={styles.subHeading}>📊 Monthly Summary Table</h3>
      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span>Month</span><span>Year</span>
          <span>Transactions</span><span>Total Amount</span>
        </div>
        {monthly.map((m) => (
          <div key={`${m.month}-${m.year}`} style={styles.tableRow}>
            <span>{m.month}</span><span>{m.year}</span>
            <span>{m.expenseCount}</span>
            <span style={{ color: "#e94560", fontWeight: "bold" }}>₹{m.totalAmount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "24px", maxWidth: "900px", margin: "0 auto" },
  heading: { color: "#1a1a2e", marginBottom: "24px" },
  subHeading: { color: "#1a1a2e", marginBottom: "16px" },
  chartRow: { display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "32px" },
  chartBox: {
    flex: 1, minWidth: "280px", backgroundColor: "white",
    padding: "24px", borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  empty: { textAlign: "center", color: "#888" },
  table: {
    backgroundColor: "white", borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)", overflow: "hidden",
  },
  tableHeader: {
    display: "flex", justifyContent: "space-between",
    padding: "12px 20px", backgroundColor: "#1a1a2e", color: "white", fontWeight: "bold",
  },
  tableRow: {
    display: "flex", justifyContent: "space-between",
    padding: "12px 20px", borderBottom: "1px solid #f0f0f0",
  },
};

export default Reports;