import sql from "../../utils/sql";

// Get CJ credentials
export async function GET(request) {
  try {
    // Run migration to add profit_margin column if it doesn't exist
    try {
      await sql`
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS profit_margin NUMERIC(5,2) DEFAULT 0
      `;
      console.log("Profit margin column check complete");
    } catch (migrationError) {
      console.error("Migration warning:", migrationError);
    }

    const result = await sql`
      SELECT email, password FROM cj_credentials LIMIT 1
    `;

    if (result.length === 0) {
      return Response.json({ exists: false });
    }

    return Response.json({
      exists: true,
      email: result[0].email,
      password: result[0].password,
    });
  } catch (error) {
    console.error("Error fetching CJ credentials:", error);
    return Response.json(
      { error: "Failed to fetch credentials" },
      { status: 500 }
    );
  }
}

// Save or update CJ credentials
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Delete any existing credentials and insert new ones
    await sql`DELETE FROM cj_credentials`;

    const result = await sql`
      INSERT INTO cj_credentials (email, password, updated_at)
      VALUES (${email}, ${password}, CURRENT_TIMESTAMP)
      RETURNING email
    `;

    return Response.json({
      success: true,
      email: result[0].email,
    });
  } catch (error) {
    console.error("Error saving CJ credentials:", error);
    return Response.json(
      { error: "Failed to save credentials" },
      { status: 500 }
    );
  }
}