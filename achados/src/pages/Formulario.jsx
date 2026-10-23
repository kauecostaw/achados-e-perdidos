
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import FormularioItem from "../components/FormularioItem";

function Formulario() {
  const { id } = useParams();
  const navegar = useNavigate();
  const editando = Boolean(id);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [local, setLocal] = useState("");
  const [data, setData] = useState("");

  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        setErro("");

        const [resCategorias, resLocais] = await Promise.all([
          api.get("/categorias"),
          api.get("/locais"),
        ]);

        setCategorias(resCategorias.data);
        setLocais(resLocais.data);

        if (editando) {
          const resposta = await api.get(`/itens/${id}`);
          const item = resposta.data;

          setNome(item.nome);
          setDescricao(item.descricao);
          setCategoria(item.categoria);
          setLocal(item.local);
          setData(item.data_encontrado);
        }
      } catch (erro) {
        setErro(
          erro.response?.data?.detail ||
            "Não foi possível carregar os dados."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [id, editando]);

  async function salvar(evento) {
    evento.preventDefault();
    setErro("");
    setCarregando(true);

    const dados = {
      nome,
      descricao,
      categoria,
      local,
      data_encontrado: data,
    };

    try {
      if (editando) {
        await api.put(`/itens/${id}`, dados);
      } else {
        await api.post("/itens", dados);
      }

      navegar("/");
    } catch (erro) {
      setErro(
        erro.response?.data?.detail ||
          "Não foi possível salvar o item."
      );
    } finally {
      setCarregando(false);
    }
  }

  if (carregando) {
    return <p>Carregando formulário...</p>;
  }

  return (
    <section>
      <h2>{editando ? "Editar item" : "Novo item"}</h2>

      {erro && <p>{String(erro)}</p>}

      <FormularioItem
        nome={nome}
        setNome={setNome}
        descricao={descricao}
        setDescricao={setDescricao}
        categoria={categoria}
        setCategoria={setCategoria}
        local={local}
        setLocal={setLocal}
        data={data}
        setData={setData}
        categorias={categorias}
        locais={locais}
        aoEnviar={salvar}
        carregando={carregando}
      />

      <p>
        <Link to="/">Cancelar</Link>
      </p>
    </section>
  );
}

export default Formulario;
