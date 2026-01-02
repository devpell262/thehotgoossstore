import type { IncomingMessage, ServerResponse } from "http";
import sql from "../../../utils/sql";

export default async function handler(
  req: IncomingMessage & { method?: string },
  res: ServerResponse & { setHeader: (name: string, value: string) => void }
) {
  try {
    if (req.method !== "POST") {
      res.statusCode = 405;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    }

    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const data = JSON.parse(body || "{}") as {
        title: string;
        description: string;
        price: number;
        shipping_cost: number;
        categories?: string;
      };

      await sql`
        INSERT INTO products (title, description, price, shipping_cost, categories)
        VALUES (${data.title}, ${data.description}, ${data.price}, ${data.shipping_cost}, ${data.categories ?? ""})
      `;

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ ok: true }));
    });
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
}
