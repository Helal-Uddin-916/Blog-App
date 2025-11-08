import axios from "axios";
import React, { useEffect, useState } from "react";

function usePagination(path, queryParams = {}, limit = 1, page = 1) {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");
  const [hashMore, setHashMore] = useState(true);
  useEffect(() => {
    async function fetchSearchBlogs() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/${path}`,
          {
            params: { ...queryParams, limit, page },
          }
        );
        setBlogs((prev) => [...prev, ...res.data.blogs]);
        setHashMore(res.data.hashMore);
      } catch (error) {
        setBlogs([]);
        setHashMore(false);
        setMessage(error.response.data.message);
      }
    }
    fetchSearchBlogs();
  }, [page]);

  return { blogs, hashMore, message };
}

export default usePagination;
