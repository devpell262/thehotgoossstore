import type { LoaderFunction } from 'react-router';
import sql from '../../../src/utils/sql';

export const loader: LoaderFunction = async () => {
  try {
    await sql`CREATE TABLE IF NOT EXISTS products (
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
    );`;

    await sql`CREATE TABLE IF NOT EXISTS cart (
      id SERIAL PRIMARY KEY,
      session_id TEXT NOT NULL,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );`;

    return Response.json({ ok: true, message: 'Database initialized' });
  } catch (err: any) {
    console.error('INIT DATABASE ERROR', err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
};
