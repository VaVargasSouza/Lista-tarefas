
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// 1. Configuração do Firebase
const firebaseConfig = {
 apiKey: "AIzaSyCuPfJ0xy8rBZ9M5_M_8LQzmlKW_dKX2Fs",
  authDomain: "rotina22-10-26.firebaseapp.com",
  projectId: "rotina22-10-26",
  storageBucket: "rotina22-10-26.firebasestorage.app",
  messagingSenderId: "712561432947",
  appId: "1:712561432947:web:2716d5bd24d6d836c98d06"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar os serviços
const db = getFirestore(app);
const auth = getAuth(app);

// Exportar para usar em outros arquivos
export { app, db, auth };
