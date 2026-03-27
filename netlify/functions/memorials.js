import pg from 'pg';
const { Client } = pg;
const getClient = () => new Client({
  connectionString: Buffer.from(process.env.DDC_DB_URL_B64, 'base64').toString(),
  ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 10000
});

function sanitize(str, maxLen) {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').replace(/[<>]/g, '').trim().slice(0, maxLen);
}

export default async (req) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers });
  const client = getClient();
  try {
    await client.connect();
    if (req.method === 'GET') {
      const result = await client.query(`SELECT id, father_name, years, message, submitted_by, created_at FROM ddc_memorials ORDER BY created_at DESC LIMIT 50`);
      await client.end();
      return new Response(JSON.stringify({ entries: result.rows }), { status: 200, headers });
    }
    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      const father_name = sanitize(body.father_name, 200);
      const message = sanitize(body.message, 2000);
      const years = sanitize(body.years, 50) || null;
      const submitted_by = sanitize(body.submitted_by, 100) || 'Anonymous';
      if (!father_name || !message) {
        await client.end();
        return new Response(JSON.stringify({ error: 'Father name and message required' }), { status: 400, headers });
      }
      // Reject if name or message is just whitespace/punctuation
      if (father_name.replace(/[^a-zA-Z]/g, '').length < 2) {
        await client.end();
        return new Response(JSON.stringify({ error: 'Please enter a valid name' }), { status: 400, headers });
      }
      const result = await client.query(
        `INSERT INTO ddc_memorials (father_name, years, message, submitted_by) VALUES ($1, $2, $3, $4) RETURNING *`,
        [father_name, years, message, submitted_by]
      );
      await client.end();
      return new Response(JSON.stringify({ entry: result.rows[0] }), { status: 201, headers });
    }
    await client.end();
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  } catch (err) {
    try { await client.end(); } catch(e) {}
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers });
  }
};
export const config = { path: '/api/memorials' };
