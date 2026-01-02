import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    console.log("Fetching cart for session:", sessionId);

    if (!sessionId) {
      return Response.json({ items: [] });
    }

    // Ensure cart table exists
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS cart (
          id SERIAL PRIMARY KEY,
          session_id TEXT NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
    } catch (tableError) {
      console.log("Cart table check:", tableError.message);
    }

    // Get cart items with full product details including shipping_cost and profit_margin
    const items = await sql`
      SELECT 
        cart.id,
        cart.quantity,
        products.id as product_id,
        products.name,
        products.description,
        products.price,
        products.category,
        products.image_url,
        products.stock,
        products.shipping_cost,
        products.profit_margin
      FROM cart
      JOIN products ON cart.product_id = products.id
      WHERE cart.session_id = ${sessionId}
      ORDER BY cart.created_at DESC
    `;

    console.log("Found cart items:", items.length);

    return Response.json({ items });
  } catch (error) {
    console.error("Error fetching cart:", error);
    console.error("Error details:", error.message);
    return Response.json(
      {
        error: "Failed to fetch cart",
        details: error.message,
        items: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { sessionId, productId, quantity } = await request.json();

    console.log("Adding to cart:", { sessionId, productId, quantity });

    // Ensure cart table exists
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS cart (
          id SERIAL PRIMARY KEY,
          session_id TEXT NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
    } catch (tableError) {
      console.log("Cart table check:", tableError.message);
    }

    // Check if item already exists in cart
    const existing = await sql`
      SELECT * FROM cart 
      WHERE session_id = ${sessionId} AND product_id = ${productId}
    `;

    console.log("Existing cart items:", existing);

    if (existing.length > 0) {
      // Update quantity
      await sql`
        UPDATE cart 
        SET quantity = quantity + ${quantity}
        WHERE session_id = ${sessionId} AND product_id = ${productId}
      `;
      console.log("Updated existing cart item");
    } else {
      // Add new item
      await sql`
        INSERT INTO cart (session_id, product_id, quantity)
        VALUES (${sessionId}, ${productId}, ${quantity})
      `;
      console.log("Added new cart item");
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error adding to cart:", error);
    console.error("Error details:", error.message);
    return Response.json(
      {
        error: "Failed to add to cart",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { sessionId, itemId, quantity } = await request.json();

    await sql`
      UPDATE cart 
      SET quantity = ${quantity}
      WHERE id = ${itemId} AND session_id = ${sessionId}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error updating cart:", error);
    return Response.json({ error: "Failed to update cart" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { sessionId, itemId } = await request.json();

    await sql`
      DELETE FROM cart 
      WHERE id = ${itemId} AND session_id = ${sessionId}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return Response.json(
      { error: "Failed to remove from cart" },
      { status: 500 }
    );
  }
}