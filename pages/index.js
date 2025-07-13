import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Dashboard() {
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClips();
  }, []);

  const fetchClips = async () => {
    try {
      const response = await fetch('/api/clips');
      const data = await response.json();
      setClips(data);
    } catch (error) {
      console.error('Error fetching clips:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>ReadIt Dashboard</title>
        <meta name="description" content="Your web clips dashboard" />
      </Head>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          ReadIt Dashboard
        </h1>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading clips...</p>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-6">
              {clips.length} clip{clips.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {clips.map((clip) => (
                <div key={clip.id} className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {clip.title || 'Untitled'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {clip.text.length > 150 
                      ? `${clip.text.substring(0, 150)}...` 
                      : clip.text
                    }
                  </p>
                  <a 
                    href={clip.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Source →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 