import app from "./app";
import { prismaConnect } from "./config/prima";
import { inializeGlobalCategories } from "./services/globalCategories.service";
import { env } from "./config/env";
import initalizeFirebaseAdmin from "./config/firebase";

initalizeFirebaseAdmin();

const startServer = async () => {
  try {
    await prismaConnect();
    await inializeGlobalCategories();


    await app.listen({
      port: Number(process.env.PORT) || 3000,
      host: "0.0.0.0",
    });

    console.log(
      `🚀 Servidor rodando na porta ${process.env.PORT || 3000}`
    );
  } catch (error) {
    console.error("❌ Falha ao iniciar o servidor:", error);
    process.exit(1);
  }
};

startServer();