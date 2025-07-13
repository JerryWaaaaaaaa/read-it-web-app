import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: process.env.SSL_REJECT_UNAUTHORIZED === 'true'
  }
});

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Basic rate limiting (optional)
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`Request from IP: ${clientIP}`);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { text, url, title, timestamp } = req.body;
      
      // Validate required fields
      if (!text || !url) {
        return res.status(400).json({ error: 'Text and URL are required' });
      }
      
      // Insert into database
      const query = `
        INSERT INTO clips (text, url, title, timestamp, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING id
      `;
      
      const result = await pool.query(query, [text, url, title, timestamp]);
      
      res.json({
        success: true,
        id: result.rows[0].id,
        message: 'Clip saved successfully'
      });
      
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to save clip' });
    }
  } else if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM clips ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to fetch clips' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 