// Carrinho
let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');

// Modal
let modal = document.getElementById("size-quantity-modal");
let closeModal = document.querySelector(".close");
let addCartButtons = document.getElementsByClassName("add-cart");
let confirmAddButton = document.getElementById("confirm-add");
let selectedSize = document.getElementById("size");
let selectedQuantity = document.getElementById("quantity");
let currentProductTitle = "";
let currentProductImg = ""; // Variável para armazenar a imagem do produto

// Abre o carrinho
cartIcon.onclick = () => {
    cart.classList.add('active');
};

// Fecha o carrinho
closeCart.onclick = () => {
    cart.classList.remove('active');
};

// Abre o modal ao clicar no botão de adicionar ao carrinho
for (let button of addCartButtons) {
    button.addEventListener("click", function(event) {
        let productBox = button.parentElement;
        currentProductTitle = productBox.getElementsByClassName("product-title")[0].innerText;
        currentProductImg = productBox.getElementsByClassName("product-img")[0].src; // Armazena a imagem

        // Atualiza o conteúdo do modal
        document.getElementById("modal-product-title").innerText = currentProductTitle;
        document.getElementById("modal-product-img").src = currentProductImg;

        modal.style.display = "block"; // Abre o modal
    });
}

// Fecha o modal
closeModal.onclick = function() {
    modal.style.display = "none";
};

// Fecha o modal ao clicar fora dele
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// Adiciona o produto ao carrinho com as opções selecionadas
confirmAddButton.onclick = function() {
    let size = selectedSize.value;
    let quantity = selectedQuantity.value;
    addProductToCart(currentProductTitle, currentProductImg, size, quantity); // Passa a imagem
    modal.style.display = "none"; // Fecha o modal após adicionar
};

// Remover itens
if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);   
} else {
    ready();
}

function ready() {
    var removeCartButtons = document.getElementsByClassName('cart-remove');
    for (var i = 0; i < removeCartButtons.length; i++) {
        var button = removeCartButtons[i];
        button.addEventListener('click', removeCartItem);
    }

    // Mudança Quantidade
    var quantityInputs = document.getElementsByClassName('cart-quantity');
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }
}

function removeCartItem(event) {
    var buttonClicked = event.target;
    // Remove o elemento pai que contém o item do carrinho
    buttonClicked.closest('.cart-box').remove(); // Usando closest para garantir que removemos o elemento correto
}

// Mudança Quantidade
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
}

// Adicionar ao carrinho
function addProductToCart(title, img, size, quantity) { // Recebe a imagem como parâmetro
    var cartShopBox = document.createElement('div');
    cartShopBox.classList.add('cart-box');

    var cartItems = document.getElementsByClassName('cart-content');
    var cartItemsNames = cartItems[0].getElementsByClassName('cart-product-title');
    
    for (var i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText === title) {
            alert('Você já adicionou este produto no carrinho!');
            return;
        }
    }

    var cartBoxContent = `  
        <img src="${img}" alt="" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title} - Tamanho: ${size}</div>
            <input type="number" value="${quantity}" class="cart-quantity">
            <span class="cart-remove"><i class='bx bx-trash'></i></span> <!-- Ícone de lixeira -->
        </div>
    `;
    cartShopBox.innerHTML = cartBoxContent;
    document.getElementsByClassName('cart-content')[0].append(cartShopBox);
    cartShopBox.getElementsByClassName('cart-remove')[0].addEventListener('click', removeCartItem);
}

// Seleciona os elementos do modal
let finalizationModal = document.getElementById("finalization-modal");
let closeFinalizationModal = document.getElementById("close-finalization-modal");
let confirmOrderButton = document.getElementById("confirm-order");
let deliveryOption = document.getElementById("delivery-option");
let addressContainer = document.getElementById("address-container");
let errorMessage = document.getElementById("error-message");

// Abre o modal de finalização ao clicar no botão de finalizar pedido
document.querySelector('.btn-buy').onclick = () => {
    finalizationModal.style.display = "block";
};

// Fecha o modal
closeFinalizationModal.onclick = function() {
    finalizationModal.style.display = "none";
};

// Controla a visibilidade do campo de endereço
deliveryOption.onchange = function() {
    addressContainer.style.display = this.value === "entregar" ? "block" : "none";
};

// Envia o pedido
confirmOrderButton.onclick = function() {
    let name = document.getElementById("customer-name").value;
    let phone = document.getElementById("customer-phone").value;
    let delivery = deliveryOption.value;
    let address = document.getElementById("address").value;

    if (!name || !phone || (delivery === "entregar" && !address)) {
        errorMessage.style.display = "block";
    } else {
        errorMessage.style.display = "none";
        
        // Envia o e-mail com os detalhes do pedido
        sendEmail(name, phone, delivery, address);
        
        // Fecha o modal após o envio
        finalizationModal.style.display = "none";
        alert("Pedido confirmado! Você será notificado.");
    }
};

function sendEmail(name, phone, delivery, address) {
    // Coleta os itens do carrinho
    let cartItems = document.getElementsByClassName('cart-box');
    let orderDetails = [];

    for (let item of cartItems) {
        let title = item.getElementsByClassName('cart-product-title')[0].innerText;
        let quantity = item.getElementsByClassName('cart-quantity')[0].value;
        orderDetails.push(`${title} - Quantidade: ${quantity}`);
    }

    // Cria uma descrição completa dos pedidos
    let orderDescription = orderDetails.length > 0 ? orderDetails.join('\n') : 'Nenhum produto no carrinho';

    // Monta a mensagem do pedido
    const message = `MEU PEDIDO! \n` + 
                    `\n| Nome:\n ${name}\n` + 
                    `\n| Telefone:\n ${phone}\n` + 
                    `\n| Opção de entrega:\n ${delivery}\n` + 
                    `\n| Endereço:\n ${delivery === "entregar" ? address : 'Retirada na loja'}\n` + 
                    `\n| Produtos:\n` + 
                    orderDescription;

    console.log("Mensagem do Pedido:", message);

    // Envia o email
    const emailUrl = `mailto:aux.supervisao@auxiliarservicos.com.br?subject=Novo Pedido&body=${encodeURIComponent(message)}`;
    window.location.href = emailUrl;

    // Limpa o carrinho após o envio
    document.getElementsByClassName('cart-content')[0].innerHTML = ''; // Limpa o conteúdo do carrinho
}
