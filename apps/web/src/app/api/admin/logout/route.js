// apps/web/src/app/api/admin/logout/route.js

export async function POST(c) {
  return c.json({ ok: true, message: 'Logged out' }, 200);
}
