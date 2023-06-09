import { useState } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiUser} from 'react-icons/fi';
import { db } from '../../services/firebaseConnection';
import { addDoc, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';

export default function Customers(){
    const [name, setName] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [address, setAddress] = useState('');

    async function handleRegister(e){
        e.preventDefault();
        if (name !== '' && cnpj !== '' && address !== '') {
            await addDoc(collection(db, 'customers'), {
                fantasyName: name,
                cnpj: cnpj,
                address: address
            })
            .then(()=>{
                setName('');
                setCnpj('');
                setAddress('');
                toast.success('Registered company!');
            })
            .catch((error)=>{
                console.log(error);
                toast.error('Error when registering!');
            })

        }else{
            toast.error("Fill in all the fields!");
        }
    }

    return(
        <div>
            <Header/>

            <div className='content'>
                <Title name='Customers'>
                    <FiUser size={25}/>
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>
                        <label>Fantasy name</label>
                        <input 
                        type="text"
                        placeholder='Company name'
                        value={name}
                        onChange={(e)=>setName(e.target.value)}/>

                        <label>CNPJ</label>
                        <input 
                        type="text"
                        placeholder='Company number'
                        value={cnpj}
                        onChange={(e)=>setCnpj(e.target.value)}/>

                        <label>Company address</label>
                        <input 
                        type="text"
                        placeholder='Company address'
                        value={address}
                        onChange={(e)=>setAddress(e.target.value)}/>
                    
                        <button type="submit">Save</button>
                    </form>
                </div>
            </div>
        </div>
    )
}