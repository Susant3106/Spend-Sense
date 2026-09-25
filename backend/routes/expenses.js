const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const protect = require("../middleware/auth");

// @route   POST /api/expenses
// @desc    Add a new expense
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { title, amount, category, date, description } = req.body;

    const expense = await Expense.create({
      userId: req.user.id,
      title,
      amount,
      category,
      date: date || Date.now(),
      description,
    });

    res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/expenses
// @desc    Get all expenses (with optional category filter)
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const { category } = req.query;

    const filter = { userId: req.user.id };
    if (category) {
      filter.category = category;
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });

    res.status(200).json({
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/expenses/:id
// @desc    Update an expense
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await expense.deleteOne();

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/expenses/summary/monthly
// @desc    Get total expenses grouped by month
// @access  Private
router.get("/summary/monthly", protect, async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      { $match: { userId: require("mongoose").Types.ObjectId.createFromHexString(req.user.id) } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    const months = [
      "", "January", "February", "March", "April",
      "May", "June", "July", "August", "September",
      "October", "November", "December",
    ];

    const formatted = summary.map((item) => ({
      month: months[item._id.month],
      year: item._id.year,
      totalAmount: item.totalAmount,
      expenseCount: item.count,
    }));

    res.status(200).json({ summary: formatted });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/expenses/summary/category
// @desc    Get total expenses grouped by category
// @access  Private
router.get("/summary/category", protect, async (req, res) => {
  try {
    const { month, year } = req.query;

    const matchFilter = {
      userId: require("mongoose").Types.ObjectId.createFromHexString(req.user.id),
    };

    if (month && year) {
      matchFilter.date = {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      };
    }

    const summary = await Expense.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    const formatted = summary.map((item) => ({
      category: item._id,
      totalAmount: item.totalAmount,
      expenseCount: item.count,
    }));

    res.status(200).json({ summary: formatted });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;