
function FormularioItem({
  nome,
  setNome,
  descricao,
  setDescricao,
  categoria,
  setCategoria,
  local,
  setLocal,
  data,
  setData,
  categorias,
  locais,
  aoEnviar,
  carregando,
}) {
  return (
    <form onSubmit={aoEnviar}>
      <label>Nome</label>
      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />

      <label>Descrição</label>
      <textarea
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        required
      />

      <label>Categoria</label>
      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        required
      >
        <option value="">Selecione</option>
        {categorias.map((item, indice) => (
          <option key={indice} value={item}>
            {item}
          </option>
        ))}
      </select>

      <label>Local</label>
      <select
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        required
      >
        <option value="">Selecione</option>
        {locais.map((item, indice) => (
          <option key={indice} value={item}>
            {item}
          </option>
        ))}
      </select>

      <label>Data em que foi encontrado</label>
      <input
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
        required
      />

      <button type="submit" disabled={carregando}>
        {carregando ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}

export default FormularioItem;
