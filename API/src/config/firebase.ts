import admin from "firebase-admin"
import {env} from "./env"

const initalizeFirebaseAdmin = ():void =>{

    //Para evitar erro de inicialização múltipla do Firebase
    //apps é um array que contém todas as instâncias do Firebase inicializadas
    if (admin.apps.length >0) return

    const {FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID} = env;

    if (!FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY || !FIREBASE_PROJECT_ID){
        throw new Error("Falha ao inicializar o Firebase - Faltando as credenciais")
    }

    try{
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: FIREBASE_PROJECT_ID,
                clientEmail:FIREBASE_CLIENT_EMAIL,
                privateKey: FIREBASE_PRIVATE_KEY
            }),
        });

    }catch(err){
        console.error("Falha ao inicializar o Firebase");
        process.exit(1); // Encerra o processo com erro
    }
}

export default initalizeFirebaseAdmin;