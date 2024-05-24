// Funções para lidar com requisições HTTP
async function getProdutos() {
  try {
    const response = await fetch('http://localhost:3000/produtos'); // URL da API
    const produtos = await response.json();
    return produtos;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  }
}

async function postProduto(novoProduto) {
  try {
    const response = await fetch('http://localhost:3000/produtos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novoProduto)
    });
    const produtoAdicionado = await response.json();
    return produtoAdicionado;
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
  }
}

async function deleteProduto(id) {
  try {
    const response = await fetch(`http://localhost:3000/produtos/${id}`, {
      method: 'DELETE'
    });
    return response.ok; 
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
  }
}

// Função para buscar e renderizar produtos
async function fetchProdutos() {
  try {
    const produtos = await getProdutos();
    renderProdutos(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  }
}

// Função para renderizar produtos
function renderProdutos(produtos) {
  const produtosContainer = document.querySelector('.produto-lista'); // Seleciona o container correto
  produtosContainer.innerHTML = ''; 

  produtos.forEach(produto => {
    const produtoElement = document.createElement('div');
    produtoElement.classList.add('produto-card'); // Adiciona a classe 'produto-card'

    const nome = document.createElement('h3');
    nome.textContent = produto.nome;
    produtoElement.appendChild(nome);

    const genero = document.createElement('p');
    genero.textContent = `Gênero: ${produto.genero}`;
    produtoElement.appendChild(genero);

    const autor = document.createElement('p');
    autor.textContent = `Autor: ${produto.autor}`;
    produtoElement.appendChild(autor);

    const imagem = document.createElement('img');
    imagem.src = produto.imagem;
    imagem.classList.add('produto-imagem'); // Adiciona a classe 'produto-imagem'
    produtoElement.appendChild(imagem);

    const botaoExcluir = document.createElement('button');
    botaoExcluir.classList.add('excluir');
    botaoExcluir.textContent = 'Excluir';
    botaoExcluir.dataset.id = produto.id;

    botaoExcluir.addEventListener('click', async () => {
      try {
        await deleteProduto(botaoExcluir.dataset.id);
        fetchProdutos();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
      }
    });

    produtoElement.appendChild(botaoExcluir);

    produtosContainer.appendChild(produtoElement);
  });
}

// Função para adicionar produto
document.addEventListener('DOMContentLoaded', function() {
  // Seleciona os elementos do formulário depois que o DOM estiver carregado
  const form = document.querySelector('form');
  const nomeInput = document.querySelector('#nome');
  const generoInput = document.querySelector('#genero');
  const autorInput = document.querySelector('#autor');
  const imagemInput = document.querySelector('#imagem'); // input para o upload de imagem

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Gera um ID aleatório para o novo produto
    const novoId = Math.floor(Math.random() * 1000000);
    const novoIdString = novoId.toString();

    const novoProduto = {
      id: novoIdString, // Adiciona o ID ao objeto novoProduto
      nome: nomeInput.value,
      genero: generoInput.value,
      autor: autorInput.value,
      imagem: imagemInput.value // Recupera o nome do arquivo da imagem
    };

    try {
      const produtoAdicionado = await postProduto(novoProduto);
      fetchProdutos(); // Atualiza a lista de produtos após adicionar
      form.reset(); // Limpa o formulário após o envio
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  });

  fetchProdutos(); 
});