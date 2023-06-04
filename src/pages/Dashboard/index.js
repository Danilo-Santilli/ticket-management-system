import { AuthContext } from "../../contexts/auth";
import { useContext } from "react";
import Header from "../../components/Header";
import Title from '../../components/Title';
import './dashboard.css';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Dashboard(){
    const { logout } = useContext(AuthContext);

    async function handleLogout(){
        await logout();
    }

    return(
        <div>
            <Header/>
            <div className="content">
                <Title name='Tickets'>
                    <FiMessageSquare size={25}/>
                </Title>
                
                <>
                    <Link className="new" to='/new'>
                        <FiPlus color="#fff" size={25}/>
                        Novo chamado
                    </Link>
                    
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Cliente</th>
                                <th scope="col">Assunto</th>
                                <th scope="col">Status</th>
                                <th scope="col">Cadastrado em</th>
                                <th scope="col">#</th>
                            </tr>
                        </thead>
                        <tBody>
                            <tr>
                                <td data-Label='Cliente'>empresa 1</td>
                                <td data-Label='Assunto'>****</td>
                                <td data-Label='Status'>
                                    <span className="badge" style={{backgroundColor:'#999'}}>
                                        Em aberto
                                    </span>
                                </td>
                                <td data-Label='Cadastrado'>****</td>
                                <td data-Label='#'>
                                    <button className="action" style={{backgroundColor: '#3583f6'}}>
                                       <FiSearch color="#fff" size={17}/>
                                    </button>
                                    <button className="action" style={{backgroundColor: '#f6a935'}}>
                                       <FiEdit2 color="#fff" size={17}/>
                                    </button>
                                </td>
                            </tr>
                        </tBody>
                    </table>
                </>
            </div>
        </div>
    )
}
