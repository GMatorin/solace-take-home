import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function POST() {
  try {
    const existing = await db.select().from(advocates);
    if (existing.length > 0) {
      return Response.json(
        { message: "Seed already exists. Skipping insert." },
        { status: 200 }
      );
    }

    await db.insert(advocates).values(advocateData);
    return Response.json({ message: "Seed inserted successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error seeding advocates:", error);
    return Response.json(
      { error: "Failed to seed data" },
      { status: 500 }
    );
  }
}
