import { useState } from "react";
import {
  CREATE_BUDGET,
  GET_BUDGETS,
  UPDATE_BUDGET,
  DELETE_BUDGET,
  GET_BUDGETS_BY_PERIOD,
} from "../api";
import api from "../api/axios";

export function useCreateBudget(token: string | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBudget = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(CREATE_BUDGET, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao criar orçamento.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createBudget, loading, error };
}

export function useBudgets(token: string | null) {
  const [loading, setLoading] = useState(false);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = async (params: Record<string, any> = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(GET_BUDGETS, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setBudgets(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao buscar orçamentos.");
    } finally {
      setLoading(false);
    }
  };

  return { fetchBudgets, budgets, loading, error };
}

export function useBudgetByPeriod(token: string | null) {
  const [loading, setLoading] = useState(false);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Exemplo de query params: { startDate, endDate }
  const fetchBudgetsByPeriod = async (params: Record<string, any>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(GET_BUDGETS_BY_PERIOD, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setBudgets(res.data);
      return res.data;
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Erro ao buscar orçamentos por período."
      );
    } finally {
      setLoading(false);
    }
  };

  return { fetchBudgetsByPeriod, budgets, loading, error };
}

export function useUpdateBudget(token: string | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBudget = async (id: string, data: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put(UPDATE_BUDGET(id), data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao atualizar orçamento.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateBudget, loading, error };
}

export function useDeleteBudget(token: string | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteBudget = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.delete(DELETE_BUDGET(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao deletar orçamento.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteBudget, loading, error };
}
