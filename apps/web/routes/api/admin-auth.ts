import type { ActionFunctionArgs } from 'react-router';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const password = body?.password;
    const correctPassword = process.env.ADMIN_PASSWORD || 'changeme123';
    
    console.log('Auth check:', { received: password, expected: correctPassword });
    
    if (password === correctPassword) {
      return new Response(
        JSON.stringify({ ok: true, message: 'Login successful' }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new Response(
      JSON.stringify({ ok: false, error: 'Invalid password' }),
      { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (err: any) {
    console.error('Auth error:', err);
    return new Response(
      JSON.stringify({ ok: false, error: err.message || 'Server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
