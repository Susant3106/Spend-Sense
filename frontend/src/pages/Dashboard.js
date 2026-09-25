import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, sumRes] = await Promise.all([
          API.get("/expenses"),
          API.get("/expenses/summary/category"),
        ]);
        setExpenses(expRes.data.expenses);
        setSummary(sumRes.data.summary);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (loading) return <h3 style={{ textAlign: "center", marginTop: "40px" }}>Loading...</h3>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>👋 Welcome, {user?.name}!</h2>

      {/* Summary Cards */}
      <div style={styles.cardRow}>
        <div style={{ ...styles.card, backgroundColor: "#e94560" }}>
          <h4>Total Expenses</h4>
          <h2>₹{total}</h2>
        </div>
        <div style={{ ...styles.card, backgroundColor: "#1a1a2e" }}>
          <h4>Transactions</h4>
          <h2>{expenses.length}</h2>
        </div>
        <div style={{ ...styles.card, backgroundColor: "#16213e" }}>
          <h4>Categories Used</h4>
          <h2>{summary.length}</h2>
        </div>
      </div>

      {/* Category Breakdown */}
      <h3 style={styles.subHeading}>📊 Category Breakdown</h3>
      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span>Category</span>
          <span>Transactions</span>
          <span>Total Amount</span>
        </div>
        {summary.map((item) => (
          <div key={item.category} style={styles.tableRow}>
            <span>{item.category}</span>
            <span>{item.expenseCount}</span>
            <span>₹{item.totalAmount}</span>
          </div>
        ))}
      </div>

      {/* Recent Expenses */}
      <h3 style={styles.subHeading}>🕐 Recent Expenses</h3>
      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span>Title</span>
          <span>Category</span>
          <span>Date</span>
          <span>Amount</span>
        </div>
        {expenses.slice(0, 5).map((exp) => (
          <div key={exp._id} style={styles.tableRow}>
            <span>{exp.title}</span>
            <span>{exp.category}</span>
            <span>{new Date(exp.date).toLocaleDateString()}</span>
            <span style={{ color: "#e94560", fontWeight: "bold" }}>₹{exp.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "24px", maxWidth: "900px", margin: "0 auto" },
  heading: { color: "#1a1a2e", marginBottom: "24px" },
  subHeading: { color: "#1a1a2e", marginTop: "32px", marginBottom: "16px" },
  cardRow: { display: "flex", gap: "16px", flexWrap: "wrap" },
  card: {
    flex: 1, minWidth: "180px", padding: "20px",
    borderRadius: "12px", color: "white", textAlign: "center",
  },
  table: {
    backgroundColor: "white", borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)", overflow: "hidden",
  },
  tableHeader: {
    display: "flex", justifyContent: "space-between",
    padding: "12px 20px", backgroundColor: "#1a1a2e",
    color: "white", fontWeight: "bold",
  },
  tableRow: {
    display: "flex", justifyContent: "space-between",
    padding: "12px 20px", borderBottom: "1px solid #f0f0f0",
  },
};

export default Dashboard;