const BASE_URL = 'http://localhost:3000/produtos'; // Define a URL base da API

// Método GET para buscar todos os produtos
async function getProdutos() {
  try {
    const response = await fetch(BASE_URL);
    const produtos = await response.json();
    return produtos;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  }
}

// Método POST para criar um novo produto
async function postProduto(novoProduto) {
  try {
    const response = await fetch(BASE_URL, {
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

// Método DELETE para excluir um produto
async function deleteProduto(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    return response.ok; // Retorna true se a exclusão foi bem-sucedida
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
  }
}

// Exporta as funções para serem usadas em outros arquivos
export { getProdutos, postProduto, deleteProduto }; 