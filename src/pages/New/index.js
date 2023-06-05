import { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlusCircle } from 'react-icons/fi';
import './new.css';
import { db } from '../../services/firebaseConnection';
import { getDoc, collection, getDocs, doc, addDoc } from 'firebase/firestore';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';

const listRef = collection(db, 'customers');

export default function New(){
	const { user } = useContext(AuthContext);

	const [customers, setCustomers] = useState([]);
	const [loadCustomer, setLoadCustomer] = useState(true);
	const [customerSelected, setCustomerSelected] = useState(0);

	const [complemento, setComplemento] = useState('');
	const [assunto, setAssunto] = useState('Suporte');
	const [status, setStatus] = useState('Aberto');

	useEffect(()=>{
		async function loadCustomers(){
			const querySnapshot = await getDocs(listRef)
			.then((snapshot)=>{
				let lista = [];
				snapshot.forEach((doc)=>{
					lista.push({
						id: doc.id,
						nomeFantasia: doc.data().nomeFantasia
					})
				})

				if (snapshot.docs.size === 0) {
					console.log('Nenhuma empresa encontrada!');
					setCustomers([{id: '1', nomeFantasia: 'Freela'}]);
					setLoadCustomer(false);
					return;
				}

				setCustomers(lista);
				setLoadCustomer(false);
			})
			.catch((error)=>{
				console.log('Erro ao buscar os clientes', error);
				setLoadCustomer(false);
				setCustomers([{id: '1', nomeFantasia: 'Freela'}]);
			})
		}

		loadCustomers();
	}, []);

	function handleOptionChange(e){
		setStatus(e.target.value);
	}

	function handleChangeSelect(e){
		setAssunto(e.target.value);
	}

	function handleChangeCustomer(e){
		setCustomerSelected(e.target.value);
	}

	async function handleRegister(e) {
		e.preventDefault();
	
		// Adiciona um novo documento à coleção 'chamados'
		await addDoc(collection(db, 'chamados'), {
			created: new Date(), // Define a data de criação do chamado como a data atual
			cliente: customers[customerSelected].nomeFantasia, // Obtém o nomeFantasia do cliente selecionado
			clienteId: customers[customerSelected].id, // Obtém o ID do cliente selecionado
			assunto: assunto, // Obtém o assunto do chamado
			status: status, // Obtém o status do chamado
			complemento: complemento, // Obtém o complemento do chamado
			userId: user.uid // Obtém o ID do usuário atualmente logado
		})
		.then(() => {
			toast.success('Chamado registrado!'); // Exibe uma mensagem de sucesso
			setComplemento(''); // Limpa o campo de complemento
			setCustomerSelected(0); // Reseta a seleção do cliente
		})
		.catch((error) => {
			console.log(error);
			toast.error('Algo deu errado!'); // Exibe uma mensagem de erro
		});
	}

	return(
		<div>
			<Header/>
			<div className="content">
				<Title name='Novo chamado'>
					<FiPlusCircle size={25}/>
				</Title>
				<div className="container">
					<form className='form-profile' onSubmit={handleRegister}>
						<label>Clientes:</label>
						{
							loadCustomer ? (
								<input type='text' disabled={true} value='Carregando...'/>
							) : (
								<select 
								value={customerSelected} 
								onChange={handleChangeCustomer}>
									{customers.map((item, index)=>{
										return(
											<option key={index} value={index}>
												{item.nomeFantasia}
											</option>
										)
									})}
								</select>
							)
						}

						<label>Assunto:</label>
						<select 
						onChange={handleChangeSelect}
						value={assunto}>
							<option value='Suporte'>Suporte</option>
							<option value='Visita técnica'>Visita técnica</option>
							<option value='Financeiro'>Financeiro</option>
						</select>

						<label>Status:</label>
						<div className="status">
							<input type="radio"
							name='radio'
							value='Aberto'
							onChange={handleOptionChange}
							checked={ status === 'Aberto' }
							/>
							<span>Em aberto</span>

							<input type="radio"
							name='radio'
							value='Progresso'
							onChange={handleOptionChange}
							checked={ status === 'Progresso' }
							/>
							<span>Progresso</span>
							
							<input type="radio"
							name='radio'
							value='Atendido'
							onChange={handleOptionChange}
							checked={ status === 'Atendido' }
							/>
							<span>Atendido</span>
						</div>

						<label htmlFor="">Complemento</label>
						<textarea 
						placeholder='Descreva seu problema (opcional)'
						value={complemento}
						onChange={(e)=>setComplemento(e.target.value)}></textarea>
						
						<button type='submit'>Registrar</button>
					</form>
				</div>
			</div>
		</div>
	)
}