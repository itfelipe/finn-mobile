export const API_URL = "http://localhost:3000";

// AUTENTICAÇÃO
export const REGISTER = `${API_URL}/auth/register`; // POST {name, email, password}
export const LOGIN = `${API_URL}/auth/login`; // POST {email, password}
export const PROFILE = `${API_URL}/auth/me`; // GET (com Bearer token)

// TRANSAÇÕES
export const CREATE_TRANSACTION = `${API_URL}/transactions`; // POST (com token)
export const GET_TRANSACTIONS = `${API_URL}/transactions`; // GET (com token)
export const UPDATE_TRANSACTION = (id: string) =>
  `${API_URL}/transactions/${id}`; // PUT (com token)
export const DELETE_TRANSACTION = (id: string) =>
  `${API_URL}/transactions/${id}`; // DELETE (com token)
export const TRANSACTION_SUMMARY = `${API_URL}/transactions/summary`; // GET (com token)
export const GET_TRANSACTION_BY_ID = (id: string) =>
  `${API_URL}/transactions/${id}`; // GET (com token)

// ORÇAMENTOS/BUDGETS
export const CREATE_BUDGET = `${API_URL}/budgets`; // POST (com token)
export const GET_BUDGETS = `${API_URL}/budgets`; // GET (com token)
export const UPDATE_BUDGET = (id: string) => `${API_URL}/budgets/${id}`; // PUT (com token)
export const DELETE_BUDGET = (id: string) => `${API_URL}/budgets/${id}`; // DELETE (com token)
export const GET_BUDGETS_BY_PERIOD = `${API_URL}/budgets/by-period`; // GET (com token, query params)
