import pg from 'pg';
const { Client } = pg;
export default async (req) => {
  const cs = Buffer.from(process.env.DDC_DB_URL_B64, 'base64').toString();
  const client = new Client({ connectionString: cs, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 10000 });
  try {
    await client.connect();
    await client.query(`DELETE FROM ddc_memorials WHERE father_name = 'Test Anniversary Dad'`);
    await client.end();
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) { try { await client.end(); } catch(e) {} return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } }); }
};
export const config = { path: '/api/migrate' };
