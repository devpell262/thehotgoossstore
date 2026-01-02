export async function GET(request) {
  const cookies = request.headers.get("cookie") || "";
  const isAuthenticated = cookies.includes("admin_auth=authenticated");

  console.log("=== Auth Check Debug ===");
  console.log("Cookies received:", cookies);
  console.log("Is authenticated:", isAuthenticated);
  console.log("=======================");

  return Response.json({ authenticated: isAuthenticated });
}
