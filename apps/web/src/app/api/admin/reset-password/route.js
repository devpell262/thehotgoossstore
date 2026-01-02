import sql from "../../utils/sql";
import crypto from "crypto";

export async function POST(request) {
  try {
    const { username, newPassword } = await request.json();

    if (!username || !newPassword) {
      return Response.json(
        { error: "Username and new password are required" },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = crypto
      .createHash("sha256")
      .update(newPassword)
      .digest("hex");

    // Check if admin user exists
    const existing = await sql`
      SELECT * FROM admin_users WHERE username = ${username}
    `;

    if (existing.length > 0) {
      // Update existing user
      await sql`
        UPDATE admin_users 
        SET password = ${hashedPassword}
        WHERE username = ${username}
      `;

      return Response.json({
        success: true,
        message: `Password updated for admin: ${username}`,
      });
    } else {
      // Create new admin user
      await sql`
        INSERT INTO admin_users (username, password)
        VALUES (${username}, ${hashedPassword})
      `;

      return Response.json({
        success: true,
        message: `New admin created: ${username}`,
      });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    return Response.json(
      {
        error: "Failed to reset password",
        details: error.message,
      },
      { status: 500 }
    );
  }
}