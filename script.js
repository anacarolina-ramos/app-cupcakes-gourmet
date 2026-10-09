// Array inicial com os sabores de cupcakes da vitrine
let cupcakes = [
    { id: 1, name: "Red Velvet Premium", price: 12.00, tag: "Mais Vendido", img: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=300" },
    { id: 2, name: "Chocolate Belga e Ninho", price: 14.00, tag: "Tradicional", img: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=300" },
    { id: 3, name: "Morango Zero Açúcar", price: 15.00, tag: "Sem Açúcar", img: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300" },
    { id: 4, name: "Churros Doce de Leite", price: 13.50, tag: "Especial", img: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=300" },
    { id: 5, name: "Pistache Supremo", price: 16.00, tag: "Gourmet", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300" },
    { id: 6, name: "Maracujá Azedinho", price: 13.00, tag: "Frutas", img: "https://images.unsplash.com/photo-1519869325930-281384150729?w=300" }
];

// Array dinâmico do carrinho de compras
let cart = [];

// Função em JS para renderizar os cupcakes na página
function renderCupcakes(items = cupcakes) {
    const list = document.getElementById('cupcake-list');
    list.innerHTML = '';
    items.forEach(c => {
        list.innerHTML += `
            <div class="card">
                <img src="${c.img}" alt="${c.name}">
                <h4>${c.name}</h4>
                <p>${c.tag}</p>
                <div class="price">R$ ${c.price.toFixed(2)}</div>
                <button onclick="addToCart(${c.id})">+ Adicionar</button>
            </div>
        `;
    });
}

// Alterna entre as abas da aplicação (Single Page Application)
function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if (btn) btn.classList.add('active');
}

// Adiciona o item selecionado ao carrinho
function addToCart(id) {
    const prod = cupcakes.find(c => c.id === id);
    const inCart = cart.find(item => item.id === id);
    if (inCart) {
        inCart.qty++;
    } else {
        cart.push({ ...prod, qty: 1 });
    }
    updateCart();
}

// Atualiza o total e os itens visíveis no carrinho
function updateCart() {
    document.getElementById('cart-count').innerText = cart.reduce((a, b) => a + b.qty, 0);
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        cartContainer.innerHTML += `
            <div class="cart-item">
                <div>
                    <b>${item.name}</b><br>
                    <small>R$ ${item.price.toFixed(2)}</small>
                </div>
                <div>
                    <button class="btn-qty" onclick="changeQty(${item.id}, -1)">-</button>
                    <span style="margin: 0 5px;">${item.qty}</span>
                    <button class="btn-qty" onclick="changeQty(${item.id}, 1)">+</button>
                </div>
            </div>
        `;
    });
    document.getElementById('cart-total').innerText = total.toFixed(2);
}

// Modifica a quantidade de itens no carrinho
function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    updateCart();
}

// Filtro dinâmico de pesquisa de cupcakes
function filterCupcakes(text) {
    const filtered = cupcakes.filter(c => c.name.toLowerCase().includes(text.toLowerCase()) || c.tag.toLowerCase().includes(text.toLowerCase()));
    renderCupcakes(filtered);
}

// Copia o código PIX utilizando a Clipboard API do navegador
function copyPix() {
    navigator.clipboard.writeText(document.getElementById('pix-code').innerText);
    alert("Código PIX copiado com sucesso!");
}

// Finaliza a compra validando endereço e carrinho
function checkout() {
    if (cart.length === 0) return alert("Seu carrinho está vazio!");
    if (!document.getElementById('address').value) return alert("Por favor, informe seu endereço de entrega!");

    document.getElementById('order-status').style.display = 'block';
    alert("Pedido recebido pela loja com sucesso! (US09)");
}

// Cadastra um novo cupcake e atualiza a lista dinâmica
function addCupcake() {
    const name = document.getElementById('new-name').value;
    const price = parseFloat(document.getElementById('new-price').value);
    if (name && price) {
        cupcakes.push({ id: Date.now(), name, price, tag: "Novidade", img: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=300" });
        renderCupcakes();
        alert("Novo sabor cadastrado com sucesso! (US04)");
    }
}

// Inicializa a renderização da vitrine ao carregar a página
renderCupcakes();
