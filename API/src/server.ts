import app from "./app";
import { prismaConnect } from "./config/prima";
import { inializeGlobalCategories } from "./services/globalCategories.service";
import { env } from "./config/env";
import initalizeFirebaseAdmin from "./config/firebase";

const PORT = env.PORT;

initalizeFirebaseAdmin();

const startServer = async () => {
  try {
    // Conectar ao banco de dados
    await prismaConnect();
    //iniciarlizar as cartegorias
    await inializeGlobalCategories();

    // Iniciar o servidor Fastify
    await app
      .listen({ port: PORT })
      .then(() => `Servidor está ativo na porta http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ Falha ao iniciar o servidor:", error);
  }
};

startServer();
