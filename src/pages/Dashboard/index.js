import { AuthContext } from "../../contexts/auth";
import { useContext, useEffect, useState } from "react";
import Header from "../../components/Header";
import Title from '../../components/Title';
import Modal from '../../components/Modal';
import './dashboard.css';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { db } from "../../services/firebaseConnection";
import { getDocs, collection, orderBy, limit, startAfter, query } from "firebase/firestore";
import { format } from 'date-fns';

const listRef = collection(db, 'calls');

export default function Dashboard(){
  const { logout } = useContext(AuthContext);

  const [calls, setCalls] = useState([]);
  const [loading, setloading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [loadingMore, setloadingMore] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();

  useEffect(()=>{
    async function loadCalls(){
      const q = query(listRef, orderBy('created', 'desc'), limit(5));
      const querySnapshot = await getDocs(q);
      setCalls([]);
      await updateState(querySnapshot);
      setloading(false);
    }

    loadCalls();

    return ()=>{ }
  }, []);

  async function updateState(querySnapshot){
    const isCollectionEmpty = querySnapshot.size === 0;
    if (!isCollectionEmpty) {
      let list = [];
      querySnapshot.forEach((doc)=>{
        list.push({
          id: doc.id,
          topic: doc.data().topic,
          customer: doc.data().customer,
          customerId: doc.data().customerId,
          created: doc.data().created,
          createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
          status: doc.data().status,
          complement: doc.data().complement
        })
      })

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] //GETTING THE LAST ITEM

      setCalls(calls => [...calls, ...list]);
      setLastDocs(lastDoc);
    }else{
      setIsEmpty(true);
    }

    setloadingMore(false);
  }

  async function handleMore(){
    setloadingMore(true);
    const q = query(listRef, orderBy('created', 'desc'), startAfter(lastDocs), limit(5));
    const querySnapshot = await getDocs(q);
    await updateState(querySnapshot);
  }

  function toggleModal(item){
    setShowPostModal(!showPostModal);
    setDetail(item);
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
            <span>Getting calls, wait.</span>
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

        {calls.length === 0 ? (
          <div className="container dashboard">
            <span>No calls registered</span>
            <Link className="new" to='/new'>
              <FiPlus color="#fff" size={25}/>
              New call
            </Link>
          </div>
        ) : (
          <>
            <Link className="new" to='/new'>
              <FiPlus color="#fff" size={25}/>
              New call
            </Link>
            <table>
            <thead>
              <tr>
                <th scope="col">Customer</th>
                <th scope="col">Topic</th>
                <th scope="col">Status</th>
                <th scope="col">Created in</th>
                <th scope="col">#</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((item, index)=>{
                return(
                  <tr key={index}>
                    <td data-label='Customer'>{item.customer}</td>
                    <td data-label='Topic'>{item.topic}</td>
                    <td data-label='Status'>
                      <span className="badge" style={{backgroundColor: item.status === 'Open' ? '#5cb85c' : '#999'}}>
                        {item.status}
                      </span>
                    </td>
                    <td data-label='Registered'>{item.createdFormat}</td>
                    <td data-label='#'>
                      <button 
                      className="action" 
                      style={{backgroundColor: '#3583f6'}}
                      onClick={()=>toggleModal(item)}>
                        <FiSearch color="#fff" size={17}/>
                      </button>
                      <Link to={`/new/${item.id}`} className="action" style={{backgroundColor: '#f6a935'}}>
                        <FiEdit2 color="#fff" size={17}/>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          
          {loadingMore && <h3>Searching for more calls...</h3>}
          {!loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Search more</button>}
          </>
        )}
      </div>

      {showPostModal && (
        <Modal
          content={detail}
          close={ ()=>setShowPostModal(!showPostModal) }
        />
      )}

    </div>
  )
}
