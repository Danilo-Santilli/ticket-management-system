import { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlusCircle } from 'react-icons/fi';
import './new.css';
import { db } from '../../services/firebaseConnection';
import { getDoc, collection, getDocs, doc, addDoc } from 'firebase/firestore';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const listRef = collection(db, 'customers');

export default function New(){
	const { user } = useContext(AuthContext);
	const { id } = useParams();

	const [customers, setCustomers] = useState([]);
	const [loadCustomer, setLoadCustomer] = useState(true);
	const [customerSelected, setCustomerSelected] = useState(0);

	const [complemento, setComplemento] = useState('');
	const [assunto, setAssunto] = useState('Suporte');
	const [status, setStatus] = useState('Aberto');
	const [idCustomer, setIdCustomer] = useState(false);

	useEffect(() => {
		async function loadCustomers() {
			const querySnapshot = await getDocs(listRef)
				.then((snapshot) => {
					let lista = [];
					snapshot.forEach((doc) => {
						lista.push({
							id: doc.id,
							nomeFantasia: doc.data().nomeFantasia
						});
					});
	
					if (snapshot.docs.size === 0) {
						console.log('Nenhuma empresa encontrada!');
						setCustomers([{ id: '1', nomeFantasia: 'Freela' }]);
						setLoadCustomer(false);
						return;
					}
	
					setCustomers(lista); // Define a lista de clientes com base nos dados obtidos do banco de dados
					setLoadCustomer(false); // Define que o carregamento dos clientes está concluído
	
					if (id) {
						loadId(lista); // Se um ID específico estiver presente, carrega os dados do chamado correspondente
					}
				})
				.catch((error) => {
					console.log('Erro ao buscar os clientes', error);
					setLoadCustomer(false); // Define que o carregamento dos clientes falhou
					setCustomers([{ id: '1', nomeFantasia: 'Freela' }]);
				});
		}
	
		loadCustomers(); // Executa a função para carregar os clientes
	
	}, [id]);
	

	async function loadId(lista) {
		const docRef = doc(db, 'chamados', id); // Referência ao documento do chamado com o ID fornecido
		await getDoc(docRef)
			.then((snapshot) => {
				// Quando os dados do documento são obtidos com sucesso
				setAssunto(snapshot.data().assunto); // Define o valor do campo 'assunto' com base nos dados do chamado
				setStatus(snapshot.data().status); // Define o valor do campo 'status' com base nos dados do chamado
				setComplemento(snapshot.data().complemento); // Define o valor do campo 'complemento' com base nos dados do chamado
	
				// Encontra o índice do cliente associado ao chamado na lista de clientes
				let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
				setCustomerSelected(index); // Define o valor do campo 'customerSelected' com base no índice encontrado
				setIdCustomer(true); // Define que o ID do cliente está definido (true)
			})
			.catch((error) => {
				// Em caso de erro ao obter os dados do chamado
				console.log(error);
				setIdCustomer(false); // Define que o ID do cliente não está definido (false)
			});
	}
	

	function handleOptionChange(e){
		setStatus(e.target.value);
	}

	function handleChangeSelect(e){
		setAssunto(e.target.value);
	}

	function handleChangeCustomer(e){
		setCustomerSelected(e.target.value);
	}

	async function handleRegister(e){
		e.preventDefault();

		if (idCustomer) {
			alert('Editando Chamado!');
			return;
		}

		await addDoc(collection(db, 'chamados'), {
			created: new Date(),
			cliente: customers[customerSelected].nomeFantasia,
			clienteId: customers[customerSelected].id,
			assunto: assunto,
			status: status,
			complemento: complemento,
			userId: user.uid
		})
		.then(()=>{
			toast.success('Chamado registrado!');
			setComplemento('');
			setCustomerSelected(0);
		})
		.catch((error)=>{
			console.log(error);
			toast.error('Algo deu errado!');
		})
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