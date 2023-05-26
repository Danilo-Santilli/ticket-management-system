import  { useState, createContext, useEffect } from 'react';
import { auth, db } from '../services/firebaseConnection';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const AuthContext = createContext({});

function AuthProvider({children}){
    // Define o estado "user" para controlar as informações do usuário autenticado
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);

    // Função de exemplo para fazer login
    function signIn(email, password){
        alert('ok');
    }

    // Função assíncrona para criar uma nova conta de usuário
    async function signUp(name, email, password){
        setLoadingAuth(true);

        // Cria uma nova conta de usuário usando o email e senha fornecidos
        await createUserWithEmailAndPassword(auth, email, password)
        .then(async (value)=>{
            let uid = value.user.uid;

            // Salva os dados adicionais do usuário no Firestore
            await setDoc(doc(db, 'users', uid),{
                nome: name,
                avatarUrl: null
            })
            .then(()=>{
                // Define os dados do usuário no estado "user"
                let data = {
                    uid: uid,
                    nome: name,
                    email: value.user.email,
                    avatarUrl: null
                };

                setUser(data);
                setLoadingAuth(false);
            });
        })
        .catch((error)=>{
            console.log(error);
            setLoadingAuth(false);
        });
    }

    return(
        // Cria o provedor de contexto AuthContext.Provider
        <AuthContext.Provider value={{
            // Define as propriedades disponíveis no contexto
            signed: !!user, // Indica se o usuário está autenticado (converte o valor de "user" em um booleano)
            user, // Informações do usuário autenticado
            signIn, // Função para fazer login
            signUp, // Função para criar uma nova conta de usuário
            loadingAuth // Indica se a autenticação está em andamento
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
