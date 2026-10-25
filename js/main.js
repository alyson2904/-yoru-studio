(() => {
  // --- CONFIGURACIÓN ---
  const WHATSAPP_NUMBER = "525664921229"; 
  
  // --- LÓGICA DEL CARRITO ---
  // Función para obtener el carrito actual
  window.getCart = () => {
    return JSON.parse(localStorage.getItem('yoru_cart')) || [];
  };

  // Función para guardar el carrito y actualizar la vista
  window.saveCart = (cart) => {
    localStorage.setItem('yoru_cart', JSON.stringify(cart));
    window.updateCartUI();
  };

  // Actualizar el contador rojo del menú superior
  window.updateCartUI = () => {
    const cart = window.getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Busca todos los botones del carrito en la página actual
    document.querySelectorAll('.nav-btn.cart').forEach(btn => {
      const span = btn.querySelector('span');
      if (span) {
        span.textContent = totalItems;
      } else {
        // Si el botón no tiene un span, lo crea
        btn.innerHTML += `<span>${totalItems}</span>`;
      }
    });
  };

  // Añadir producto desde la página de producto
  window.addToCart = (id, title, price, img) => {
    let cart = window.getCart();
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id, title, price, img, quantity: 1 });
    }
    
    window.saveCart(cart);
    alert(`"${title}" añadido al carrito.`);
  };

  // --- FINALIZAR COMPRA POR WHATSAPP ---
  window.checkoutWhatsApp = () => {
    const cart = window.getCart();
    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    let message = "¡Hola YORU STUDIO! Me gustaría comprar los siguientes productos:\n\n";
    let total = 0;

    cart.forEach((item, index) => {
      const priceNumber = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      const subtotal = priceNumber * item.quantity;
      total += subtotal;
      message += `${index + 1}. ${item.title} (x${item.quantity}) - $${subtotal} MXN\n`;
    });

    message += `\n*Total aproximado:* $${total} MXN\n`;
    message += `\nPor favor, confírmenme la disponibilidad.`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // --- LÓGICA DEL MENÚ MÓVIL ---
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => menu.classList.toggle('active'));
  }

  // --- INICIALIZACIÓN ---
  // Apenas cargue cualquier página, actualizamos el contador
  document.addEventListener('DOMContentLoaded', () => {
    window.updateCartUI();
  });
})();
