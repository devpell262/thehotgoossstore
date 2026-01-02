import sql from "@/app/api/utils/sql";

// Get all products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    let query = "SELECT * FROM products WHERE 1=1";
    const params = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (featured === "true") {
      query += " AND is_featured = true";
    }

    query += " ORDER BY created_at DESC";

    const products = await sql(query, params);

    return Response.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

// Create a new product (for admin dashboard)
export async function POST(request) {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      image_url,
      is_featured,
    } = await request.json();

    if (!name || !price || !image_url || stock === undefined) {
      return Response.json(
        { error: "Name, price, image_url, and stock are required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO products (name, description, price, category, stock, image_url, is_featured)
      VALUES (
        ${name},
        ${description || null},
        ${price},
        ${category || null},
        ${stock},
        ${image_url},
        ${is_featured || false}
      )
      RETURNING *
    `;

    return Response.json({ success: true, product: result[0] });
  } catch (error) {
    console.error("Error creating product:", error);
    return Response.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
