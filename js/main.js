(() => {
  // --- CONFIGURACIÓN ---
  const WHATSAPP_NUMBER = "525664921229"; 
  
  // --- LÓGICA DEL CARRITO (LocalStorage) ---
  window.cart = JSON.parse(localStorage.getItem('yoru_cart')) || [];

  // Guardar carrito
  window.saveCart = () => {
    localStorage.setItem('yoru_cart', JSON.stringify(window.cart));
    updateCartUI();
  };

  // Añadir producto
  window.addToCart = (id, title, price, img) => {
    const existingItem = window.cart.find(item => item.id === id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      window.cart.push({ id, title, price, img, quantity: 1 });
    }
    window.saveCart();
    
    // Feedback visual rápido
    alert(`"${title}" añadido al carrito.`);
  };

  // Actualizar contador en el header
  window.updateCartUI = () => {
    const cartBtn = document.querySelector('.nav-btn.cart');
    if (cartBtn) {
      const totalItems = window.cart.reduce((sum, item) => sum + item.quantity, 0);
      // Buscamos el texto actual y lo reemplazamos solo con el número
      cartBtn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        ${totalItems}
      `;
    }
  };

  // --- LÓGICA DEL MENÚ Y BUSCADOR ---
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => menu.classList.toggle('active'));
  }

  const searchToggle = document.getElementById('searchToggle');
  const searchForm = document.getElementById('searchForm');
  if (searchToggle && searchForm) {
    searchToggle.addEventListener('click', () => {
      searchForm.classList.toggle('active');
      if(searchForm.classList.contains('active')) searchForm.querySelector('input').focus();
    });
  }

  // --- FINALIZAR COMPRA POR WHATSAPP ---
  window.checkoutWhatsApp = () => {
    if (window.cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    let message = "¡Hola YORU STUDIO! Me gustaría comprar los siguientes productos:\n\n";
    let total = 0;

    window.cart.forEach((item, index) => {
      // Limpiamos el precio de caracteres raros para poder sumar (ej. "$250 MXN" -> 250)
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

  // Inicializar UI del carrito al cargar la página
  document.addEventListener('DOMContentLoaded', () => {
    window.updateCartUI();
  });
})();
