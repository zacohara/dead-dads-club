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
    return new Response('', { status: 200, headers: { ...headers, 'Access-Control-Allow-Methods': 'GET,POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
  }

  const client = getClient();

  try {
    await client.connect();

    if (req.method === 'GET') {
      const result = await client.query(
        `SELECT id, father_name, years, message, submitted_by, created_at FROM ddc_memorials ORDER BY created_at DESC LIMIT 50`
      );
      await client.end();
      return new Response(JSON.stringify({ entries: result.rows }), { status: 200, headers });
    }

    if (req.method === 'POST') {
      const { father_name, years, message, submitted_by } = await req.json();
      if (!father_name || !message) {
        await client.end();
        return new Response(JSON.stringify({ error: 'Father name and message required' }), { status: 400, headers });
      }

      const result = await client.query(
        `INSERT INTO ddc_memorials (father_name, years, message, submitted_by) VALUES ($1, $2, $3, $4) RETURNING *`,
        [father_name.trim(), years?.trim() || null, message.trim(), submitted_by?.trim() || 'Anonymous']
      );
      await client.end();
      return new Response(JSON.stringify({ entry: result.rows[0] }), { status: 201, headers });
    }

    await client.end();
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  } catch (err) {
    try { await client.end(); } catch(e) {}
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
};

export const config = { path: '/api/memorials' };
