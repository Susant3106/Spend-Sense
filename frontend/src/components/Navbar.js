import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>💰 Expense Tracker</h2>
      {user && (
        <div style={styles.links}>
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/expenses" style={styles.link}>Expenses</Link>
          <Link to="/reports" style={styles.link}>Reports</Link>
          <span style={styles.user}>👤 {user.name}</span>
          <button onClick={handleLogout} style={styles.btn}>Logout</button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "12px 24px",
    backgroundColor: "#1a1a2e", color: "white",
  },
  logo: { margin: 0, color: "#e94560" },
  links: { display: "flex", alignItems: "center", gap: "20px" },
  link: { color: "white", textDecoration: "none", fontWeight: "500" },
  user: { color: "#a8dadc" },
  btn: {
    backgroundColor: "#e94560", color: "white",
    border: "none", padding: "8px 16px",
    borderRadius: "6px", cursor: "pointer",
  },
};

export default Navbar;