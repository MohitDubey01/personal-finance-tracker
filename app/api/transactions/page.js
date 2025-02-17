"use client";

import { useState, useEffect } from "react";

export default function TransactionsPage() {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);

  // Fetch Transactions from MongoDB
  async function fetchTransactions() {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Handle Form Submission
  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount || !date || !description) return alert("All fields are required!");

    const newTransaction = { amount, date, description };

    // Save to MongoDB
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTransaction),
    });

    if (res.ok) {
      fetchTransactions(); // Refresh transactions list
      setAmount("");
      setDate("");
      setDescription("");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Personal Finance Tracker</h1>

      {/* Transaction Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-4 rounded">
        <div className="mb-2">
          <label className="block text-gray-700">Amount:</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border rounded p-2" required />
        </div>

        <div className="mb-2">
          <label className="block text-gray-700">Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border rounded p-2" required />
        </div>

        <div className="mb-2">
          <label className="block text-gray-700">Description:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded p-2" required />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">Add Transaction</button>
      </form>

      {/* Transactions List */}
      <div className="mt-4 bg-white shadow-md p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-center text-gray-500">No transactions yet.</p>
        ) : (
          <ul>
            {transactions.map((tx, index) => (
              <li key={index} className="border-b p-2">
                ₹{tx.amount} - {tx.description} on {new Date(tx.date).toDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
