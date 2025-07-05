import { useState } from "react";
import { REGISTER, LOGIN, PROFILE } from "../api";
import api from "../api/axios";

// Busca perfil com o token
async function fetchUserProfile(token: string) {
  const res = await api.get(PROFILE, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// Cadastro
export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      // Cadastra e pega token
      const res = await api.post(REGISTER, { name, email, password });
      const { accessToken, refreshToken } = res.data;

      // Busca o perfil com o accessToken
      const user = await fetchUserProfile(accessToken);

      return { ...user, accessToken, refreshToken };
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao registrar.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
}

// Login
export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      // Loga e pega token
      const res = await api.post(LOGIN, { email, password });
      const { accessToken, refreshToken } = res.data;

      // Busca o perfil com o accessToken
      const user = await fetchUserProfile(accessToken);

      return { ...user, accessToken, refreshToken };
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao logar.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}

export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const getProfile = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(PROFILE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao buscar perfil.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getProfile, profile, loading, error };
}
