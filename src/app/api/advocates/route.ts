import db from "../../../db";
import { advocates } from "../../../db/schema";
import { sql } from "drizzle-orm";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || String(DEFAULT_PAGE), 10);
    const limit = parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT), 10);
    const offset = (page - 1) * limit;

    // main paginated data
    const data = await db.select().from(advocates).limit(limit).offset(offset);

    // total count for more precise pagination
    const [{ count }] = await db.execute(
      sql`SELECT COUNT(*)::int AS count FROM advocates`
    );

    return Response.json(
      {
        data,
        page,
        limit,
        total: count,
        hasMore: offset + data.length < count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching advocates:", error);
    return Response.json(
      { error: "Failed to fetch advocates" },
      { status: 500 }
    );
  }
}
