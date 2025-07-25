import { useState } from "react";
import { API_URL } from "../api";
import api from "../api/axios";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`${API_URL}/categories`);
      setCategories(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao buscar categorias.");
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, fetchCategories };
}
