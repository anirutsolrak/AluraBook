// Funções para lidar com requisições HTTP
async function getProdutos() {
  try {
    const response = await fetch(process.env.JSON_SERVER_URL); // URL da API
    const produtos = await response.json();
    return produtos;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  }
}

async function postProduto(novoProduto) {
  try {
    const response = await fetch(process.env.JSON_SERVER_URL, {
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
    const response = await fetch(`${process.env.JSON_SERVER_URL}/${id}`, {
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
  const produtosContainer = document.querySelector('.produto-lista'); 
  produtosContainer.innerHTML = ''; 

  produtos.forEach(produto => {
    const produtoElement = document.createElement('div');
    produtoElement.classList.add('produto-card'); 

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
    imagem.classList.add('produto-imagem'); 
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
  const form = document.querySelector('form');
  const nomeInput = document.querySelector('#nome');
  const generoInput = document.querySelector('#genero');
  const autorInput = document.querySelector('#autor');
  const imagemInput = document.querySelector('#imagem'); 

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const novoId = Math.floor(Math.random() * 1000000);
    const novoIdString = novoId.toString();

    const novoProduto = {
      id: novoIdString,
      nome: nomeInput.value,
      genero: generoInput.value,
      autor: autorInput.value,
      imagem: imagemInput.value 
    };

    try {
      const produtoAdicionado = await postProduto(novoProduto);
      fetchProdutos(); 
      form.reset(); 
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  });

  fetchProdutos(); 
});