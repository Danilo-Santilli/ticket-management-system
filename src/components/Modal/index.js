import './modal.css';
import { FiX } from 'react-icons/fi';

export default function Modal({content, close}){
  return(
    <div className='modal'>
      <div className="container">
        <button className='close' onClick={ close }>
          <FiX size={25} color='#fff'/>
          Close
        </button>

        <main>
          <h2>Call detail</h2>

          <div className="row">
            <span>Customer: <i>{content.customer}</i></span>
          </div>

          <div className="row">
            <span>Topic: <i>{content.topic}</i></span>
            <span>Created in: <i>{content.createdFormat}</i></span>
          </div>

          <div className="row">
            <span>Status: 
              <i className='status-badge' style={{
                color: '#fff', 
                backgroundColor: content.status === 'Open' ? '#5cb85c' : '#999'}}>
                {content.status}
              </i></span>
          </div>

          {content.complement !== '' && (
            <>
              <h3>Complement:</h3>
              <p>{content.complement}</p>
            </>
          )}
        </main>
      </div>
    </div>
  )
}