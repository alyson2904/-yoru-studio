(() => {
  const WHATSAPP_NUMBER = "525664921229"; 
  
  window.getCart = () => {
    return JSON.parse(localStorage.getItem('yoru_cart')) || [];
  };

  window.saveCart = (cart) => {
    localStorage.setItem('yoru_cart', JSON.stringify(cart));
    window.updateCartUI();
  };

  window.updateCartUI = () => {
    const cart = window.getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Actualiza todos los botones de carrito en la pantalla
    document.querySelectorAll('.nav-btn.cart').forEach(btn => {
      const span = btn.querySelector('span');
      if (span) {
        span.textContent = totalItems;
      } else {
        btn.innerHTML += `<span>${totalItems}</span>`;
      }
    });
  };

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

  window.checkoutWhatsApp = () => {
    const cart = window.getCart();
    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    let message = "¡Hola YORU STUDIO! Me gustaría comprar:\n\n";
    let total = 0;
    cart.forEach((item, index) => {
      const priceNumber = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      const subtotal = priceNumber * item.quantity;
      total += subtotal;
      message += `${index + 1}. ${item.title} (x${item.quantity}) - $${subtotal} MXN\n`;
    });
    message += `\n*Total aproximado:* $${total} MXN\n`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Lógica del menú
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => menu.classList.toggle('active'));
  }

  // --- SOLUCIÓN A LA CACHÉ DEL NAVEGADOR ---
  // 1. Al cargar la página por primera vez
  document.addEventListener('DOMContentLoaded', window.updateCartUI);

  // 2. Cuando regresas a la pestaña o usas el botón "Atrás" del celular
  window.addEventListener('pageshow', window.updateCartUI);
  
  // 3. Cuando la pestaña vuelve a ser visible
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      window.updateCartUI();
    }
  });
})();
