import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AuthState } from "../types/auth";
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut as FirebaseSignOut,
  deleteUser as deleteFirebaseUser,
} from "firebase/auth";
import { firebaseAuth, googleAuthProvider, db } from "../config/firebase";
import { doc, deleteDoc } from "firebase/firestore";

//onAuthStateChanged é usado para monitorar o estado de autenticação do usuário

interface AuthContextProps {
  authState: AuthState;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  deleteUser: () => Promise<void>;
}

// Definindo o tipo do estado de autenticação
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

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
  const signInWithGoogle = async (): Promise<void> => {
    setAuthState((prev) => ({ ...prev, loading: true })); // Define o estado de loading como true

    try {
      await signInWithPopup(firebaseAuth, googleAuthProvider); // Tenta fazer o login com o Google
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao fazer login com o Google"; // Verifica se err é uma instância de Error e obtém a mensagem de erro
      setAuthState((prev) => ({ ...prev, loading: false, error: message }));
    }
  };

  // Função para fazer logout
  const signOut = async (): Promise<void> => {
    setAuthState((prev) => ({ ...prev, loading: true }));
    try {
      await FirebaseSignOut(firebaseAuth); // Tenta fazer o logout
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao fazer logout com o Google"; // Verifica se err é uma instância de Error e obtém a mensagem de erro
      setAuthState((prev) => ({ ...prev, loading: false, error: message }));
    }
  };

  //deleteUser
  // Função para excluir o usuário por completo
  const deleteUser = async (): Promise<void> => {
    const currentUser = firebaseAuth.currentUser;

    if (!currentUser) {
      setAuthState((prev) => ({
        ...prev,
        error: "Nenhum usuário logado para excluir.",
      }));
      setAuthState((prev) => ({
        ...prev,
        error: "Nenhum usuário logado para excluir.",
      }));
      throw new Error("Nenhum usuário logado para excluir.");
    }

    setAuthState((prev) => ({ ...prev, loading: true }));

    try {
      // 1. Deleta o documento do usuário no Firestore (coleção 'users')

      // Cria uma promessa de timeout de 3 segundos
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout ao tentar conectar com Firestore")),
          3000,
        ),
      );

      // Tenta deletar do Firestore, mas desiste se demorar mais de 3s
      try {
        await Promise.race([
          deleteDoc(doc(db, "users", currentUser.uid)),
          timeoutPromise,
        ]);
      } catch (firestoreError) {
        console.error(firestoreError);
        // Não lançamos erro aqui para garantir que a conta Auth seja excluída de qualquer forma
      }

      // 2. Deleta o usuário da Autenticação do Firebase
      await deleteFirebaseUser(currentUser);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao excluir conta";

      // Nota: O Firebase costuma exigir um "re-login" recente para deletar a conta por segurança
      if (
        err instanceof Error &&
        err.message.includes("requires-recent-login")
      ) {
        setAuthState((prev) => ({
          ...prev,
          loading: false,
          error:
            "Para sua segurança, faça login novamente antes de excluir sua conta.",
        }));
      } else {
        setAuthState((prev) => ({ ...prev, loading: false, error: message }));
      }
      throw err; // Re-throw error so component can handle it
    }
  };

  return (
    // Fornecendo o estado de autenticação para os componentes filhos
    <AuthContext.Provider
      value={{ authState, signInWithGoogle, signOut, deleteUser }}
    >
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
