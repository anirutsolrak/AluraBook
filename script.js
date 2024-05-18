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