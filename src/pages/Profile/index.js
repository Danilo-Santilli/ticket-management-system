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

export default function Profile(){
    const { user, storageUser, setUser, logout } = useContext(AuthContext);

    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);
    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);

    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0];
            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(image));
            }else{
                alert('Envie uma imagem do tipo PNG ou JPG');
                setImageAvatar(null);
                return;
            }
        };
    }

    async function handleUpload(){
        // Obtém o UID atual do usuário
        const currentUid = user.uid;
    
        // Referência para o upload da imagem no Storage
        const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`);
        
        // Executa o upload da imagem para o Storage
        const uploadTask = uploadBytes(uploadRef, imageAvatar)
        .then((snapshot)=>{
            // Obtém a URL de download da imagem do Storage
            getDownloadURL(snapshot.ref).then( async (downLoadURL) => {
                let urlFoto = downLoadURL;
                const docRef = doc(db, 'users', user.uid);
                // Atualiza os dados do usuário com a nova URL de avatar e nome
                await updateDoc(docRef, {
                    avatarUrl: urlFoto,
                    nome: nome,
                })
                .then(()=>{
                    let data = {
                        ...user,
                        nome: nome,
                        avatarUrl: urlFoto,
                    }
    
                    // Atualiza o estado do usuário e armazena no armazenamento local
                    setUser(data);
                    storageUser(data);
                    toast.success('Informações atualizadas com sucesso!');
                })
            })
        })
    }
    
    async function handleSubmit(e){
        e.preventDefault();
        
        if (imageAvatar === null && nome !== '') {
            const docRef = doc(db, 'users', user.uid);
            // Atualiza apenas o nome do usuário
            await updateDoc(docRef, {
                nome: nome
            })
            .then(()=>{
                let data = {
                    ...user,
                    nome: nome,
                }
    
                // Atualiza o estado do usuário e armazena no armazenamento local
                setUser(data);
                storageUser(data);
                toast.success('Nome atualizado com sucesso!');
            })
        }else if (nome !== '' && imageAvatar !== null) {
            // Realiza o upload da imagem e atualiza o nome do usuário
            handleUpload()
        }
    }

    return(
        <div>
            <Header/>

            <div className='content'>
                <Title name='Minha conta'>
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
                                <img src={avatar} alt='Foto de perfil' width={250} height={250}/>
                            ) : (
                                <img src={avatarUrl} alt='Foto de perfil' width={250} height={250}/>
                            )}
                        </label>

                        <label>Nome:</label>
                        <input 
                            type="text" 
                            value={nome} 
                            placeholder='Seu nome'
                            onChange={(e)=>setNome(e.target.value)}
                        />

                        <label>Email:</label>
                        <input 
                            type="email" 
                            value={email} 
                            disabled={true}
                        />

                        <button type='submit'>Salvar</button>
                    </form>                    
                </div>

                <div className='container'>
                    <button className='logout-btn' onClick={()=>logout()}>Sair</button>
                </div>
            </div>
            
        </div>
    )
}
