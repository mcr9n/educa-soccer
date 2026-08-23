import '../style/NotAutenticated.css';
import { Link } from 'react-router-dom';
function NotAuthenticated() {
    return (
        <div className="container">
            <h1>Você não está autenticado</h1>
            <Link to="/" >
                Retornar a página principal
            </Link>
        </div>
    )
}
export default NotAuthenticated;