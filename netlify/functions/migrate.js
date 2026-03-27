import pg from 'pg';
const { Client } = pg;
export default async (req) => {
  const cs = Buffer.from(process.env.DDC_DB_URL_B64, 'base64').toString();
  const client = new Client({ connectionString: cs, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 10000 });
  try {
    await client.connect();
    // Delete test/XSS junk
    await client.query(`DELETE FROM ddc_memorials WHERE father_name LIKE '%<script>%' OR father_name LIKE '%AAAA%' OR father_name = 'Test Dad' OR father_name LIKE '%DROP TABLE%'`);
    await client.query(`DELETE FROM ddc_waitlist WHERE email LIKE '%test%' OR email LIKE '%edgecase%'`);
    // Seed Kent's real memorial
    await client.query(`INSERT INTO ddc_memorials (father_name, years, message, submitted_by) VALUES
      ('Robert James Grossi', '1955 – 2008', 'His last words cut deep. But every man I help build is a brick laid on top of that sentence. I carry you, old man.', 'Kent')
      ON CONFLICT DO NOTHING`);
    // Add constraints
    await client.query(`
      DO $$ BEGIN
        ALTER TABLE ddc_memorials ADD CONSTRAINT chk_name_len CHECK (char_length(father_name) <= 200);
      EXCEPTION WHEN duplicate_object THEN null; END $$;
      DO $$ BEGIN
        ALTER TABLE ddc_memorials ADD CONSTRAINT chk_msg_len CHECK (char_length(message) <= 2000);
      EXCEPTION WHEN duplicate_object THEN null; END $$;
      DO $$ BEGIN
        ALTER TABLE ddc_memorials ADD CONSTRAINT chk_by_len CHECK (char_length(submitted_by) <= 100);
      EXCEPTION WHEN duplicate_object THEN null; END $$;
      DO $$ BEGIN
        ALTER TABLE ddc_memorials ADD CONSTRAINT chk_years_len CHECK (char_length(years) <= 50);
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);
    await client.end();
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    try { await client.end(); } catch(e) {}
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
export const config = { path: '/api/migrate' };
