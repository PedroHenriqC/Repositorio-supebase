import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Definimos a função de busca de perfil PRIMEIRO (Evita o erro de hoisting)
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Erro ao buscar perfil:", error.message);
      setProfile(null);
    }
  };

  // 2. useEffect para monitorar a sessão
  useEffect(() => {
    const getSession = async () => {
      // Verifica se já existe uma sessão ativa ao abrir o app
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }

      setLoading(false);
    };

    getSession();

    // Ouvinte de mudanças (Login, Logout, Troca de Senha)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await fetchProfile(currentUser.id);
        } else {
          setProfile(null);
        }

        setLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Função para deslogar
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // 3. O valor que o contexto "transmite" para o resto do app
  const value = {
    user,
    profile,
    loading,
    signOut,
    isAdmin: profile?.role === "admin", // Atalho útil para verificações
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para facilitar o uso nos componentes
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
