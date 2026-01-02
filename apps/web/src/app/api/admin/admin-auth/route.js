export async function POST(c) {
  try {
    const body = await c.req.json();
    const { password } = body;
    const adminPassword = process.env.ADMIN_PASSWORD;

    console.log("=== Admin Login Debug ===");
    console.log("Password received:", password);
    console.log("ADMIN_PASSWORD at runtime:", adminPassword);
    console.log("Passwords match:", password === adminPassword);

    if (!adminPassword) {
      return c.json(
        { error: "Admin password not configured" },
        500
      );
    }

    if (password !== adminPassword) {
      return c.json({ error: "Invalid password" }, 401);
    }

    const response = c.json({ success: true });
    response.headers.set("Set-Cookie", "admin_auth=authenticated; Path=/; HttpOnly; SameSite=None; Max-Age=86400; Secure");

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Login failed" }, 500);
  }
}
