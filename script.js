// JSON
let dados = {
  "categorias": [
    { "id": 1, "nome": "Alimentação", "tipo": "despesa" },
    { "id": 2, "nome": "Transporte", "tipo": "despesa" },
    { "id": 3, "nome": "Moradia", "tipo": "despesa" },
    { "id": 4, "nome": "Salário", "tipo": "receita" }
  ]
};

let abaAtual = "despesa"; // Aba ativa por padrão
let idCategoriaSelecionada = null; // ID da categoria selecionada

const formulario = document.getElementById("formulario-categoria");
const campoCategoriaId = document.getElementById("categoria-id");
const campoNome = document.getElementById("nome");
const tituloFormulario = document.getElementById("titulo-formulario");
const btnSalvar = document.getElementById("btn-salvar");
const btnLimpar = document.getElementById("btn-limpar");

const listaCategorias = document.getElementById("lista-categorias");
const botoesAbas = document.querySelectorAll(".btn-aba");

const btnEditar = document.getElementById("btn-editar");
const btnExcluir = document.getElementById("btn-excluir");

function renderizarCategorias() {
  listaCategorias.innerHTML = "";
  
  // Filtrar as categorias de acordo com a aba selecionada
  const filtradas = dados.categorias.filter(cat => cat.tipo === abaAtual);

  if (filtradas.length === 0) {
    listaCategorias.innerHTML = `<li style="color: #a0aec0; text-align: center; padding: 12px;">Nenhuma categoria cadastrada.</li>`;
  } else {
    filtradas.forEach(cat => {
      const li = document.createElement("li");
      li.classList.add("item-categoria");
      li.textContent = cat.nome;

      if (cat.id === idCategoriaSelecionada) {
        li.classList.add("selecionado");
      }

      // Evento ao clicar em um item da lista
      li.addEventListener("click", () => selecionarCategoria(cat.id));
      listaCategorias.appendChild(li);
    });
  }

  atualizarBotoesAcao();
}

// Seleção de Categoria na Lista
function selecionarCategoria(id) {
  if (idCategoriaSelecionada === id) {
    idCategoriaSelecionada = null; // Desseleciona se clicar no mesmo item
  } else {
    idCategoriaSelecionada = id;
  }
  renderizarCategorias();
}

// Habilitar e desabilitar os botões de Editar e Excluir
function atualizarBotoesAcao() {
  const possuiSelecao = idCategoriaSelecionada !== null;
  btnEditar.disabled = !possuiSelecao;
  btnExcluir.disabled = !possuiSelecao;
}

// Alternar entre as abas de Receita e Despesa
botoesAbas.forEach(botao => {
  botao.addEventListener("click", () => {
    botoesAbas.forEach(b => b.classList.remove("ativo"));
    botao.classList.add("ativo");
    
    abaAtual = botao.getAttribute("data-aba");
    idCategoriaSelecionada = null; // Limpa seleção ao mudar de aba
    renderizarCategorias();
  });
});

// Limpar o formulário e resetar estados
function limparFormulario() {
  formulario.reset();
  campoCategoriaId.value = "";
  tituloFormulario.textContent = "Nova categoria";
  btnSalvar.textContent = "Adicionar categoria";
  idCategoriaSelecionada = null;
  renderizarCategorias();
}

btnLimpar.addEventListener("click", limparFormulario);

// Cadastrar ou atualizar uma categoria
formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = campoNome.value.trim();
  const tipo = formulario.elements["tipo"].value;
  const id = campoCategoriaId.value;

  if (!nome) return;

  if (id) {
    // Atualizar categoria já existente
    const indice = dados.categorias.findIndex(cat => cat.id === Number(id));
    if (indice !== -1) {
      dados.categorias[indice].nome = nome;
      dados.categorias[indice].tipo = tipo;
    }
  } else {
    // Adicionar uma nova categoria
    const novaCategoria = {
      id: Date.now(), // gerar um ID automaticamente
      nome: nome,
      tipo: tipo
    };
    dados.categorias.push(novaCategoria);
  }

  limparFormulario();
  // Alterna para a aba correspondente ao tipo salvo
  abaAtual = tipo;
  document.querySelector(`.btn-aba[data-aba="${tipo}"]`).click();
});

// Ação do botão Editar
btnEditar.addEventListener("click", () => {
  if (!idCategoriaSelecionada) return;

  const categoria = dados.categorias.find(cat => cat.id === idCategoriaSelecionada);
  if (categoria) {
    campoCategoriaId.value = categoria.id;
    campoNome.value = categoria.nome;
    formulario.elements["tipo"].value = categoria.tipo;

    tituloFormulario.textContent = "Editar categoria";
    btnSalvar.textContent = "Salvar alterações";
  }
});

// Ação do botão Excluir
btnExcluir.addEventListener("click", () => {
  if (!idCategoriaSelecionada) return;

  dados.categorias = dados.categorias.filter(cat => cat.id !== idCategoriaSelecionada);
  limparFormulario();
});

// Inicializar a tela
renderizarCategorias();