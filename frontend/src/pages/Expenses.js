import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

const CATEGORIES = ["Food","Transport","Shopping","Bills","Health","Entertainment","Other"];

const emptyForm = { title: "", amount: "", category: "Food", date: "", description: "" };

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const url = filterCategory ? `/expenses?category=${filterCategory}` : "/expenses";
      const { data } = await API.get(url);
      setExpenses(data.expenses);
    } catch (err) {
      toast.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => { fetchExpenses(); }, [filterCategory]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/expenses/${editId}`, form);
        toast.success("Expense updated!");
        setEditId(null);
      } else {
        await API.post("/expenses", form);
        toast.success("Expense added!");
      }
      setForm(emptyForm);
      fetchExpenses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (exp) => {
    setEditId(exp._id);
    setForm({
      title: exp.title, amount: exp.amount,
      category: exp.category, description: exp.description,
      date: exp.date?.substring(0, 10),
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await API.delete(`/expenses/${id}`);
      toast.success("Expense deleted!");
      fetchExpenses();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>💰 {editId ? "Edit Expense" : "Add Expense"}</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input style={styles.input} name="title" placeholder="Title"
          value={form.title} onChange={handleChange} required />
        <input style={styles.input} name="amount" type="number"
          placeholder="Amount (₹)" value={form.amount} onChange={handleChange} required />
        <select style={styles.input} name="category"
          value={form.category} onChange={handleChange}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input style={styles.input} name="date" type="date"
          value={form.date} onChange={handleChange} />
        <input style={styles.input} name="description"
          placeholder="Description (optional)"
          value={form.description} onChange={handleChange} />
        <button style={styles.btn} type="submit">
          {editId ? "✅ Update Expense" : "➕ Add Expense"}
        </button>
        {editId && (
          <button type="button" style={styles.cancelBtn}
            onClick={() => { setEditId(null); setForm(emptyForm); }}>
            Cancel
          </button>
        )}
      </form>

      {/* Filter */}
      <div style={styles.filterRow}>
        <h3 style={styles.heading}>📋 All Expenses</h3>
        <select style={styles.filter} value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Expense List */}
      {loading ? <p>Loading...</p> : (
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span>Title</span><span>Category</span>
            <span>Date</span><span>Amount</span><span>Actions</span>
          </div>
          {expenses.length === 0 && (
            <p style={{ padding: "20px", textAlign: "center", color: "#888" }}>
              No expenses found!
            </p>
          )}
          {expenses.map((exp) => (
            <div key={exp._id} style={styles.tableRow}>
              <span>{exp.title}</span>
              <span>{exp.category}</span>
              <span>{new Date(exp.date).toLocaleDateString()}</span>
              <span style={{ color: "#e94560", fontWeight: "bold" }}>₹{exp.amount}</span>
              <span>
                <button style={styles.editBtn} onClick={() => handleEdit(exp)}>✏️</button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(exp._id)}>🗑️</button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "24px", maxWidth: "900px", margin: "0 auto" },
  heading: { color: "#1a1a2e" },
  form: {
    display: "flex", flexWrap: "wrap", gap: "12px",
    backgroundColor: "white", padding: "24px",
    borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    marginBottom: "32px",
  },
  input: {
    flex: "1 1 200px", padding: "10px 14px",
    border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px",
  },
  btn: {
    padding: "10px 24px", backgroundColor: "#e94560",
    color: "white", border: "none", borderRadius: "8px",
    cursor: "pointer", fontWeight: "bold",
  },
  cancelBtn: {
    padding: "10px 24px", backgroundColor: "#888",
    color: "white", border: "none", borderRadius: "8px", cursor: "pointer",
  },
  filterRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  filter: { padding: "8px 12px", borderRadius: "8px", border: "1px solid #ddd" },
  table: {
    backgroundColor: "white", borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)", overflow: "hidden",
  },
  tableHeader: {
    display: "flex", justifyContent: "space-between",
    padding: "12px 20px", backgroundColor: "#1a1a2e", color: "white", fontWeight: "bold",
  },
  tableRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 20px", borderBottom: "1px solid #f0f0f0",
  },
  editBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "18px", marginRight: "8px" },
  deleteBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "18px" },
};

export default Expenses;