import './profile.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiSettings, FiUpload } from 'react-icons/fi';
import avatar from '../../assets/avatar.png';
import { AuthContext } from '../../contexts/auth';
import { useContext, useState } from 'react';

export default function Profile(){
    // Obtém as informações do usuário e as funções relacionadas do contexto de autenticação
    const { user, storageUser, setUser, logout } = useContext(AuthContext);

    // Define os estados para as informações do perfil do usuário
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);
    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);

    // Manipula o evento de seleção de arquivo para atualizar a imagem do avatar
    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0];
            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                setImageAvatar(image);
                // Define a URL do objeto de imagem selecionado como avatar
                setAvatarUrl(URL.createObjectURL(image));
            }else{
                alert('Envie uma imagem do tipo PNG ou JPG');
                setImageAvatar(null);
                return;
            }
        };
    }

    return(
        <div>
            <Header/>

            <div className='content'>
                <Title name='Minha conta'>
                    <FiSettings size={25}/>
                </Title>

                <div className='container'>
                    <form className='form-profile'>
                        <label className='label-avatar'>
                            <span>
                                <FiUpload color='#fff' size={25}/>
                            </span>

                            {/* Input para selecionar um novo arquivo de imagem para o avatar */}
                            <input type="file" accept='image/*' onChange={handleFile}/>
                            <br />

                            {/* Exibe a imagem do avatar. Se avatarUrl for nulo, exibe uma imagem padrão */}
                            {avatarUrl === null ? (
                                <img src={avatar} alt='Foto de perfil' width={250} height={250}/>
                            ) : (
                                <img src={avatarUrl} alt='Foto de perfil' width={250} height={250}/>
                            )}
                        </label>

                        <label>Nome:</label>
                        {/* Input para editar o nome do usuário */}
                        <input 
                            type="text" 
                            value={nome} 
                            placeholder='Seu nome'
                            onChange={(e)=>setNome(e.target.value)}
                        />

                        <label>Email:</label>
                        {/* Input para exibir o email do usuário */}
                        <input 
                            type="email" 
                            value={email} 
                            disabled={true}
                        />

                        {/* Botão para salvar as alterações */}
                        <button type='submit'>Salvar</button>
                    </form>                    
                </div>

                <div className='container'>
                    {/* Botão para fazer logout */}
                    <button className='logout-btn' onClick={()=>logout()}>Sair</button>
                </div>
            </div>
            
        </div>
    )
}
