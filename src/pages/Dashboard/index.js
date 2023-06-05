import { AuthContext } from "../../contexts/auth";
import { useContext, useEffect, useState } from "react";
import Header from "../../components/Header";
import Title from '../../components/Title';
import './dashboard.css';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { db } from "../../services/firebaseConnection";
import { getDocs, collection, orderBy, limit, startAfter, query } from "firebase/firestore";
import { format } from 'date-fns';

const listRef = collection(db, 'chamados');

export default function Dashboard(){
  const { logout } = useContext(AuthContext);

  const [chamados, setChamados] = useState([]);
  const [loading, setloading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [loadingMore, setloadingMore] = useState(false);

  useEffect(()=>{
    async function loadChamados(){
      const q = query(listRef, orderBy('created', 'desc'), limit(5));
      const querySnapshot = await getDocs(q);
      setChamados([]);
      await updateState(querySnapshot);
      setloading(false);
    }

    loadChamados();

    return ()=>{ }
  }, []);

  async function updateState(querySnapshot){
    const isCollectionEmpty = querySnapshot.size === 0;
    if (!isCollectionEmpty) {
      let lista = [];
      querySnapshot.forEach((doc)=>{
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
          status: doc.data().status,
          complemento: doc.data().complemento
        })
      })

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] //PEGANDO O ULTIMO ITEM

      setChamados(chamados => [...chamados, ...lista]);
      setLastDocs(lastDoc);
    }else{
      setIsEmpty(true);
    }

    setloadingMore(false);
  }

  async function handleMore() {
    setloadingMore(true); // Define que está carregando mais chamados
  
    // Define a query para buscar os chamados ordenados por data de criação em ordem decrescente,
    // começando após o último documento carregado e limitando a 5 resultados
    const q = query(listRef, orderBy('created', 'desc'), startAfter(lastDocs), limit(5));
  
    // Executa a query e obtém o snapshot dos resultados
    const querySnapshot = await getDocs(q);
  
    // Atualiza o estado dos chamados com base no snapshot
    await updateState(querySnapshot);
  }  

  if (loading) {
    return(
      <div>
        <Header/>
        <div>
          <Title name='Tickets'>
            <FiMessageSquare size={25}/>
          </Title>
          <div className="container dashboard">
            <span>Buscando chamados, aguarde.</span>
          </div>
        </div>
      </div>
    )
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
              {chamados.map((item, index)=>{
                return(
                  <tr key={index}>
                    <td data-Label='Cliente'>{item.cliente}</td>
                    <td data-Label='Assunto'>{item.assunto}</td>
                    <td data-Label='Status'>
                      <span className="badge" style={{backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999'}}>
                        {item.status}
                      </span>
                    </td>
                    <td data-Label='Cadastrado'>{item.createdFormat}</td>
                    <td data-Label='#'>
                      <button className="action" style={{backgroundColor: '#3583f6'}}>
                        <FiSearch color="#fff" size={17}/>
                      </button>
                      <button className="action" style={{backgroundColor: '#f6a935'}}>
                        <FiEdit2 color="#fff" size={17}/>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tBody>
          </table>
          
          {loadingMore && <h3>Buscando mais chamados...</h3>}
          {!loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar mais</button>}
          </>
        )}
      </div>
    </div>
  )
}
