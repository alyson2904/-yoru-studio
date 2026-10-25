(() => {
  // --- CONFIGURACIÓN ---
  const WHATSAPP_NUMBER = "525664921229"; 
  
  // Usamos localStorage para que el carrito persista entre páginas
  let cart = JSON.parse(localStorage.getItem('yoru_cart')) || [];

  // Guardar carrito
  window.saveCart = () => {
    localStorage.setItem('yoru_cart', JSON.stringify(cart));
    window.updateCartUI();
  };

  // Añadir producto
  window.addToCart = (id, title, price, img) => {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id, title, price, img, quantity: 1 });
    }
    window.saveCart();
    alert(`"${title}" añadido al carrito.`);
  };

  // Actualizar el número en el icono del carrito (en TODAS las páginas)
  window.updateCartUI = () => {
    // Recargamos el carrito desde el storage para asegurar que estamos leyendo lo último
    cart = JSON.parse(localStorage.getItem('yoru_cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartBtns = document.querySelectorAll('.nav-btn.cart');
    cartBtns.forEach(btn => {
      let span = btn.querySelector('span');
      if (span) {
        span.textContent = totalItems;
      } else {
        btn.innerHTML += `<span>${totalItems}</span>`;
      }
    });
  };

  // Obtener el carrito actual
  window.getCart = () => {
    return JSON.parse(localStorage.getItem('yoru_cart')) || [];
  };

  // --- FINALIZAR COMPRA POR WHATSAPP ---
  window.checkoutWhatsApp = () => {
    const currentCart = window.getCart();
    if (currentCart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    let message = "¡Hola YORU STUDIO! Me gustaría comprar los siguientes productos:\n\n";
    let total = 0;

    currentCart.forEach((item, index) => {
      const priceNumber = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      const subtotal = priceNumber * item.quantity;
      total += subtotal;

      message += `${index + 1}. ${item.title} (x${item.quantity}) - $${subtotal} MXN\n`;
    });

    message += `\n*Total aproximado:* $${total} MXN\n`;
    message += `\nPor favor, confírmenme la disponibilidad y los métodos de pago.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  // Inicializar contador al cargar cualquier página
  document.addEventListener('DOMContentLoaded', () => {
    window.updateCartUI();
  });

})();
