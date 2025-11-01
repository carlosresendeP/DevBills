import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AuthState } from "../types/auth";
import { signInWithPopup, onAuthStateChanged, signOut as FirebaseSingOut} from "firebase/auth";
import { firebaseAuth, googleAuthProvider } from "../config/firebase";

//onAuthStateChanged é usado para monitorar o estado de autenticação do usuário

interface AuthContextPrpos {
  authState: AuthState;
  singWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Definindo o tipo do estado de autenticação
const AuthContext = createContext<AuthContextPrpos | undefined>(undefined);

// Criando o provedor de autenticação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    error: null,
    loading: false,
  });

  //toda vez que o estado de autenticação mudar, atualiza o estado do contexto
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(
      firebaseAuth,
      (user) => {
        console.log(user) //apenas para debug
        if (user) {
          setAuthState({
            user: {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
            },
            error: null,
            loading: false,
          });
        } else {
          setAuthState({
            user: null,
            error: null,
            loading: false,
          });
        }
      },
      (error) => {
        console.error("Erro ao verificar o estado de autenticação:", error);
        setAuthState({
          user: null,
          error: error.message,
          loading: false,
        });
      },
    );

    return () => {
      unSubscribe(); // Limpa o listener quando o componente é desmontado
    };
  }, []);

  // Função para fazer login com o Google
  const singWithGoogle = async (): Promise<void> => {
    setAuthState((prev) => ({ ...prev, loading: true })); // Define o estado de loading como true

    try {
      await signInWithPopup(firebaseAuth, googleAuthProvider); // Tenta fazer o login com o Google
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro desconhecido ao fazer login com o Google"; // Verifica se err é uma instância de Error e obtém a mensagem de erro
      setAuthState((prev) => ({ ...prev, loading: false, error: message }));
    }
  };

  // Função para fazer logout
  const signOut = async (): Promise<void> => {
    setAuthState((prev) => ({ ...prev, loading: true }));
    try{
      await FirebaseSingOut(firebaseAuth); // Tenta fazer o logout
    }catch(err) {
      const message =
        err instanceof Error ? err.message : "Erro desconhecido ao fazer logout com o Google"; // Verifica se err é uma instância de Error e obtém a mensagem de erro
      setAuthState((prev) => ({ ...prev, loading: false, error: message }));
    }



  };

  return (
    // Fornecendo o estado de autenticação para os componentes filhos
    <AuthContext.Provider value={{ authState, singWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um <AuthProvider>");
  }
  return context;
};
