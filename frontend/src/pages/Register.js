import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      toast.success("Registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>💰 Create Account</h2>
        <p style={styles.sub}>Start tracking your expenses</p>
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input} type="text"
            name="name" placeholder="Full Name"
            value={form.name} onChange={handleChange} required
          />
          <input
            style={styles.input} type="email"
            name="email" placeholder="Email"
            value={form.email} onChange={handleChange} required
          />
          <input
            style={styles.input} type="password"
            name="password" placeholder="Password (min 6 chars)"
            value={form.password} onChange={handleChange} required
          />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p style={styles.switch}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh", display: "flex",
    justifyContent: "center", alignItems: "center",
    backgroundColor: "#f0f2f5",
  },
  card: {
    backgroundColor: "white", padding: "40px",
    borderRadius: "12px", width: "100%", maxWidth: "400px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  title: { textAlign: "center", color: "#1a1a2e", marginBottom: "4px" },
  sub: { textAlign: "center", color: "#888", marginBottom: "24px" },
  input: {
    width: "100%", padding: "12px", marginBottom: "16px",
    border: "1px solid #ddd", borderRadius: "8px",
    fontSize: "14px", boxSizing: "border-box",
  },
  btn: {
    width: "100%", padding: "12px", backgroundColor: "#e94560",
    color: "white", border: "none", borderRadius: "8px",
    fontSize: "16px", cursor: "pointer", fontWeight: "bold",
  },
  switch: { textAlign: "center", marginTop: "16px", color: "#888" },
};

export default Register;