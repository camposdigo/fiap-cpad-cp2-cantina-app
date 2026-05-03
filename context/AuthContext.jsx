import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

const USERS_KEY = "@cantina_fiap:users";
const SESSION_KEY = "@cantina_fiap:session";

const AuthContext = createContext(null);

async function readUsers() {
  const storedUsers = await AsyncStorage.getItem(USERS_KEY);
  return storedUsers ? JSON.parse(storedUsers) : [];
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadSession() {
      try {
        const storedSession = await AsyncStorage.getItem(SESSION_KEY);
        if (storedSession) {
          setUser(JSON.parse(storedSession));
        }
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  async function register(data) {
    setLoading(true);
    try {
      const users = await readUsers();
      const emailAlreadyExists = users.some(
        (storedUser) => storedUser.email.toLowerCase() === data.email.toLowerCase()
      );

      if (emailAlreadyExists) {
        throw new Error("Este e-mail ja esta cadastrado");
      }

      const nextUser = {
        ...data,
        id: String(Date.now())
      };

      await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, nextUser]));
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
      setSuccessMessage("Cadastro realizado com sucesso");
      router.replace("/");
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    setLoading(true);
    try {
      const users = await readUsers();
      const foundUser = users.find(
        (storedUser) =>
          storedUser.email.toLowerCase() === email.toLowerCase() &&
          storedUser.password === password
      );

      if (!foundUser) {
        throw new Error("E-mail ou senha invalidos");
      }

      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(foundUser));
      setUser(foundUser);
      setSuccessMessage("Login realizado com sucesso");
      router.replace("/");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await AsyncStorage.removeItem(SESSION_KEY);
      setUser(null);
      setSuccessMessage("");
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      successMessage,
      register,
      login,
      logout,
      clearSuccess: () => setSuccessMessage("")
    }),
    [loading, successMessage, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}
