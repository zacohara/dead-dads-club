import pg from 'pg';
const { Client } = pg;
const getClient = () => new Client({
  connectionString: Buffer.from(process.env.DDC_DB_URL_B64, 'base64').toString(),
  ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 10000
});
const ADMIN_KEY = "ddc-kent-2026";

export default async (req) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  const url = new URL(req.url);
  const key = url.searchParams.get('key');
  if (key !== ADMIN_KEY) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
  
  const client = getClient();
  try {
    await client.connect();
    const waitlist = await client.query(`SELECT id, email, created_at FROM ddc_waitlist ORDER BY created_at DESC`);
    const memorials = await client.query(`SELECT id, father_name, years, message, submitted_by, anniversary_date, created_at FROM ddc_memorials ORDER BY created_at DESC`);
    const wCount = waitlist.rows.length;
    const mCount = memorials.rows.length;
    
    // Stats
    const today = new Date();
    const last24h = waitlist.rows.filter(r => (today - new Date(r.created_at)) < 86400000).length;
    const last7d = waitlist.rows.filter(r => (today - new Date(r.created_at)) < 604800000).length;
    
    await client.end();
    return new Response(JSON.stringify({
      stats: { totalWaitlist: wCount, totalMemorials: mCount, last24h, last7d },
      waitlist: waitlist.rows,
      memorials: memorials.rows
    }), { status: 200, headers });
  } catch (err) {
    try { await client.end(); } catch(e) {}
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
};
export const config = { path: '/api/admin' };
