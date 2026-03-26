import pg from 'pg';
const { Client } = pg;

export default async (req) => {
  const cs = Buffer.from('cG9zdGdyZXNxbDovL3Bvc3RncmVzLndrcnRianZiamViaGJjand1cmhiOkRpZWdvRGFrb3RhMzc0MiFAYXdzLTEtdXMtZWFzdC0yLnBvb2xlci5zdXBhYmFzZS5jb206NjU0My9wb3N0Z3Jlcw==', 'base64').toString();
  const client = new Client({ connectionString: cs, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 10000 });

  try {
    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS ddc_waitlist (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS ddc_memorials (
        id SERIAL PRIMARY KEY,
        father_name TEXT NOT NULL,
        years TEXT,
        message TEXT NOT NULL,
        submitted_by TEXT DEFAULT 'Anonymous',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.end();
    return new Response(JSON.stringify({ success: true, message: 'DDC tables created' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    try { await client.end(); } catch(e) {}
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const config = { path: '/api/migrate' };
