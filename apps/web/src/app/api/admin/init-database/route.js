import sql from '@/utils/sql';

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@thehotgoss.store';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'changeme123';

export async function GET(c) {
  try {
    // products
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        cj_product_id TEXT,
        title TEXT NOT NULL,
        description TEXT,
        price_cents INTEGER NOT NULL,
        shipping_cents INTEGER NOT NULL,
        profit_margin NUMERIC(5,2) DEFAULT 0,
        images JSONB DEFAULT '[]'::jsonb,
        categories TEXT[] DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // cart
    await sql`
      CREATE TABLE IF NOT EXISTS cart (
        id SERIAL PRIMARY KEY,
        session_id TEXT NOT NULL,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        variant_id INTEGER,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // admin_users
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // cj_credentials
    await sql`
      CREATE TABLE IF NOT EXISTS cj_credentials (
        id SERIAL PRIMARY KEY,
        api_key TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // email_subscribers
    await sql`
      CREATE TABLE IF NOT EXISTS email_subscribers (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // product_variants
    await sql`
      CREATE TABLE IF NOT EXISTS product_variants (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        cj_variant_id TEXT,
        sku TEXT,
        option_values JSONB DEFAULT '[]'::jsonb,
        price_cents INTEGER NOT NULL,
        shipping_cents INTEGER NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // variant_options
    await sql`
      CREATE TABLE IF NOT EXISTS variant_options (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        name TEXT NOT NULL
      );
    `;

    // variant_option_values
    await sql`
      CREATE TABLE IF NOT EXISTS variant_option_values (
        id SERIAL PRIMARY KEY,
        option_id INTEGER REFERENCES variant_options(id) ON DELETE CASCADE,
        value TEXT NOT NULL
      );
    `;

    // Seed admin if none exists
    const admins = await sql`SELECT id FROM admin_users LIMIT 1;`;
    if (admins.length === 0) {
      await sql`
        INSERT INTO admin_users (email, password_hash)
        VALUES (${ADMIN_EMAIL}, ${ADMIN_PASSWORD});
      `;
    }

    return c.json(
      {
        ok: true,
        message: 'Database initialized. Tables created and admin seeded.',
        admin: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
      },
      200
    );
  } catch (err) {
    console.error('INIT DATABASE ERROR', err);
    return c.json(
      { ok: false, error: err.message || 'Unknown error' },
      500
    );
  }
}
