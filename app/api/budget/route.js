import connectDB from "../../../lib/mongodb";
import Budget from "../../../models/budget";


export async function GET() {
  try {
    await connectDB();
    const budgets = await Budget.find();
    return Response.json(budgets, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error fetching budgets" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { category, budget } = await req.json();

    if (!category || !budget) {
      return Response.json({ error: "Category and budget are required" }, { status: 400 });
    }

    const existingBudget = await Budget.findOne({ category });

    if (existingBudget) {
      existingBudget.budget = budget;
      await existingBudget.save();
      return Response.json(existingBudget, { status: 200 });
    }

    const newBudget = new Budget({ category, budget });
    await newBudget.save();

    return Response.json(newBudget, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Error setting budget" }, { status: 500 });
  }
}
