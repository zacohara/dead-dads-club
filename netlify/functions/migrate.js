import pg from 'pg';
const { Client } = pg;
export default async (req) => {
  const cs = Buffer.from(process.env.DDC_DB_URL_B64, 'base64').toString();
  const client = new Client({ connectionString: cs, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 10000 });
  try {
    await client.connect();
    // Add anniversary_date column
    await client.query(`ALTER TABLE ddc_memorials ADD COLUMN IF NOT EXISTS anniversary_date DATE`);
    // Clean test/junk data
    await client.query(`DELETE FROM ddc_memorials WHERE father_name LIKE '%alert%' OR father_name LIKE '%script%' OR father_name LIKE '%AAAA%' OR father_name = 'Test Dad' OR father_name LIKE '%DROP%'`);
    await client.query(`DELETE FROM ddc_waitlist WHERE email LIKE '%test%' OR email LIKE '%edgecase%' OR email LIKE '%verify%' OR email LIKE '%final%' OR email LIKE '%check%'`);
    const wc = await client.query(`SELECT COUNT(*) as c FROM ddc_waitlist`);
    const mc = await client.query(`SELECT COUNT(*) as c FROM ddc_memorials`);
    await client.end();
    return new Response(JSON.stringify({ success: true, waitlist: wc.rows[0].c, memorials: mc.rows[0].c }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    try { await client.end(); } catch(e) {}
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
export const config = { path: '/api/migrate' };
