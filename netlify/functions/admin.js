import pg from 'pg';
const { Pool } = pg;

let pool;
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: Buffer.from(process.env.DDC_DB_URL_B64, 'base64').toString(),
      ssl: { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000
    });
  }
  return pool;
}

export default async (req) => {
  const headers = { 'Content-Type': 'application/json' };
  const url = new URL(req.url);
  const key = url.searchParams.get('key');
  
  // Key checked server-side against env var — never exposed to client
  if (key !== process.env.DDC_ADMIN_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
  }
  
  const p = getPool();
  try {
    const waitlist = await p.query(`SELECT id, email, created_at FROM ddc_waitlist ORDER BY created_at DESC`);
    const memorials = await p.query(`SELECT id, father_name, years, message, submitted_by, anniversary_date, created_at FROM ddc_memorials ORDER BY created_at DESC`);
    const wc = waitlist.rows.length;
    const mc = memorials.rows.length;
    const now = Date.now();
    const last24h = waitlist.rows.filter(r => (now - new Date(r.created_at).getTime()) < 86400000).length;
    const last7d = waitlist.rows.filter(r => (now - new Date(r.created_at).getTime()) < 604800000).length;
    
    return new Response(JSON.stringify({
      stats: { totalWaitlist: wc, totalMemorials: mc, last24h, last7d },
      waitlist: waitlist.rows,
      memorials: memorials.rows
    }), { status: 200, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
};
export const config = { path: '/api/admin' };
