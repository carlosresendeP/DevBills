import { useEffect } from "react";
import GoogleLoginButton from "../components/GoogleLoginButton";
// import { signInWithPopup } from "firebase/auth";
// import { firebaseAuth, googleAuthProvider } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export const Login = () => {
  const { signInWithGoogle, authState } = useAuth();

  const navigate = useNavigate();

  // Função para lidar com o login
  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("error ao fazer login com o Google", err);
    }
  };

  // Efeito para redirecionar o usuário se já estiver autenticado
  useEffect(() => {
    //se o usuario ja exitir e nao tiver carregando, redireciona para o dashboard
    if (authState.user && !authState.loading) {
      navigate("/dashboard");
    }
  }, [authState.user, authState.loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 ">
        <header>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            DevBills
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Gerencie suas finanças de forma simples e eficiente
          </p>
        </header>

        <main className="mt-8 bg-white py-8 px-4 shadow-md rounded-lg sm:px-10 space-y-6">
          <section className="mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              Faça login para continuar
            </h2>
            <p className="mt-1 text-sm  text-gray-600">
              Acesse sua conta para começar a gerenciar suas finanças
            </p>
          </section>

          <GoogleLoginButton onClick={handleLogin} isLoading={false} />

          {/* Exibir mensagem de erro se houver */}
          {authState.error && (
            <div className="bg-red-50 text-center text-red-700 mt-4">
              <p>{authState.error}Erro no Sistema</p>
            </div>
          )}

          <footer className="mt-6">
            <p className="mt-1 text-sm  text-gray-600 text-center">
              Ao fazer login, você concorda com nossos termos de uso e política
              de privacidade.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};
