
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function Detalhe() {
  const { id } = useParams();
  const navegar = useNavigate();

  const [item, setItem] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [devolvidoPara, setDevolvidoPara] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  async function carregarItem() {
    try {
      setCarregando(true);
      setErro("");

      const resposta = await api.get(`/itens/${id}`);
      setItem(resposta.data);
    } catch (erro) {
      setErro(
        erro.response?.data?.detail ||
          "Não foi possível carregar o item."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarItem();
  }, [id]);

  async function excluirItem() {
    try {
      await api.delete(`/itens/${id}`);
      navegar("/");
    } catch (erro) {
      setErro(
        erro.response?.data?.detail ||
          "Não foi possível excluir o item."
      );
    }
  }

  async function marcarDevolvido(evento) {
    evento.preventDefault();
    setErro("");
    setMensagem("");

    try {
      setEnviando(true);

      await api.patch(`/itens/${id}/devolver`, {
        devolvido_para: devolvidoPara,
      });

      setMensagem("Item marcado como devolvido!");
      setDevolvidoPara("");
      await carregarItem();
    } catch (erro) {
      setErro(
        erro.response?.data?.detail ||
          "Não foi possível registrar a devolução."
      );
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) return <p>Carregando item...</p>;

  if (erro && !item) {
    return (
      <section>
        <p>{String(erro)}</p>
        <Link to="/">Voltar</Link>
      </section>
    );
  }

  if (!item) return <p>Item não encontrado.</p>;

  return (
    <section>
      <p>
        <Link to="/">← Voltar</Link>
      </p>

      <h2>{item.nome}</h2>

      <p>
        <strong>Status:</strong>{" "}
        {item.status === "aguardando" ? "Aguardando" : "Devolvido"}
      </p>

      <p><strong>Descrição:</strong> {item.descricao}</p>
      <p><strong>Categoria:</strong> {item.categoria}</p>
      <p><strong>Local:</strong> {item.local}</p>
      <p><strong>Encontrado em:</strong> {item.data_encontrado}</p>
      <p>
        <strong>Devolvido para:</strong>{" "}
        {item.devolvido_para || "Ainda não devolvido"}
      </p>

      {erro && <p>{String(erro)}</p>}
      {mensagem && <p>{mensagem}</p>}

      <div className="acoes-detalhe">
        <Link to={`/editar/${item.id}`}>Editar</Link>

        <button type="button" onClick={excluirItem}>
          Excluir
        </button>
      </div>

      {item.status === "aguardando" && (
        <form onSubmit={marcarDevolvido} className="form-devolucao">
          <h3>Marcar como devolvido</h3>

          <input
            type="text"
            placeholder="Nome de quem recebeu"
            value={devolvidoPara}
            onChange={(e) => setDevolvidoPara(e.target.value)}
            required
          />

          <button type="submit" disabled={enviando}>
            {enviando ? "Confirmando..." : "Confirmar"}
          </button>
        </form>
      )}
    </section>
  );
}

export default Detalhe;
