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

function sanitize(str, maxLen) {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').replace(/[<>]/g, '').trim().slice(0, maxLen);
}

export default async (req) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers });
  const p = getPool();
  try {
    if (req.method === 'GET') {
      const result = await p.query(`SELECT id, father_name, years, message, submitted_by, anniversary_date, created_at FROM ddc_memorials ORDER BY created_at DESC LIMIT 50`);
      return new Response(JSON.stringify({ entries: result.rows }), { status: 200, headers });
    }
    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      const father_name = sanitize(body.father_name, 200);
      const message = sanitize(body.message, 2000);
      const years = sanitize(body.years, 50) || null;
      const submitted_by = sanitize(body.submitted_by, 100) || 'Anonymous';
      const anniversary_date = body.anniversary_date || null;
      if (!father_name || !message) return new Response(JSON.stringify({ error: 'Father name and message required' }), { status: 400, headers });
      if (father_name.replace(/[^a-zA-Z]/g, '').length < 2) return new Response(JSON.stringify({ error: 'Please enter a valid name' }), { status: 400, headers });
      let validDate = null;
      if (anniversary_date) { const d = new Date(anniversary_date); if (!isNaN(d.getTime())) validDate = anniversary_date; }
      const result = await p.query(
        `INSERT INTO ddc_memorials (father_name, years, message, submitted_by, anniversary_date) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [father_name, years, message, submitted_by, validDate]
      );
      return new Response(JSON.stringify({ entry: result.rows[0] }), { status: 201, headers });
    }
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers });
  }
};
export const config = { path: '/api/memorials' };
