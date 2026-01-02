import sql from "../../utils/sql";

// Helper function to wait
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to make API calls with retry logic
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options);
    const data = await response.json();

    // If rate limited, wait and retry
    if (data.code === 1600200) {
      const waitTime = Math.min(60000 * Math.pow(2, i), 300000); // Max 5 minutes
      console.log(
        `Rate limited. Waiting ${waitTime / 1000} seconds before retry ${
          i + 1
        }/${maxRetries}...`
      );

      if (i < maxRetries - 1) {
        await wait(waitTime);
        continue;
      }
    }

    return data;
  }
}

// Ensure the database has the required columns
async function ensureDatabaseSchema() {
  try {
    await sql`
      ALTER TABLE cj_credentials 
      ADD COLUMN IF NOT EXISTS access_token TEXT
    `;
    await sql`
      ALTER TABLE cj_credentials 
      ADD COLUMN IF NOT EXISTS token_expiry TIMESTAMP
    `;
    await sql`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC(10,2) DEFAULT 0
    `;
    await sql`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS profit_margin NUMERIC(5,2) DEFAULT 0
    `;
    console.log("Database schema check complete");
  } catch (error) {
    console.error("Schema migration error:", error);
    // Continue anyway - columns might already exist
  }
}

// Function to get or refresh access token
async function getAccessToken() {
  try {
    // Ensure columns exist first
    await ensureDatabaseSchema();

    // Get credentials from database
    const credentialsResult = await sql`
      SELECT email, password, access_token, token_expiry FROM cj_credentials LIMIT 1
    `;

    if (
      credentialsResult.length === 0 ||
      !credentialsResult[0].email ||
      !credentialsResult[0].password
    ) {
      throw new Error(
        "CJ credentials not configured. Please set email and API key in the admin dashboard."
      );
    }

    const {
      email,
      password: apiKey,
      access_token,
      token_expiry,
    } = credentialsResult[0];

    // Check if we have a valid token
    if (access_token && token_expiry) {
      const expiryDate = new Date(token_expiry);
      const now = new Date();

      // If token is still valid (with 1 hour buffer), use it
      if (expiryDate > new Date(now.getTime() + 3600000)) {
        console.log("Using existing access token");
        return access_token;
      }
    }

    // Get new access token
    console.log("Requesting new access token from CJDropshipping...");
    const response = await fetch(
      "https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          apiKey: apiKey,
        }),
      }
    );

    const data = await response.json();

    if (data.code !== 200 || !data.result) {
      console.error("Failed to get access token:", data);
      throw new Error(
        data.message || "Failed to authenticate with CJDropshipping"
      );
    }

    // Store the new token in database
    const newAccessToken = data.data.accessToken;
    const tokenExpiry = data.data.accessTokenExpiryDate;

    await sql`
      UPDATE cj_credentials 
      SET access_token = ${newAccessToken}, 
          token_expiry = ${tokenExpiry},
          updated_at = CURRENT_TIMESTAMP
    `;

    console.log("Successfully obtained new access token");
    return newAccessToken;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
}

export async function POST(request) {
  try {
    const { productId } = await request.json();

    if (!productId) {
      return Response.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Get valid access token
    let accessToken;
    try {
      accessToken = await getAccessToken();
    } catch (error) {
      return Response.json(
        {
          error: "Authentication failed",
          details: error.message,
        },
        { status: 401 }
      );
    }

    // Use access token to fetch product
    let productData = await fetchWithRetry(
      `https://developers.cjdropshipping.com/api2.0/v1/product/list?pid=${encodeURIComponent(
        productId
      )}`,
      {
        method: "GET",
        headers: {
          "CJ-Access-Token": accessToken,
        },
      }
    );

    console.log(
      "CJ Product Response (by PID):",
      JSON.stringify(productData, null, 2)
    );

    // If pid didn't work, try searching by SKU
    if (
      !productData.result ||
      productData.code !== 200 ||
      !productData.data?.list?.length
    ) {
      // Check if it's a rate limit error
      if (productData.code === 1600200) {
        return Response.json(
          {
            error: "CJdropshipping rate limit exceeded",
            details:
              "CJdropshipping allows only 1 request per 5 minutes. Please wait before trying again.",
            code: productData.code,
            retryAfter: 300,
          },
          { status: 429 }
        );
      }

      console.log("Trying to search by SKU instead...");

      productData = await fetchWithRetry(
        `https://developers.cjdropshipping.com/api2.0/v1/product/list?productSku=${encodeURIComponent(
          productId
        )}`,
        {
          method: "GET",
          headers: {
            "CJ-Access-Token": accessToken,
          },
        }
      );

      console.log(
        "CJ Product Response (by SKU):",
        JSON.stringify(productData, null, 2)
      );

      if (!productData.result || productData.code !== 200) {
        // Check if it's a rate limit error
        if (productData.code === 1600200) {
          return Response.json(
            {
              error: "CJdropshipping rate limit exceeded",
              details:
                "CJdropshipping allows only 1 request per 5 minutes. Please wait before trying again.",
              code: productData.code,
              retryAfter: 300,
            },
            { status: 429 }
          );
        }

        if (!productData.data?.list?.length) {
          return Response.json(
            {
              error: "Failed to fetch product from CJdropshipping",
              details:
                productData.message ||
                "Product not found with the given ID or SKU",
              code: productData.code,
              fullResponse: productData,
              hint: "Make sure you're using the correct Product ID (pid) or SKU from CJdropshipping.",
            },
            { status: 404 }
          );
        }
      }
    }

    // Extract first product from the list
    const cjProduct = productData.data.list[0];

    // Get stock quantity - CJ uses different field names
    const stockQuantity =
      cjProduct.variantList?.[0]?.variantQuantity ||
      cjProduct.productStockQuantity ||
      cjProduct.variantQuantity ||
      999; // Default to 999 if no stock info

    console.log("Stock quantity found:", stockQuantity);
    console.log("Full product data:", JSON.stringify(cjProduct, null, 2));

    // Insert product into our database with shipping_cost and profit_margin fields
    const result = await sql`
      INSERT INTO products (name, description, price, image_url, category, stock, is_featured, shipping_cost, profit_margin)
      VALUES (
        ${cjProduct.productNameEn},
        ${cjProduct.productName || cjProduct.productNameEn},
        ${cjProduct.sellPrice || 0},
        ${cjProduct.productImage || ""},
        ${cjProduct.categoryName || "Imported"},
        ${stockQuantity},
        false,
        0,
        0
      )
      RETURNING *
    `;

    return Response.json({
      success: true,
      product: result[0],
      cjProduct: cjProduct,
      message: `Product imported with stock: ${stockQuantity}. You can now edit it to add shipping cost and profit margin.`,
    });
  } catch (error) {
    console.error("Error syncing product from CJdropshipping:", error);
    return Response.json(
      {
        error: "Failed to sync product from CJdropshipping",
        details: error.message,
      },
      { status: 500 }
    );
  }
}