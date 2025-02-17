"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  // Fetch transactions
  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/transactions");
        if (!res.ok) throw new Error("Failed to fetch transactions");
        const data = await res.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchTransactions();
  }, []);

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount || !date || !description) {
      alert("All fields are required!");
      return;
    }

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, date, description }),
      });

      if (!res.ok) throw new Error("Failed to add transaction");

      const newTransaction = await res.json();
      setTransactions([newTransaction, ...transactions]); // Update UI
      setAmount(""); setDate(""); setDescription(""); // Reset form
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Prepare chart data
  const data = transactions.reduce((acc, tx) => {
    const month = new Date(tx.date).toLocaleString("en-US", { month: "short" });
    const existing = acc.find((item) => item.name === month);
    if (existing) {
      existing.amount += tx.amount;
    } else {
      acc.push({ name: month, amount: tx.amount });
    }
    return acc;
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center text-indigo-600">🚀 Personal Finance Tracker</h1>
      <p className="text-xl mt-2 text-center text-gray-500">Track your transactions easily and manage your finances better.</p>

      {/* Transaction Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-6 border p-6 rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-semibold text-gray-700">Add New Transaction</h2>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 mt-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 mt-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 mt-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Add Transaction
        </button>
      </form>

      {/* Transactions List */}
      <div className="mt-12">
        <h2 className="text-3xl font-semibold text-gray-800">Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-lg text-gray-600">No transactions found.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {transactions.map((tx) => (
              <li key={tx._id} className="bg-gray-100 p-5 rounded-lg shadow hover:bg-gray-200 transition duration-200 ease-in-out flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">Amount: ₹{tx.amount}</p>
                  <p className="text-sm text-gray-500">Date: {new Date(tx.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Description: {tx.description}</p>
                </div>
                <button
                  onClick={async () => {
                    await fetch("/api/transactions", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: tx._id }),
                    });
                    setTransactions(transactions.filter((t) => t._id !== tx._id));
                  }}
                  className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Monthly Expenses Chart */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-800">Monthly Expenses</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
