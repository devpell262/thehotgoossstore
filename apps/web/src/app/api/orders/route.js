import sql from "@/app/api/utils/sql";

// Get all orders (for admin dashboard)
export async function GET(request) {
  try {
    const orders = await sql`
      SELECT * FROM orders
      ORDER BY created_at DESC
    `;

    return Response.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// Create order
export async function POST(request) {
  try {
    const {
      email,
      fullName,
      address,
      city,
      postalCode,
      country,
      items,
      totalAmount,
    } = await request.json();

    if (
      !email ||
      !fullName ||
      !address ||
      !city ||
      !postalCode ||
      !country ||
      !items ||
      !totalAmount
    ) {
      return Response.json({ error: "All fields required" }, { status: 400 });
    }

    // Create order and order items in a transaction
    const result = await sql.transaction(async (txn) => {
      // Insert order
      const orders = await txn`
        INSERT INTO orders (email, full_name, address, city, postal_code, country, total_amount)
        VALUES (${email}, ${fullName}, ${address}, ${city}, ${postalCode}, ${country}, ${totalAmount})
        RETURNING id
      `;

      const orderId = orders[0].id;

      // Insert order items
      for (const item of items) {
        await txn`
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES (${orderId}, ${item.product_id}, ${item.quantity}, ${item.price})
        `;
      }

      return orderId;
    });

    return Response.json({ success: true, orderId: result });
  } catch (error) {
    console.error("Error creating order:", error);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}
