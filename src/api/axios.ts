import axios from "axios";
import { Alert } from "react-native";
import { API_URL } from ".";

// Supondo que você exporte uma função para setar o logout dinamicamente
let onLogout: (() => void) | null = null;

export function setAxiosLogoutHandler(logoutFn: () => void) {
  onLogout = logoutFn;
}

const api = axios.create({
  baseURL: API_URL,
  // ...outras configs
});

// Intercepta respostas com erro
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      if (onLogout) {
        onLogout();
      } else {
        Alert.alert("Sessão expirada", "Faça login novamente.");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
