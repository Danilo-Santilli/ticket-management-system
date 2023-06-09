import './profile.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiSettings, FiUpload } from 'react-icons/fi';
import avatar from '../../assets/avatar.png';
import { AuthContext } from '../../contexts/auth';
import { useContext, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';

export default function Profile(){
    const { user, storageUser, setUser, logout } = useContext(AuthContext);

    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);
    const [name, setName] = useState(user && user.name);
    const [email, setEmail] = useState(user && user.email);

    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0];
            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(image));
            }else{
                alert('Upload a PNG or JPG image');
                setImageAvatar(null);
                return;
            }
        };
    }

    async function handleUpload(){
        const currentUid = user.uid;
    
        const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`);
        
        const uploadTask = uploadBytes(uploadRef, imageAvatar)
        .then((snapshot)=>{
            getDownloadURL(snapshot.ref).then( async (downLoadURL) => {
                let urlPhoto = downLoadURL;
                const docRef = doc(db, 'users', user.uid);
                await updateDoc(docRef, {
                    avatarUrl: urlPhoto,
                    name: name,
                })
                .then(()=>{
                    let data = {
                        ...user,
                        name: name,
                        avatarUrl: urlPhoto,
                    }
    
                    setUser(data);
                    storageUser(data);
                    toast.success('Information successfully updated!');
                })
            })
        })
    }
    
    async function handleSubmit(e){
        e.preventDefault();
        
        if (imageAvatar === null && name !== '') {
            const docRef = doc(db, 'users', user.uid);
            await updateDoc(docRef, {
                name: name
            })
            .then(()=>{
                let data = {
                    ...user,
                    name: name,
                }
    
                setUser(data);
                storageUser(data);
                toast.success('Name successfully updated!');
            })
        }else if (name !== '' && imageAvatar !== null) {
            handleUpload()
        }
    }

    return(
        <div>
            <Header/>

            <div className='content'>
                <Title name='My account'>
                    <FiSettings size={25}/>
                </Title>

                <div className='container'>
                    <form onSubmit={handleSubmit} className='form-profile'>
                        <label className='label-avatar'>
                            <span>
                                <FiUpload color='#fff' size={25}/>
                            </span>

                            <input type="file" accept='image/*' onChange={handleFile}/>
                            <br />

                            {avatarUrl === null ? (
                                <img src={avatar} alt='Profile' width={250} height={250}/>
                            ) : (
                                <img src={avatarUrl} alt='Profile' width={250} height={250}/>
                            )}
                        </label>

                        <label>Name:</label>
                        <input 
                            type="text" 
                            value={name} 
                            placeholder='Your name'
                            onChange={(e)=>setName(e.target.value)}
                        />

                        <label>Email:</label>
                        <input 
                            type="email" 
                            value={email} 
                            disabled={true}
                        />

                        <button type='submit'>Save</button>
                    </form>                    
                </div>

                <div className='container'>
                    <button className='logout-btn' onClick={()=>logout()}>Logout</button>
                    <button className='back-btn'><Link to='/dashboard'>Back</Link></button>
                </div>
            </div>
            
        </div>
    )
}
