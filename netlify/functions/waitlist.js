import pg from 'pg';
const { Client } = pg;
const getClient = () => new Client({
  connectionString: Buffer.from(process.env.DDC_DB_URL_B64, 'base64').toString(),
  ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 10000
});
export default async (req) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  const client = getClient();
  try {
    const body = await req.json().catch(() => ({}));
    const email = (body.email || '').toLowerCase().trim();
    // Validate email: has @, has dot after @, no spaces, reasonable length
    if (!email || !email.includes('@') || !email.split('@')[1]?.includes('.') || email.length > 254 || email.includes(' ')) {
      return new Response(JSON.stringify({ error: 'Valid email required' }), { status: 400, headers });
    }
    await client.connect();
    await client.query(`INSERT INTO ddc_waitlist (email) VALUES ($1) ON CONFLICT (email) DO NOTHING`, [email]);
    await client.end();
    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  } catch (err) {
    try { await client.end(); } catch(e) {}
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers });
  }
};
export const config = { path: '/api/waitlist' };
