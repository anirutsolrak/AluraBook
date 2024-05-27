// Funções para lidar com requisições HTTP
async function getProdutos() {
  try {
    const response = await fetch('https://api-alura-book-lilac.vercel.app/produtos'); // URL da API
    const produtos = await response.json();
    return produtos;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  }
}

async function postProduto(novoProduto) {
  try {
    const response = await fetch('https://api-alura-book-lilac.vercel.app/produtos', {
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
    const response = await fetch(`https://api-alura-book-lilac.vercel.app/produtos/${id}`, {
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

    const contentDiv = document.createElement('div'); // Adicione um div para conter o conteúdo do card
    contentDiv.classList.add('card-content');

    const nome = document.createElement('h3');
    nome.textContent = produto.nome;
    contentDiv.appendChild(nome);

    const genero = document.createElement('p');
    genero.textContent = `Gênero: ${produto.genero}`;
    contentDiv.appendChild(genero);

    const autor = document.createElement('p');
    autor.textContent = `Autor: ${produto.autor}`;
    contentDiv.appendChild(autor);

    const imagem = document.createElement('img');
    imagem.src = produto.imagem;
    imagem.classList.add('produto-imagem'); 
    contentDiv.appendChild(imagem);

    produtoElement.appendChild(contentDiv); // Adicione a div ao produto-card

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
