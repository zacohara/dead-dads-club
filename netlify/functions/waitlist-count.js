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
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    const p = getPool();
    const result = await p.query(`SELECT COUNT(*) as count FROM ddc_waitlist`);
    const recent = await p.query(`SELECT email, created_at FROM ddc_waitlist ORDER BY created_at DESC LIMIT 5`);
    const recentJoins = recent.rows.map(r => ({
      name: r.email.split('@')[0].charAt(0).toUpperCase() + r.email.split('@')[0].slice(1, 4) + '***',
      time: r.created_at
    }));
    return new Response(JSON.stringify({ count: parseInt(result.rows[0].count), recent: recentJoins }), { status: 200, headers });
  } catch (err) {
    return new Response(JSON.stringify({ count: 0, recent: [] }), { status: 200, headers });
  }
};
export const config = { path: '/api/waitlist-count' };
