"use client";

import { useEffect, useState } from "react";

interface Movie {
  id: string;
  name: string;
  story: string;
  duration: string;
  stars: string;
  rating: string;
  link: string;
  poster?: string;
  createdAt: string;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await fetch("/api/movies");
      if (res.ok) {
        const data = await res.json();
        setMovies(data);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-black py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-yellow-400">
            موقع الأفلام
          </h1>
          <p className="text-center text-gray-400 mt-2">
            استعرض أحدث الأفلام والمسلسلات
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">جاري التحميل...</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">لا توجد أفلام حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                {movie.poster && (
                  <div className="relative h-80 w-full">
                    <img
                      src={movie.poster}
                      alt={movie.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-bold text-yellow-400 mb-2">
                    {movie.name}
                  </h2>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-yellow-400 font-semibold">
                      {movie.rating}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                    {movie.story}
                  </p>
                  <div className="text-sm text-gray-400 space-y-1 mb-4">
                    <p>⏱️ {movie.duration}</p>
                    <p>⭐ النجوم: {movie.stars}</p>
                  </div>
                  <a
                    href={movie.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded text-center transition-colors"
                  >
                    مشاهدة الفيلم
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-black py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2024 موقع الأفلام. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
