import sql from "@/app/api/utils/sql";

// Get single product
export async function GET(request, context) {
  try {
    const { id } = await context.params;
    const products = await sql`SELECT * FROM products WHERE id = ${id}`;

    if (products.length === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json({ product: products[0] });
  } catch (error) {
    console.error("Error fetching product:", error);
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// Update product
export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    console.log("Updating product ID:", id);
    console.log("Update data:", body);

    const {
      name,
      description,
      price,
      category,
      stock,
      image_url,
      is_featured,
      shipping_cost,
      profit_margin,
      additional_images, // Array of additional image URLs
      detailed_description, // NEW: Long-form detailed description
    } = body;

    // Ensure columns exist
    try {
      await sql`
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC(10,2) DEFAULT 0
      `;
      await sql`
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS profit_margin NUMERIC(5,2) DEFAULT 0
      `;
      await sql`
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS additional_images TEXT
      `;
      await sql`
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS detailed_description TEXT
      `;
      console.log("Columns ensured to exist");
    } catch (migrationError) {
      console.log("Column migration note:", migrationError.message);
    }

    // Convert additional_images array to JSON string for storage
    const additionalImagesJson = additional_images
      ? JSON.stringify(additional_images)
      : null;

    // Update the product
    await sql`
      UPDATE products
      SET 
        name = ${name},
        description = ${description},
        price = ${price},
        category = ${category},
        stock = ${stock},
        image_url = ${image_url},
        is_featured = ${is_featured},
        shipping_cost = ${shipping_cost || 0},
        profit_margin = ${profit_margin || 0},
        additional_images = ${additionalImagesJson},
        detailed_description = ${detailed_description || null}
      WHERE id = ${id}
    `;

    console.log("Product updated, now fetching...");

    // Fetch the updated product
    const updatedProduct = await sql`
      SELECT * FROM products WHERE id = ${id}
    `;

    console.log("Fetched updated product:", updatedProduct);

    if (!updatedProduct || updatedProduct.length === 0) {
      return Response.json(
        { error: "Product not found after update" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, product: updatedProduct[0] });
  } catch (error) {
    console.error("Error updating product:", error);
    console.error("Error stack:", error.stack);
    return Response.json(
      {
        error: "Failed to update product",
        details: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}

// Delete product
export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    const result = await sql`DELETE FROM products WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return Response.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}