import avatarImg from '../../assets/avatar.png';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import { FiHome, FiUser, FiSettings } from 'react-icons/fi';
import './header.css';

export default function Header(){
    const { user } = useContext(AuthContext);
    return(
        <header className="sidebar">
            <div>
                <img src={user.avatarUrl === null ? avatarImg : user.avatarUrl} alt="User" />
            </div>

            <Link to='/dashboard'>
                <FiHome color='#fff' size={24}/>
                Calls
            </Link>
            <Link to='/customers'>
                <FiUser color='#fff' size={24}/>
                Customers
            </Link>
            <Link to='/profile'>
                <FiSettings color='#fff' size={24}/>
                Profile
            </Link>
        </header>
    )
}