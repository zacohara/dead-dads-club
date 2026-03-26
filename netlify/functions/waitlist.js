import pg from 'pg';
const { Client } = pg;

const getClient = () => new Client({
  connectionString: Buffer.from(process.env.DDC_DB_URL_B64, 'base64').toString(),
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000
});

export default async (req) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  if (req.method === 'OPTIONS') {
    return new Response('', { status: 200, headers: { ...headers, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  const client = getClient();
  try {
    const { email } = await req.json();
    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Valid email required' }), { status: 400, headers });
    }

    await client.connect();
    await client.query(
      `INSERT INTO ddc_waitlist (email) VALUES ($1) ON CONFLICT (email) DO NOTHING`,
      [email.toLowerCase().trim()]
    );
    await client.end();

    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  } catch (err) {
    try { await client.end(); } catch(e) {}
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
};

export const config = { path: '/api/waitlist' };
