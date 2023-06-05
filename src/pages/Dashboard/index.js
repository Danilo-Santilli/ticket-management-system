import { AuthContext } from "../../contexts/auth";
import { useContext, useEffect, useState } from "react";
import Header from "../../components/Header";
import Title from '../../components/Title';
import './dashboard.css';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { db } from "../../services/firebaseConnection";
import { getDocs, collection, orderBy, limit, startAfter, query } from "firebase/firestore";

export default function Dashboard(){
  const { logout } = useContext(AuthContext);

  const [chamados, setChamados] = useState([]);
  const [loading, setloading] = useState(true);
  const listRef = collection(db, 'chamados');
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    async function loadChamados() {
      // Define a query para buscar os chamados ordenados por data de criação em ordem decrescente, limitando a 5 resultados
      const q = query(listRef, orderBy('created', 'desc'), limit(5));
      // Executa a query e obtém o snapshot dos resultados
      const querySnapshot = await getDocs(q);
      // Atualiza o estado dos chamados com base no snapshot
      await updateState(querySnapshot);
      setloading(false); // Define que o carregamento foi concluído
    }
  
    loadChamados(); // Chama a função de carregamento de chamados
  
    return () => { 
      // Função de limpeza, não realiza nenhuma ação
    };
  }, []);
  
  async function updateState(querySnapshot) {
    const isCollectionEmpty = querySnapshot.size === 0;
  
    if (!isCollectionEmpty) {
      let lista = [];
      // Itera sobre os documentos no snapshot e adiciona os dados na lista
      querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          status: doc.data().status,
          complemento: doc.data().complemento
        });
      });
  
      // Atualiza o estado dos chamados, concatenando a lista atual com os novos chamados
      setChamados(chamados => [...chamados, ...lista]);
    } else {
      setIsEmpty(true); // Define que a coleção de chamados está vazia
    }
  }
  

  return(
    <div>
      <Header/>
      <div className="content">
        <Title name='Tickets'>
          <FiMessageSquare size={25}/>
        </Title>

        {chamados.length === 0 ? (
          <div className="container dashboard">
            <span>Nenhum chamado registrado</span>
            <Link className="new" to='/new'>
              <FiPlus color="#fff" size={25}/>
              Novo chamado
            </Link>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  )
}
