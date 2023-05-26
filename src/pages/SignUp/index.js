import './signup.css';
import logo from '../../assets/logo.png';
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

export default function SignIn(){

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { signUp, loadingAuth } = useContext(AuthContext);
    
    // Função assíncrona para lidar com o envio do formulário de registro
    async function handleSubmit(e){
        e.preventDefault();

        // Verifica se todos os campos estão preenchidos
        if (name !== '' && email !== '' && password !== '') {
            // Chama a função signUp do contexto para criar uma nova conta de usuário
            await signUp(name, email, password);
        }
    }

    return(
        <div className='container-center'>
            <div className="login">
                <div className="login-area">
                    <img src={logo} alt="Logo do sistema de chamados" />
                </div>

                <form onSubmit={handleSubmit}>
                    <h1>Nova conta</h1>
                    <input 
                    type="text" 
                    placeholder='Nome' 
                    value={name}
                    onChange={ (e)=> setName(e.target.value) }
                    />
                    <input 
                    type="email" 
                    placeholder='Email' 
                    value={email}
                    onChange={ (e)=> setEmail(e.target.value) }
                    />
                    <input 
                    type="password" 
                    placeholder='Password' 
                    value={password}
                    onChange={ (e)=> setPassword(e.target.value) }
                    />

                    <button type='submit'>
                        {loadingAuth ? 'Carregando...' : 'Cadastrar'}
                    </button>
                </form>

                <Link to='/'>Já possui uma conta? Acesse aqui!</Link>
            </div>
        </div>
    )
}