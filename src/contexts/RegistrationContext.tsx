import React, { createContext, useContext, useState, ReactNode } from "react";

type RegistrationData = {
  name?: string;
  birthDate?: Date;
  objectives?: string[];
  email?: string;
  password?: string;
};

type RegistrationContextType = {
  data: RegistrationData;
  setName: (name: string) => void;
  setBirthDate: (date: Date) => void;
  setObjectives: (obj: string[]) => void;
  setEmail: (email: string) => void; // ADICIONADO
  setPassword: (password: string) => void; // ADICIONADO
  clear: () => void;
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(
  undefined
);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<RegistrationData>({});

  const setName = (name: string) => setData((prev) => ({ ...prev, name }));
  const setBirthDate = (birthDate: Date) =>
    setData((prev) => ({ ...prev, birthDate }));
  const setObjectives = (objectives: string[]) =>
    setData((prev) => ({ ...prev, objectives }));
  const setEmail = (email: string) => setData((prev) => ({ ...prev, email }));
  const setPassword = (password: string) =>
    setData((prev) => ({ ...prev, password }));
  const clear = () => setData({});

  return (
    <RegistrationContext.Provider
      value={{
        data,
        setName,
        setBirthDate,
        setObjectives,
        setEmail, // ADICIONADO
        setPassword, // ADICIONADO
        clear,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const ctx = useContext(RegistrationContext);
  if (!ctx)
    throw new Error(
      "useRegistration must be used within a RegistrationProvider"
    );
  return ctx;
}
