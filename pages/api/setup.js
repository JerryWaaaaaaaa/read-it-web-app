import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: process.env.SSL_REJECT_UNAUTHORIZED === 'true'
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS clips (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        url TEXT NOT NULL,
        title TEXT,
        timestamp TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    await pool.query(createTableQuery);
    res.json({ message: 'Database setup complete' });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ error: 'Failed to setup database' });
  }
} 