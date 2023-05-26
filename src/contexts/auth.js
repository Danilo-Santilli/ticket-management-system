import  { useState, createContext, useEffect } from 'react';

export const AuthContext = createContext({});

function AuthProvider({children}){
    // Define o estado "user" para controlar as informações do usuário autenticado
    const [user, setUser] = useState(null);

    // Função de exemplo para fazer login
    function signIn(email, password){
        alert('ok');
    }

    return(
        // Cria o provedor de contexto AuthContext.Provider
        <AuthContext.Provider value={{
            // Define as propriedades disponíveis no contexto
            signed: !!user, // Indica se o usuário está autenticado (converte o valor de "user" em um booleano)
            user, // Informações do usuário autenticado
            signIn // Função para fazer login
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
