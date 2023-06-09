import './signin.css';
import logo from '../../assets/logo.png';
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

export default function SignIn(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const { signIn, loadingAuth }= useContext(AuthContext);

    async function handleSignIn(e){
        e.preventDefault();
        
        if (email !== '' && password !== '') {
            await signIn(email, password);
        }
    }

    return(
        <div className='container-center'>
            <div className="login">
                <div className="login-area">
                    <img src={logo} alt="System calls logo" />
                </div>

                <form onSubmit={handleSignIn}>
                    <h1>Login</h1>
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
                        {loadingAuth ? 'Loading...' : 'Login'}
                    </button>
                </form>

                <Link to='/register'>Don't have an account? Create one here!</Link>
            </div>
        </div>
    )
}