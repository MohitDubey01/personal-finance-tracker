"use client"; // Needed for fetching and handling form data on the client side
import { useEffect, useState } from "react";

export default function Home() {
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

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">🚀 Personal Finance Tracker</h1>
      <p className="text-lg mt-2">Track your transactions easily.</p>

      {/* Transaction Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4 border p-4 rounded-md shadow">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Add Transaction
        </button>
      </form>

      {/* Transactions List */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold">Transactions</h2>
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {transactions.map((tx) => (
              <li key={tx._id} className="border p-3 rounded-md flex justify-between items-center">
                <div>
                  <p><strong>Amount:</strong> ₹{tx.amount}</p>
                  <p><strong>Date:</strong> {new Date(tx.date).toLocaleDateString()}</p>
                  <p><strong>Description:</strong> {tx.description}</p>
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
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
