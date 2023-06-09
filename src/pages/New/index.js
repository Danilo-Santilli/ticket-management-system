import { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlusCircle } from 'react-icons/fi';
import './new.css';
import { db } from '../../services/firebaseConnection';
import { getDoc, collection, getDocs, doc, addDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

const listRef = collection(db, 'customers');

export default function New(){
	const { user } = useContext(AuthContext);
	const { id } = useParams();
	const navigate = useNavigate();

	const [customers, setCustomers] = useState([]);
	const [loadCustomer, setLoadCustomer] = useState(true);
	const [customerSelected, setCustomerSelected] = useState(0);

	const [complement, setComplement] = useState('');
	const [topic, setTopic] = useState('Support');
	const [status, setStatus] = useState('Open');
	const [idCustomer, setIdCustomer] = useState(false);

	useEffect(()=>{
		async function loadCustomers(){
			const querySnapshot = await getDocs(listRef)
			.then((snapshot)=>{
				let list = [];
				snapshot.forEach((doc)=>{
					list.push({
						id: doc.id,
						fantasyName: doc.data().fantasyName
					})
				})

				if (snapshot.docs.size === 0) {
					console.log('No company found!');
					setCustomers([{id: '1', fantasyName: 'Freela'}]);
					setLoadCustomer(false);
					return;
				}

				setCustomers(list);
				setLoadCustomer(false);

				if (id) {
					loadId(list);
				}
			})
			.catch((error)=>{
				console.log('Error when searching for customers', error);
				setLoadCustomer(false);
				setCustomers([{id: '1', fantasyName: 'Freela'}]);
			})
		}

		loadCustomers();
	}, [id]);

	async function loadId(list){
		const docRef = doc(db, 'calls', id);
		await getDoc(docRef)
		.then((snapshot)=>{
			setTopic(snapshot.data().topic);
			setStatus(snapshot.data().status);
			setComplement(snapshot.data().complement);

			let index = list.findIndex(item => item.id === snapshot.data().cutomerId);
			setCustomerSelected(index);
			setIdCustomer(true);
		})
		.catch((error)=>{
			console.log(error);
			setIdCustomer(false);
		})
	}

	function handleOptionChange(e){
		setStatus(e.target.value);
	}

	function handleChangeSelect(e){
		setTopic(e.target.value);
	}

	function handleChangeCustomer(e){
		setCustomerSelected(e.target.value);
	}

	async function handleRegister(e){
		e.preventDefault();

		if (idCustomer) {
			const docRef = doc(db, 'calls', id)
			await updateDoc(docRef, {
				customer: customers[customerSelected].fantasyName,
				customerId: customers[customerSelected].id,
				topic: topic,
				status: status,
				complement: complement,
				userId: user.uid
			})
			.then(()=>{
				toast.success('Successfully updated!');
				setCustomerSelected(0);
				setComplement('');
				navigate('/dashboard');
			})
			.catch((error)=>{
				console.log(error);
				toast.error('Something went wrong with the update');
			})
			return;
		}

		await addDoc(collection(db, 'calls'), {
			created: new Date(),
			customer: customers[customerSelected].fantasyName,
			customerId: customers[customerSelected].id,
			topic: topic,
			status: status,
			complement: complement,
			userId: user.uid
		})
		.then(()=>{
			toast.success('Registered call!');
			setComplement('');
			setCustomerSelected(0);
		})
		.catch((error)=>{
			console.log(error);
			toast.error('Something went wrong!');
		})
	}

	return(
		<div>
			<Header/>
			<div className="content">
				<Title name={id ? 'Editing call' : 'New call'}>
					<FiPlusCircle size={25}/>
				</Title>
				<div className="container">
					<form className='form-profile' onSubmit={handleRegister}>
						<label>Customers:</label>
						{
							loadCustomer ? (
								<input type='text' disabled={true} value='Loading...'/>
							) : (
								<select 
								value={customerSelected} 
								onChange={handleChangeCustomer}>
									{customers.map((item, index)=>{
										return(
											<option key={index} value={index}>
												{item.fantasyName}
											</option>
										)
									})}
								</select>
							)
						}

						<label>Topic:</label>
						<select 
						onChange={handleChangeSelect}
						value={topic}>
							<option value='Support'>Support</option>
							<option value='Technical visit'>Technical visit</option>
							<option value='Finances'>Finances</option>
						</select>

						<label>Status:</label>
						<div className="status">
							<input type="radio"
							name='radio'
							value='Open'
							onChange={handleOptionChange}
							checked={ status === 'Open' }
							/>
							<span>Open</span>

							<input type="radio"
							name='radio'
							value='Progress'
							onChange={handleOptionChange}
							checked={ status === 'Progress' }
							/>
							<span>Progress</span>
							
							<input type="radio"
							name='radio'
							value='Attended'
							onChange={handleOptionChange}
							checked={ status === 'Attended' }
							/>
							<span>Attended</span>
						</div>

						<label htmlFor="">Complement</label>
						<textarea 
						placeholder='Describe your problem (optional)'
						value={complement}
						onChange={(e)=>setComplement(e.target.value)}></textarea>
						
						<button type='submit'>Register</button>
					</form>
				</div>
			</div>
		</div>
	)
}