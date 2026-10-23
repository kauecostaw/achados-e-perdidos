
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import api from "./services/api";
import Inicio from "./pages/Inicio";
import Detalhe from "./pages/Detalhe";
import Formulario from "./pages/Formulario";
import Cabecalho from "./components/Cabecalho";

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const resposta = await api.get("/eu");
        setUsuario(resposta.data);
      } catch (erro) {
        console.error("Erro ao carregar usuário:", erro);
      }
    }

    carregarUsuario();
  }, []);

  return (
    <BrowserRouter>
      <Cabecalho usuario={usuario} />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/item/:id" element={<Detalhe />} />
          <Route path="/novo" element={<Formulario />} />
          <Route path="/editar/:id" element={<Formulario />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;