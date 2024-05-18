document.addEventListener('DOMContentLoaded', function() {
    const addProdutoBtn = document.getElementById('add-produto-btn');
    const produtoLista = document.querySelector('.produto-lista');
    const nenhumProdutoMsg = document.querySelector('.nenhum-produto');

    addProdutoBtn.addEventListener('click', function(e) {
        e.preventDefault();

        const nomeLivro = document.getElementById('nome-livro').value;
        const genero = document.getElementById('genero').value;
        const autor = document.getElementById('autor').value;
        const imagemInput = document.getElementById('imagem');
        const imagemArquivo = imagemInput.files[0];

        if (nomeLivro === '' || genero === '' || autor === '' || !imagemArquivo) {
            alert('Por favor, preencha todos os campos e adicione uma imagem');
            return;
        }

        const produtoCard = document.createElement('div');
        produtoCard.classList.add('produto-card');

        const reader = new FileReader();
        reader.onload = function(event) {
            const imagemURL = event.target.result;
            produtoCard.innerHTML = `
                <img src="${imagemURL}" alt="${nomeLivro}" class="produto-imagem">
                <h3>${nomeLivro}</h3>
                <div class="produto-info">
                    <p>${genero}</p>
                    <p>${autor}</p>
                    <span class="delete-icon">&times;</span>
                </div>
            `;
            produtoLista.appendChild(produtoCard);
            nenhumProdutoMsg.style.display = 'none';

            const deleteIcon = produtoCard.querySelector('.delete-icon');
            deleteIcon.addEventListener('click', function() {
                produtoCard.remove();
                if (produtoLista.children.length === 0) {
                    nenhumProdutoMsg.style.display = 'block';
                }
            });
        };
        reader.readAsDataURL(imagemArquivo);

        // Limpar os campos do formulário
        document.getElementById('nome-livro').value = '';
        document.getElementById('genero').value = '';
        document.getElementById('autor').value = '';
        document.getElementById('imagem').value = '';
    });
});

const produtosContainer = document.querySelector('.produto-lista');
const form = document.querySelector('#formulario form');
const nomeInput = form.querySelector('input[name="nome"]');
const generoInput = form.querySelector('input[name="genero"]');
const autorInput = form.querySelector('input[name="autor"]');
const imagemInput = form.querySelector('input[name="imagem"]');

// Função para buscar produtos
async function fetchProdutos() {
  const response = await fetch('http://localhost:3000/produtos');
  const produtos = await response.json();
  renderProdutos(produtos);
}

// Função para renderizar produtos
function renderProdutos(produtos) {
  produtosContainer.innerHTML = '';
  if (produtos.length === 0) {
    produtosContainer.innerHTML = '<p>Nenhum produto foi adicionado</p>';
  } else {
    produtos.forEach(produto => {
      const card = document.createElement('div');
      card.classList.add('produto-card');
      card.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}" class="produto-imagem">
        <h3>${produto.nome}</h3>
        <div class="produto-info">
          <p>${produto.genero}</p>
          <p>${produto.autor}</p>
          <span class="delete-icon" data-id="${produto.id}">🗑️</span>
        </div>
      `;
      produtosContainer.appendChild(card);
    });
  }
}

// Função para adicionar produto
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const novoProduto = {
    nome: nomeInput.value,
    genero: generoInput.value,
    autor: autorInput.value,
    imagem: imagemInput.value
  };

  const response = await fetch('http://localhost:3000/produtos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(novoProduto)
  });

  const produtoAdicionado = await response.json();
  fetchProdutos();
  form.reset(); // Limpar o formulário após adicionar
});

// Função para deletar produto
produtosContainer.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete-icon')) {
    const id = e.target.dataset.id;
    await fetch(`http://localhost:3000/produtos/${id}`, {
      method: 'DELETE'
    });
    fetchProdutos();
  }
});

// Inicializar a lista de produtos
fetchProdutos();
