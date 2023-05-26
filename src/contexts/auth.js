import  { useState, createContext, useEffect } from 'react';
import { auth, db } from '../services/firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);

    const navigate = useNavigate();

    async function signIn(email, password){
        setLoadingAuth(true);
    
        // Faz o login do usuário usando o email e a senha fornecidos
        await signInWithEmailAndPassword(auth, email, password)
        .then(async (value)=>{
            let uid = value.user.uid;
    
            // Obtém os dados do usuário do Firestore usando o ID do usuário
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef);
    
            // Cria um objeto de dados do usuário com as informações necessárias
            let data = {
                uid: uid,
                nome: docSnap.data().nome,
                email: value.user.email,
                avatarUrl: docSnap.data().avatarUrl
            }
    
            // Define o usuário autenticado no estado e no armazenamento local
            setUser(data);
            storageUser(data);
    
            setLoadingAuth(false);
            toast.success('Você entrou no sistema!');
            navigate('/dashboard');
        })
        .catch((error)=>{
            console.log(error);
            setLoadingAuth(false);
            toast.error('Ops, algo deu errado!');
        })
    }
    

    async function signUp(name, email, password){
        setLoadingAuth(true);

        await createUserWithEmailAndPassword(auth, email, password)
        .then(async (value)=>{
            let uid = value.user.uid;

            await setDoc(doc(db, 'users', uid),{
                nome: name,
                avatarUrl: null
            })
            .then(()=>{
                let data = {
                    uid: uid,
                    nome: name,
                    email: value.user.email,
                    avatarUrl: null
                };

                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
                toast.success('Seja bem-vindo ao sistema!')
                navigate('/dashboard');
            });
        })
        .catch((error)=>{
            console.log(error);
            setLoadingAuth(false);
            toast.error('Ops, algo deu errado!');
        });
    }

    function storageUser(data){
        localStorage.setItem('@ticketsPRO', JSON.stringify(data))
    }

    return(
        <AuthContext.Provider value={{
            signed: !!user, 
            user,
            signIn,
            signUp,
            loadingAuth
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
