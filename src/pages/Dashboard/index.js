import { AuthContext } from "../../contexts/auth";
import { useContext } from "react";

export default function Dashboard(){
    const { logout } = useContext(AuthContext);

    async function handleLogout(){
        await logout();
    }

    return(
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleLogout}>Sair</button>
        </div>
    )
}
