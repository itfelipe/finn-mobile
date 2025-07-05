import { useState } from "react";
import {
  CREATE_TRANSACTION,
  GET_TRANSACTIONS,
  UPDATE_TRANSACTION,
  DELETE_TRANSACTION,
  TRANSACTION_SUMMARY,
  GET_TRANSACTION_BY_ID,
} from "../api";
import api from "../api/axios";

export function useCreateTransaction(token: string | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTransaction = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(CREATE_TRANSACTION, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao criar transação.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createTransaction, loading, error };
}

export function useTransactions(token: string | null) {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(GET_TRANSACTIONS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao buscar transações.");
    } finally {
      setLoading(false);
    }
  };

  return { fetchTransactions, transactions, loading, error };
}

export function useTransactionById(token: string | null) {
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactionById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(GET_TRANSACTION_BY_ID(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransaction(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao buscar transação.");
    } finally {
      setLoading(false);
    }
  };

  return { fetchTransactionById, transaction, loading, error };
}

export function useUpdateTransaction(token: string | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTransaction = async (id: string, data: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put(UPDATE_TRANSACTION(id), data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao atualizar transação.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateTransaction, loading, error };
}

export function useDeleteTransaction(token: string | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTransaction = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.delete(DELETE_TRANSACTION(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao deletar transação.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteTransaction, loading, error };
}

export function useTransactionsSummary(token: string | null) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(TRANSACTION_SUMMARY, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao buscar resumo.");
    } finally {
      setLoading(false);
    }
  };

  return { fetchSummary, summary, loading, error };
}
