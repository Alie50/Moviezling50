"use client";

import { useEffect, useState, useRef } from "react";

interface Movie {
  id: string;
  name: string;
  story: string;
  duration: string;
  stars: string;
  rating: string;
  link: string;
  poster?: string;
}

export default function AdminDashboard() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    story: "",
    duration: "",
    stars: "",
    rating: "",
    link: "",
    posterUrl: "",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/check");
      if (res.ok) {
        setIsAuthenticated(true);
        fetchMovies();
      } else {
        window.location.href = "/admin/login";
      }
    } catch (error) {
      window.location.href = "/admin/login";
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("story", formData.story);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("stars", formData.stars);
      formDataToSend.append("rating", formData.rating);
      formDataToSend.append("link", formData.link);

      if (editingMovie) {
        const posterFile = fileInputRef.current?.files?.[0];
        if (posterFile) {
          formDataToSend.append("posterFile", posterFile);
        } else if (formData.posterUrl !== editingMovie.poster) {
          formDataToSend.append("posterUrl", formData.posterUrl);
        }

        const res = await fetch(`/api/movies/${editingMovie.id}`, {
          method: "PUT",
          body: formDataToSend,
        });

        if (res.ok) {
          fetchMovies();
          resetForm();
        }
      } else {
        const posterFile = fileInputRef.current?.files?.[0];
        if (posterFile) {
          formDataToSend.append("posterFile", posterFile);
        } else if (formData.posterUrl) {
          formDataToSend.append("posterUrl", formData.posterUrl);
        }

        const res = await fetch("/api/movies", {
          method: "POST",
          body: formDataToSend,
        });

        if (res.ok) {
          fetchMovies();
          resetForm();
        }
      }
    } catch (error) {
      console.error("Error saving movie:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      name: movie.name,
      story: movie.story,
      duration: movie.duration,
      stars: movie.stars,
      rating: movie.rating,
      link: movie.link,
      posterUrl: movie.poster || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الفيلم؟")) return;

    try {
      const res = await fetch(`/api/movies/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchMovies();
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const resetForm = () => {
    setEditingMovie(null);
    setFormData({
      name: "",
      story: "",
      duration: "",
      stars: "",
      rating: "",
      link: "",
      posterUrl: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-black py-4 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-yellow-400">لوحة الإدارة</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition-colors"
          >
            تسجيل الخروج
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6">
              {editingMovie ? "تعديل فيلم" : "إضافة فيلم جديد"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">اسم الفيلم</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">قصة الفيلم</label>
                <textarea
                  value={formData.story}
                  onChange={(e) =>
                    setFormData({ ...formData, story: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">مدة الفيلم</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="مثال: 2h 15m"
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">النجوم</label>
                <input
                  type="text"
                  value={formData.stars}
                  onChange={(e) =>
                    setFormData({ ...formData, stars: e.target.value })
                  }
                  placeholder="مثال: Leonardo DiCaprio, Brad Pitt"
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">التقييم</label>
                <input
                  type="text"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: e.target.value })
                  }
                  placeholder="مثال: 8.5/10"
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">رابط المشاهدة</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">
                  رابط البوستر (URL)
                </label>
                <input
                  type="url"
                  value={formData.posterUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, posterUrl: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">
                  أو ارفع صورة من الجهاز
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded transition-colors disabled:opacity-50"
                >
                  {formLoading
                    ? "جاري الحفظ..."
                    : editingMovie
                    ? "تحديث الفيلم"
                    : "إضافة الفيلم"}
                </button>
                {editingMovie && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded transition-colors"
                  >
                    إلغاء
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6">
              قائمة الأفلام ({movies.length})
            </h2>
            {loading ? (
              <p className="text-gray-400">جاري التحميل...</p>
            ) : movies.length === 0 ? (
              <p className="text-gray-400">لا توجد أفلام حالياً</p>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="bg-gray-700 p-4 rounded-lg flex justify-between items-start gap-4"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-yellow-400">
                        {movie.name}
                      </h3>
                      <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                        {movie.story}
                      </p>
                      <div className="text-sm text-gray-400 mt-2 space-y-1">
                        <p>⏱️ {movie.duration}</p>
                        <p>⭐ {movie.rating}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(movie)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
