import { Routes, Route} from 'react-router-dom';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Costumers from '../pages/Costumers';

import Private from './Private';

function RoutesApp(){
    return(
        <Routes>
            <Route path='/' element={<SignIn/>}/>
            <Route path='/register' element={<SignUp/>}/>
            <Route path='/dashboard' element={<Private><Dashboard/></Private>}/>
            <Route path='/profile' element={<Private><Profile/></Private>}/>
            <Route path='/costumers' element={<Private><Costumers/></Private>}/>
        </Routes>
    )
}

export default RoutesApp;