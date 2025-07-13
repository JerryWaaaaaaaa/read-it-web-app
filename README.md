# ReadIt Web App

Dashboard for managing web clips collected by the ReadIt Chrome extension.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file with your database configuration:
```env
DATABASE_URL=your_neon_db_connection_string
SSL_REJECT_UNAUTHORIZED=false
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

- `GET /api/clips` - Fetch all clips
- `POST /api/clips` - Save a new clip
- `POST /api/setup` - Initialize database table

## Deployment

This app can be deployed to Vercel with the following environment variables:
- `DATABASE_URL`
- `SSL_REJECT_UNAUTHORIZED` 