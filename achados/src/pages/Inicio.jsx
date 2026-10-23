
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Inicio() {
  const [itens, setItens] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);

  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");
  const [categoria, setCategoria] = useState("");
  const [local, setLocal] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarItens() {
    try {
      setCarregando(true);
      setErro("");

      const [resItens, resCategorias, resLocais] = await Promise.all([
        api.get("/itens"),
        api.get("/categorias"),
        api.get("/locais"),
      ]);

      setItens(resItens.data);
      setCategorias(resCategorias.data);
      setLocais(resLocais.data);
    } catch (erro) {
      setErro(
        erro.response?.data?.detail ||
          "Não foi possível carregar os dados. Verifique sua chave."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarItens();
  }, []);

  const itensFiltrados = itens.filter((item) => {
    const texto = busca.toLowerCase();

    const correspondeBusca =
      item.nome.toLowerCase().includes(texto) ||
      item.descricao.toLowerCase().includes(texto);

    const correspondeStatus = !status || item.status === status;
    const correspondeCategoria =
      !categoria || item.categoria === categoria;
    const correspondeLocal = !local || item.local === local;

    return (
      correspondeBusca &&
      correspondeStatus &&
      correspondeCategoria &&
      correspondeLocal
    );
  });

  if (carregando) {
    return <p>Carregando itens...</p>;
  }

  if (erro) {
    return (
      <section>
        <p>{String(erro)}</p>
        <button onClick={carregarItens}>Tentar novamente</button>
      </section>
    );
  }

  return (
    <section>
      <div className="titulo-lista">
        <h2>Itens encontrados</h2>
        <Link to="/novo">+ Novo item</Link>
      </div>

      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por nome ou descrição..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Todos os status</option>
          <option value="aguardando">Aguardando devolução</option>
          <option value="devolvido">Devolvido</option>
        </select>

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categorias.map((opcao, i) => (
            <option key={i} value={opcao}>
              {opcao}
            </option>
          ))}
        </select>

        <select
          value={local}
          onChange={(e) => setLocal(e.target.value)}
        >
          <option value="">Todos os locais</option>
          {locais.map((opcao, i) => (
            <option key={i} value={opcao}>
              {opcao}
            </option>
          ))}
        </select>
      </div>

      {itensFiltrados.length === 0 ? (
        <p>Nenhum item encontrado.</p>
      ) : (
        <div className="lista-itens">
          {itensFiltrados.map((item) => (
            <article className="card-item" key={item.id}>
              <h3>{item.nome}</h3>
              <p>{item.descricao}</p>
              <p>Categoria: {item.categoria}</p>
              <p>Local: {item.local}</p>
              <p>
                Status:{" "}
                {item.status === "aguardando"
                  ? "Aguardando devolução"
                  : "Devolvido"}
              </p>

              <Link to={`/item/${item.id}`}>Ver detalhes</Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Inicio;
