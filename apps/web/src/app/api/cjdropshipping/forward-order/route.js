import sql from "../../utils/sql";

export async function POST(request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return Response.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Get API key from database
    const credentialsResult = await sql`
      SELECT password FROM cj_credentials LIMIT 1
    `;

    if (credentialsResult.length === 0 || !credentialsResult[0].password) {
      return Response.json(
        {
          error:
            "CJ API key not configured. Please set it in the admin dashboard.",
        },
        { status: 500 },
      );
    }

    const apiKey = credentialsResult[0].password;

    // Get order details from our database
    const orders = await sql`
      SELECT o.*, 
             json_agg(json_build_object(
               'product_id', oi.product_id,
               'quantity', oi.quantity,
               'price', oi.price
             )) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = ${orderId}
      GROUP BY o.id
    `;

    if (orders.length === 0) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const order = orders[0];

    // Create order in CJdropshipping using API key
    const cjOrderItems = order.items.map((item) => ({
      productId: item.product_id,
      quantity: item.quantity,
    }));

    const createOrderResponse = await fetch(
      "https://developers.cjdropshipping.com/api2.0/v1/shopping/order/createOrder",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CJ-Access-Token": apiKey,
        },
        body: JSON.stringify({
          orderNumber: `ORDER-${order.id}`,
          shippingAddress: {
            firstName: order.full_name.split(" ")[0],
            lastName: order.full_name.split(" ").slice(1).join(" "),
            address: order.address,
            city: order.city,
            zip: order.postal_code,
            country: order.country,
            email: order.email,
          },
          products: cjOrderItems,
        }),
      },
    );

    const createOrderData = await createOrderResponse.json();

    if (!createOrderData.result || createOrderData.code !== 200) {
      return Response.json(
        {
          error: "Failed to create order in CJdropshipping",
          details: createOrderData.message,
        },
        { status: 400 },
      );
    }

    // Update order status in our database
    await sql`
      UPDATE orders
      SET status = 'processing'
      WHERE id = ${orderId}
    `;

    return Response.json({
      success: true,
      cjOrderId: createOrderData.data.orderId,
      message: "Order successfully forwarded to CJdropshipping",
    });
  } catch (error) {
    console.error("Error forwarding order to CJdropshipping:", error);
    return Response.json(
      {
        error: "Failed to forward order to CJdropshipping",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
