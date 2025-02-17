import connectDB from "../../../lib/mongodb";
import Transaction from "../../../models/transaction";

export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find().sort({ date: -1 });
    return Response.json(transactions, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error fetching transactions" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { amount, date, description, category } = await req.json();

    if (!amount || !date || !description || !category) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    const newTransaction = new Transaction({ amount, date, description, category });
    await newTransaction.save();

    return Response.json(newTransaction, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Error creating transaction" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { id } = await req.json();

    if (!id) {
      return Response.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    await Transaction.findByIdAndDelete(id);
    return Response.json({ message: "Transaction deleted successfully" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error deleting transaction" }, { status: 500 });
  }
}
