// Catálogo de filmes simulado (usando dados de exemplo)
const movies = [
    { id: 1, title: "A Origem", price: 7.99, genre: "ficcao", year: 2010, img: "https://via.placeholder.com/200x300/627192/FFFFFF?text=A+Origem" },
    { id: 2, title: "O Poderoso Chefão", price: 5.99, genre: "drama", year: 1972, img: "https://via.placeholder.com/200x300/40594F/FFFFFF?text=Poderoso+Chefao" },
    { id: 3, title: "Vingadores: Ultimato", price: 9.99, genre: "acao", year: 2019, img: "https://via.placeholder.com/200x300/C84C32/FFFFFF?text=Ultimato" },
    { id: 4, title: "Clube da Luta", price: 6.99, genre: "drama", year: 1999, img: "https://via.placeholder.com/200x300/70577F/FFFFFF?text=Clube+da+Luta" },
    { id: 5, title: "Deadpool", price: 8.99, genre: "comedia", year: 2016, img: "https://via.placeholder.com/200x300/8B0000/FFFFFF?text=Deadpool" },
    { id: 6, title: "Blade Runner 2049", price: 7.99, genre: "ficcao", year: 2017, img: "https://via.placeholder.com/200x300/3A4F4F/FFFFFF?text=Blade+Runner" },
];

let cart = []; // Carrinho de locação
let currentSearchItems = []; // Itens que aparecem no dropdown de busca

// --- Funções de Inicialização e Renderização ---

/**
 * Renderiza o catálogo de filmes na tela.
 * @param {Array} movieList - Lista de filmes a serem renderizados.
 */
function renderMovies(movieList) {
    const movieListDiv = document.getElementById('movieList');
    movieListDiv.innerHTML = ''; // Limpa a lista atual

    if (movieList.length === 0) {
        movieListDiv.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">Nenhum filme encontrado com estes critérios.</p>';
        return;
    }

    movieList.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <img src="${movie.img}" alt="${movie.title}">
            <div class="movie-info">
                <h4>${movie.title}</h4>
                <p>Gênero: ${movie.genre.toUpperCase()} | Ano: ${movie.year}</p>
                <button class="rent-button" onclick="addToCart(${movie.id})">ALUGAR POR R$ ${movie.price.toFixed(2).replace('.', ',')}</button>
            </div>
        `;
        movieListDiv.appendChild(movieCard);
    });
}

// Inicializa a renderização quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    renderMovies(movies);
    updateCartDisplay();
});


// --- Funcionalidades de Busca e Filtro ---

/**
 * Filtra filmes com base na busca e nos filtros de gênero.
 */
function filterMovies() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const genreFilter = document.getElementById('genreFilter').value.toLowerCase();
    const searchResultsDiv = document.getElementById('searchResults');

    const filtered = movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm) || 
                              movie.genre.toLowerCase().includes(searchTerm) ||
                              String(movie.year).includes(searchTerm);
        
        const matchesGenre = genreFilter === 'todos' || movie.genre === genreFilter;
        
        return matchesSearch && matchesGenre;
    });

    // Se houver termo de busca, mostra o dropdown de resultados preditivos
    if (searchTerm.length > 0) {
        currentSearchItems = filtered.slice(0, 5); // Limita 5 itens para o preditivo
        renderSearchResults(currentSearchItems);
    } else {
        searchResultsDiv.style.display = 'none';
        renderMovies(filtered); // Mostra no catálogo principal se não houver busca ativa no input
    }
    
    // Se o filtro de gênero for alterado, sempre renderiza o catálogo principal
    if (genreFilter !== 'todos' && searchTerm.length === 0) {
        renderMovies(filtered);
    }
}

/**
 * Renderiza os resultados no dropdown de busca preditiva.
 * @param {Array} results - Lista de filmes para o dropdown.
 */
function renderSearchResults(results) {
    const searchResultsDiv = document.getElementById('searchResults');
    searchResultsDiv.innerHTML = '';

    if (results.length > 0) {
        results.forEach(movie => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <img src="${movie.img}" alt="${movie.title}">
                <div>
                    <h5>${movie.title}</h5>
                    <p>R$ ${movie.price.toFixed(2).replace('.', ',')} | ${movie.year}</p>
                </div>
            `;
            // Ao clicar no item preditivo, limpa a busca e exibe o filme
            resultItem.onclick = () => {
                document.getElementById('searchInput').value = movie.title;
                searchResultsDiv.style.display = 'none';
                renderMovies([movie]); // Exibe apenas o filme selecionado no catálogo
            };
            searchResultsDiv.appendChild(resultItem);
        });
        searchResultsDiv.style.display = 'block';
    } else {
        searchResultsDiv.style.display = 'none';
    }
}

// Oculta o dropdown se clicar fora
document.addEventListener('click', (e) => {
    if (!document.getElementById('searchInput').contains(e.target) && !document.getElementById('searchResults').contains(e.target)) {
        document.getElementById('searchResults').style.display = 'none';
    }
});


// --- Funcionalidades de Carrinho (Adicionar e Remover) ---

/**
 * Adiciona um filme ao carrinho.
 * @param {number} movieId - ID do filme.
 */
function addToCart(movieId) {
    const movie = movies.find(m => m.id === movieId);
    if (movie && !cart.some(item => item.id === movieId)) {
        // Para este exemplo simples, um filme só pode ser alugado uma vez.
        cart.push(movie); 
        updateCartDisplay();
        showToast(`"${movie.title}" adicionado ao carrinho!`);
    } else if (cart.some(item => item.id === movieId)) {
        showToast(`"${movie.title}" já está no carrinho.`, 'red');
    }
    // Abre o carrinho após adicionar, para feedback imediato
    document.getElementById('cartSidebar').classList.add('open');
}

