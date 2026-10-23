import { Link } from "react-router-dom";

function Cabecalho({ usuario }) {
  return (
    <header className="cabecalho">
      <h1>Achados e Perdidos IFRN</h1>
      <nav>
        <Link to="/">Início</Link>
        <br/>
        <Link to="/novo">+ Novo item</Link>
      </nav>
      <p>
        Olá, {usuario?.nome}
      </p>
    </header>
  );
}

export default Cabecalho;