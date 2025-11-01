import { Link } from "react-router";

export const Header = () => {

    return (
        <header>
            <h1> Header</h1>
            <Link to='/transacoes'>transaçoes</Link>
        </header>
    );
}

export default Header;