// Banco de dados inicial carregado no LocalStorage se não existir
const defaultCupcakes = [
    { id: 1, name: "Red Velvet Premium", price: 12.00, tag: "Mais Vendido", img: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=300" },
    { id: 2, name: "Chocolate Belga e Ninho", price: 14.00, tag: "Tradicional", img: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=300" },
    { id: 3, name: "Morango Zero Açúcar", price: 15.00, tag: "Sem Açúcar", img: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300" },
    { id: 4, name: "Churros Doce de Leite", price: 13.50, tag: "Especial", img: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=300" },
    { id: 5, name: "Pistache Supremo", price: 16.00, tag: "Gourmet", img: "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=300" },
    { id: 6, name: "Maracujá Azedinho", price: 13.00, tag: "Frutas", img: "https://images.unsplash.com/photo-1519869325930-281384150729?w=300" }
];

let cupcakes = JSON.parse(localStorage.getItem('cupcakes_db')) || defaultCupcakes;
let cart = [];
let orders = JSON.parse(localStorage.getItem('orders_db')) || [
    { id: 1042, client: "Ana Ramos", address: "Av. Portugal, 450 - Santo André", items: "2x Red Velvet, 1x Sem Açúcar", status: "Em Preparação" }
];

// Salva dados no LocalStorage
function saveData() {
    localStorage.setItem('cupcakes_db', JSON.stringify(cupcakes));
    localStorage.setItem('orders_db', JSON.stringify(orders));
}

// Renderiza a Vitrine
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
                <button class="btn-primary" onclick="addToCart(${c.id})">+ Adicionar</button>
            </div>
        `;
    });
}

// Troca de abas (SPA)
function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if (btn) btn.classList.add('active');
    
    if(tabId === 'entregador') renderDeliveryOrders();
}

// Carrinho
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
                    <small>R$ ${item.price.toFixed(2)} x ${item.qty}</small>
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

function filterCupcakes(text) {
    const filtered = cupcakes.filter(c => c.name.toLowerCase().includes(text.toLowerCase()) || c.tag.toLowerCase().includes(text.toLowerCase()));
    renderCupcakes(filtered);
}

function copyPix() {
    navigator.clipboard.writeText(document.getElementById('pix-code').innerText);
    alert("Código PIX copiado para a área de transferência!");
}

// Finaliza Checkout e insere no painel do Entregador
function checkout() {
    const address = document.getElementById('address').value;
    if (cart.length === 0) return alert("Seu carrinho está vazio!");
    if (!address) return alert("Por favor, informe seu endereço de entrega!");

    const newOrder = {
        id: Math.floor(1000 + Math.random() * 9000),
        client: "Cliente App",
        address: address,
        items: cart.map(i => `${i.qty}x ${i.name}`).join(', '),
        status: "Em Preparação"
    };

    orders.push(newOrder);
    saveData();

    document.getElementById('order-status').style.display = 'block';
    document.getElementById('email-confirmation').innerText = `📧 Confirmação do Pedido #${newOrder.id} enviada para o e-mail cadastrado (US12).`;
    
    cart = [];
    updateCart();
    alert("Pedido enviado com sucesso!");
}

// Cadastra novos sabores
function addCupcake() {
    const name = document.getElementById('new-name').value;
    const price = parseFloat(document.getElementById('new-price').value);
    const tag = document.getElementById('new-tag').value || "Novidade";

    if (name && price) {
        cupcakes.push({
            id: Date.now(),
            name: name,
            price: price,
            tag: tag,
            img: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=300"
        });
        saveData();
        renderCupcakes();
        alert("Novo sabor adicionado com sucesso!");
    } else {
        alert("Preencha nome e preço do produto!");
    }
}

// Painel do Entregador
function renderDeliveryOrders() {
    const container = document.getElementById('delivery-orders');
    container.innerHTML = '';
    orders.forEach(o => {
        container.innerHTML += `
            <div class="checkout-card">
                <h4>Pedido #${o.id} (US07)</h4>
                <p><b>Cliente:</b> ${o.client}</p>
                <p><b>Endereço:</b> ${o.address}</p>
                <p><b>Itens:</b> ${o.items}</p>
                <p><b>Status:</b> ${o.status}</p>
                <button class="btn-primary" style="background:#1976d2; margin-top:8px;" onclick="updateOrderStatus(${o.id})">Marcar como Entregue (US14)</button>
            </div>
        `;
    });
}

function updateOrderStatus(id) {
    const order = orders.find(o => o.id === id);
    if(order) {
        order.status = "ENTREGUE";
        saveData();
        renderDeliveryOrders();
        alert(`Pedido #${id} atualizado para ENTREGUE!`);
    }
}

// Inicialização
renderCupcakes();
