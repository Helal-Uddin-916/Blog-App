import axios from "axios";
import { useEffect, useState } from "react";

function usePagination(path, queryParams = {}, limit = 4, page = 1) {
  const [blogs, setBlogs] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/${path}`,
          {
            params: { ...queryParams, limit, page },
          },
        );

        const newBlogs = res.data.blogs || [];

        setBlogs((prev) => (page === 1 ? newBlogs : [...prev, ...newBlogs]));

        setHasMore(res.data.hasMore);
      } catch (error) {
        setBlogs([]);
        setHasMore(false);
        setMessage(error?.response?.data?.message || "Error");
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, [page, path]);

  return { blogs, hasMore, loading, message };
}

export default usePagination;
