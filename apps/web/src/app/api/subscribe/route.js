// apps/web/src/app/api/subscribe/route.js

export async function POST(c) {
  return c.json({ ok: true, message: 'Subscribed' }, 200);
}
