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
    
    async function handleSubmit(e){
        e.preventDefault();

        if (name !== '' && email !== '' && password !== '') {
            await signUp(name, email, password);
        }
    }

    return(
        <div className='container-center'>
            <div className="login">
                <div className="login-area">
                    <img src={logo} alt="System calls logo" />
                </div>

                <form onSubmit={handleSubmit}>
                    <h1>New account</h1>
                    <input 
                    type="text" 
                    placeholder='Name' 
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
                        {loadingAuth ? 'Loading...' : 'Register'}
                    </button>
                </form>

                <Link to='/'>Already have an account? Log in here!</Link>
            </div>
        </div>
    )
}