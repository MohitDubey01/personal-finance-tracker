import connectDB from "../../..//lib/mongodb";


export async function GET() {
  try {
    await connectDB();
    return Response.json({ message: "MongoDB Connected!" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Database connection failed" }, { status: 500 });
  }
}