/**
 * Remove um filme do carrinho.
 * @param {number} movieId - ID do filme.
 */
function removeFromCart(movieId) {
    const movieTitle = cart.find(item => item.id === movieId).title;
    cart = cart.filter(item => item.id !== movieId);
    updateCartDisplay();
    showToast(`"${movieTitle}" removido do carrinho.`, 'orange');
}

/**
 * Atualiza o sidebar do carrinho e o contador do header.
 */
function updateCartDisplay() {
    const cartItemsUl = document.getElementById('cartItems');
    const cartCountSpan = document.getElementById('cartCount');
    const cartTotalSpan = document.getElementById('cartTotal');
    
    cartItemsUl.innerHTML = ''; // Limpa a lista

    let total = 0;
    
    if (cart.length === 0) {
        cartItemsUl.innerHTML = '<li style="text-align: center; padding: 20px;">Seu carrinho está vazio.</li>';
    } else {
        cart.forEach(item => {
            total += item.price;
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="item-info">
                    <h5>${item.title}</h5>
                    <p>R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
            `;
            cartItemsUl.appendChild(li);
        });
    }

    cartCountSpan.textContent = cart.length;
    cartTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

/**
 * Alterna a visibilidade do sidebar do carrinho.
 */
function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
}

// --- Fluxo de Checkout (Compra) ---

/**
 * Inicia o fluxo de checkout (abrir modal e ir para o Passo 1).
 */
function checkout() {
    if (cart.length === 0) {
        showToast("Adicione filmes antes de finalizar!", 'red');
        return;
    }
    toggleCart(); // Fecha o sidebar do carrinho
    
    // Resetar para o Passo 1
    document.getElementById('checkoutStep1').style.display = 'block';
    document.getElementById('checkoutStep2').style.display = 'none';
    document.getElementById('checkoutStep3').style.display = 'none';

    // Preenche a lista de revisão
    const checkoutItemsUl = document.getElementById('checkoutItemsList');
    const checkoutTotalDisplay = document.getElementById('checkoutTotalDisplay');
    checkoutItemsUl.innerHTML = '';
    
    let total = 0;
    cart.forEach(item => {
        total += item.price;
        const li = document.createElement('li');
        li.textContent = `${item.title} - R$ ${item.price.toFixed(2).replace('.', ',')}`;
        checkoutItemsUl.appendChild(li);
    });

    checkoutTotalDisplay.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    // Abre o modal
    document.getElementById('checkoutModal').style.display = 'block';
}

/**
 * Avança ou retrocede nos passos do checkout.
 * @param {number} step - O número do passo (1, 2 ou 3).
 */
function nextStep(step) {
    document.getElementById('checkoutStep1').style.display = 'none';
    document.getElementById('checkoutStep2').style.display = 'none';
    document.getElementById('checkoutStep3').style.display = 'none';
    
    document.getElementById(`checkoutStep${step}`).style.display = 'block';

    // Esconde o botão de finalizar pagamento ao mudar de passo (exceto no último)
    document.getElementById('finalizePurchaseBtn').style.display = 'none';
    document.getElementById('paymentFormArea').innerHTML = ''; // Limpa formulário de pagamento
}

/**
 * Exibe a forma de pagamento selecionada (Simulação).
 * @param {string} method - Método de pagamento ('pix', 'card' ou 'paypal').
 */
function showPaymentForm(method) {
    const paymentFormArea = document.getElementById('paymentFormArea');
    paymentFormArea.innerHTML = '';

    let formHtml = '';
    if (method === 'pix') {
        formHtml = `
            <div class="payment-form">
                <h4>Pagamento via PIX</h4>
                <p>Chave PIX LocaFlix: **000.111.222-33**</p>
                <p>Valor: ${document.getElementById('checkoutTotalDisplay').textContent}</p>
                <p>A locação será liberada automaticamente após a confirmação do pagamento.</p>
                <p style="font-size: 0.8em; color: #aaa;">*(Simulação de API de Pagamento)</p>
            </div>
        `;
    } else if (method === 'card') {
        formHtml = `
            <div class="payment-form">
                <h4>Pagamento com Cartão</h4>
                <input type="text" placeholder="Número do Cartão" style="width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 4px;">
                <input type="text" placeholder="Nome Impresso" style="width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 4px;">
                </div>
        `;
    } else if (method === 'paypal') {
        formHtml = `
            <div class="payment-form">
                <h4>Pagamento via PayPal</h4>
                <p>Você será redirecionado para o ambiente seguro do PayPal.</p>
                </div>
        `;
    }

    paymentFormArea.innerHTML = formHtml;
    document.getElementById('finalizePurchaseBtn').style.display = 'block'; // Mostra o botão para ir ao passo 3
}

/**
 * Fecha o modal de checkout.
 */
function closeModal() {
    document.getElementById('checkoutModal').style.display = 'none';
}

/**
 * Limpa o carrinho após a compra.
 */
function resetCart() {
    cart = [];
    updateCartDisplay();
    renderMovies(movies); // Renderiza o catálogo completo novamente
}

// --- Funcionalidade de Notificação Flutuante (Toast) ---

/**
 * Exibe uma notificação rápida na tela.
 * @param {string} message - A mensagem a ser exibida.
 * @param {string} color - Cor de fundo (opcional).
 */
function showToast(message, color = 'green') {
    const toast = document.getElementById('toastNotification');
    toast.textContent = message;
    toast.style.backgroundColor = color;
    toast.className = "toast show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}