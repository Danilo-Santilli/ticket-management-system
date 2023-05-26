import './signup.css';
import logo from '../../assets/logo.png';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SignIn(){

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return(
        <div className='container-center'>
            <div className="login">
                <div className="login-area">
                    <img src={logo} alt="Logo do sistema de chamados" />
                </div>

                <form>
                    <h1>Nova conta</h1>
                    <input 
                    type="name" 
                    placeholder='Nome' 
                    value={email}
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

                    <button type='submit'>Criar</button>
                </form>

                <Link to='/'>Já possui uma conta? Acesse aqui!</Link>
            </div>
        </div>
    )
}