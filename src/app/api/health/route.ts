import db from "../../../db";

export async function GET() {
  try {
    await db.execute("SELECT 1"); // simple ping query
    return Response.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Database connection failed:", error);
    return Response.json(
      { status: "error", message: "Database connection failed" },
      { status: 500 }
    );
  }
}
