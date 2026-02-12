import { toast } from "react-toastify";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router";

const Configurations = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { deleteUser, signOut } = useAuth();
  const navigate = useNavigate();

  const [showDeleteUserModal, setShowDeleteUserModal] =
    useState<boolean>(false);

  const handleDeleteUser = async (): Promise<void> => {
    setLoading(true);
    try {
      await deleteUser();
      toast.success("Usuário excluído com sucesso");
      navigate("/");
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao excluir usuário";

      if (
        errorMessage.includes("auth/requires-recent-login") ||
        errorMessage.includes("requires-recent-login")
      ) {
        toast.error("Por segurança, faça login novamente para excluir.");
        await signOut();
      } else {
        toast.error("Erro ao excluir usuário");
      }
    } finally {
      setLoading(false);
    }

    return;
  };

  const handleCancelDeleteUser = (): void => {
    setShowDeleteUserModal(false);
  };

  return (
    <div className="container-app relative flex items-center justify-center">
      <div className="flex items-center justify-center w-full">
        <Card className="w-full max-w-3xl">
          <p className="text-lg font-bold">Configurações do perfil</p>
          <div className="mt-5">
            <button
              onClick={() => setShowDeleteUserModal(true)}
              disabled={showDeleteUserModal}
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Excluir conta
            </button>
          </div>
        </Card>
      </div>

      {showDeleteUserModal && (
        <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] max-w-md w-full">
          <Card className="w-full max-w-md h-full max-h-lg">
            <div className="flex flex-col items-center justify-center">
              <p>Deseja realmente excluir sua conta?</p>
              <div className="flex items-center justify-center mt-5 gap-5">
                <button
                  onClick={handleCancelDeleteUser}
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Não
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={loading}
                  type="submit"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Excluir conta
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Configurations;
