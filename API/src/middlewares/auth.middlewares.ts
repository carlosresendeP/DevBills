import type { FastifyReply, FastifyRequest } from "fastify";
import admin from "firebase-admin";

// Extensão do FastifyRequest para incluir a propriedade userId
declare module "fastify" {
  interface FastifyRequest {
    userId?: string; // Adiciona a propriedade userId ao objeto FastifyRequest
  }
}

export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {

  let authHeader = request.headers.authorization; 

  
  // Se o token não começar com "Bearer ", adiciona o prefixo
  if (authHeader && !authHeader.startsWith("Bearer ")) {
    authHeader = `Bearer ${authHeader}`;
  }


  //verificar se o token foi fornecido começando com Bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    reply.status(401).send({ error: "Token de autorização não fornecido" });
    return;
  }

  // Remover a palavra Bearer do token
  const token = authHeader.replace("Bearer ", "");


  try {
    // Verificar o token com o firebase admin
    const decodedToken = await admin.auth().verifyIdToken(token);

    request.userId = decodedToken.uid; // Adiciona o userId ao objeto request
  } catch (error) {
    request.log.error("Erro ao verificar token", error);
    reply.status(401).send({ error: "Token inválido ou expirado" });
    return;
  }
};
