import pg from 'pg';
const { Pool } = pg;

let pool;
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: Buffer.from(process.env.DDC_DB_URL_B64, 'base64').toString(),
      ssl: { rejectUnauthorized: false },
      max: 3, idleTimeoutMillis: 10000, connectionTimeoutMillis: 10000
    });
  }
  return pool;
}

export default async (req) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  try {
    const body = await req.json().catch(() => ({}));
    const email = (body.email || '').toLowerCase().trim();
    if (!email || !email.includes('@') || !email.split('@')[1]?.includes('.') || email.length > 254 || email.includes(' ')) {
      return new Response(JSON.stringify({ error: 'Valid email required' }), { status: 400, headers });
    }
    await getPool().query(`INSERT INTO ddc_waitlist (email) VALUES ($1) ON CONFLICT (email) DO NOTHING`, [email]);
    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers });
  }
};
export const config = { path: '/api/waitlist' };
