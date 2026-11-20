document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const menuIcon = menuToggle.querySelector('i');

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('mobile-active');
    
    // Switch icon between bars and xmark
    if (navMenu.classList.contains('mobile-active')) {
      menuIcon.classList.remove('fa-bars');
      menuIcon.classList.add('fa-xmark');
    } else {
      menuIcon.classList.remove('fa-xmark');
      menuIcon.classList.add('fa-bars');
    }
  });

  // Close mobile menu when clicking a nav link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-active');
      menuIcon.classList.remove('fa-xmark');
      menuIcon.classList.add('fa-bars');
    });
  });

  // 2. Header Scroll Effect
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 3. Active Link Highlight on Scroll
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 120)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });

  // 4. Products Filter & Slider Scroll Reset Logic
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  const productsGrid = document.getElementById('products-grid');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      // Scroll container back to start when filter changes
      if (productsGrid) {
        productsGrid.scrollTo({ left: 0, behavior: 'smooth' });
      }

      productCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 5. Products Slider Navigation Logic (Page / Block Scroll)
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (productsGrid && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      // Scroll by visible width of the grid container (multi-card scroll)
      const scrollAmount = productsGrid.clientWidth;
      productsGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      // Scroll by visible width of the grid container (multi-card scroll)
      const scrollAmount = productsGrid.clientWidth;
      productsGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  // ==========================================================================
  // 6. PAKET SERVİS & WHATSAPP SEPET SİSTEMİ MANTIĞI
  // ==========================================================================

  const WHATSAPP_PHONE = '905418616951';

  // State
  let cart = [];
  try {
    const savedCart = localStorage.getItem('aed_cart');
    if (savedCart) cart = JSON.parse(savedCart);
  } catch (e) {
    cart = [];
  }

  // DOM Elements
  const headerCartBtn = document.getElementById('header-cart-btn');
  const headerCartBadge = document.getElementById('header-cart-badge');
  const floatingCartBtn = document.getElementById('floating-cart-btn');
  const floatingCartBadge = document.getElementById('floating-cart-badge');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartStartShopping = document.getElementById('cart-start-shopping');
  const cartEmpty = document.getElementById('cart-empty');
  const cartItemsWrapper = document.getElementById('cart-items-wrapper');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartTotalCount = document.getElementById('cart-total-count');
  const cartClearBtn = document.getElementById('cart-clear-btn');
  const cartFooter = document.getElementById('cart-footer');
  const whatsappOrderBtn = document.getElementById('btn-whatsapp-order');
  const toastContainer = document.getElementById('toast-container');

  // Form Fields
  const orderName = document.getElementById('order-name');
  const orderPhone = document.getElementById('order-phone');
  const orderAddress = document.getElementById('order-address');
  const orderNote = document.getElementById('order-note');

  // Load Saved Customer Info
  try {
    const savedCustomer = JSON.parse(localStorage.getItem('aed_customer_info'));
    if (savedCustomer) {
      if (orderName && savedCustomer.name) orderName.value = savedCustomer.name;
      if (orderPhone && savedCustomer.phone) orderPhone.value = savedCustomer.phone;
      if (orderAddress && savedCustomer.address) orderAddress.value = savedCustomer.address;
    }
  } catch (e) {}

  // Helpers
  function saveCart() {
    try {
      localStorage.setItem('aed_cart', JSON.stringify(cart));
    } catch (e) {}
    renderCart();
  }

  function showToast(message, icon = 'fa-circle-check') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  function openCart() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.add('active');
      cartOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCart() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('active');
      cartOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Render Cart UI
  function renderCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    if (headerCartBadge) headerCartBadge.textContent = totalItems;
    if (floatingCartBadge) floatingCartBadge.textContent = totalItems;
    if (cartTotalCount) cartTotalCount.textContent = totalItems;

    if (cart.length === 0) {
      if (cartEmpty) cartEmpty.style.display = 'block';
      if (cartItemsWrapper) cartItemsWrapper.style.display = 'none';
      if (cartFooter) cartFooter.style.display = 'none';
      return;
    }

    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartItemsWrapper) cartItemsWrapper.style.display = 'block';
    if (cartFooter) cartFooter.style.display = 'block';

    if (cartItemsList) {
      cartItemsList.innerHTML = cart.map((item, index) => `
        <div class="cart-item" data-index="${index}">
          <img src="${item.img}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <h4 class="cart-item-name">${item.name}</h4>
            <span class="cart-item-weight">${item.weight}</span>
          </div>
          <div class="cart-item-controls">
            <button class="qty-btn btn-qty-minus" data-index="${index}" aria-label="Azalt">-</button>
            <span class="qty-count">${item.qty}</span>
            <button class="qty-btn btn-qty-plus" data-index="${index}" aria-label="Artır">+</button>
            <button class="cart-item-remove btn-item-remove" data-index="${index}" aria-label="Sil">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
      `).join('');

      // Add event listeners for list controls
      cartItemsList.querySelectorAll('.btn-qty-minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
          if (cart[idx].qty > 1) {
            cart[idx].qty -= 1;
            saveCart();
          } else {
            const removedName = cart[idx].name;
            cart.splice(idx, 1);
            saveCart();
            showToast(`${removedName} sepetten çıkarıldı.`);
          }
        });
      });

      cartItemsList.querySelectorAll('.btn-qty-plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
          cart[idx].qty += 1;
          saveCart();
        });
      });

      cartItemsList.querySelectorAll('.btn-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
          const removedName = cart[idx].name;
          cart.splice(idx, 1);
          saveCart();
          showToast(`${removedName} sepetten çıkarıldı.`);
        });
      });
    }
  }

  // Add To Cart Listeners (Product Cards)
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      const card = btn.closest('.product-card');
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const img = btn.getAttribute('data-img');

      // Get selected weight/amount
      let weight = '1 Kg';
      const select = card ? card.querySelector('.weight-select') : null;
      if (select) weight = select.value;

      // Check if item already exists in cart with same weight
      const existingItem = cart.find(item => item.id === id && item.weight === weight);
      if (existingItem) {
        existingItem.qty += 1;
      } else {
        cart.push({ id, name, weight, img, qty: 1 });
      }

      saveCart();
      showToast(`${name} (${weight}) sepete eklendi!`, 'fa-cart-arrow-down');

      // Visual feedback on button
      const originalHTML = btn.innerHTML;
      btn.innerHTML = `<i class="fa-solid fa-check"></i> Eklendi`;
      btn.style.backgroundColor = '#16a34a';
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.backgroundColor = '';
      }, 1000);
    });
  });

  // Drawer Toggle Events
  if (headerCartBtn) headerCartBtn.addEventListener('click', openCart);
  if (floatingCartBtn) floatingCartBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
  if (cartStartShopping) {
    cartStartShopping.addEventListener('click', () => {
      closeCart();
    });
  }

  // Clear Cart Event
  if (cartClearBtn) {
    cartClearBtn.addEventListener('click', () => {
      if (confirm('Sepetinizdeki tüm ürünleri silmek istediğinize emin misiniz?')) {
        cart = [];
        saveCart();
        showToast('Sepetiniz temizlendi.', 'fa-trash-can');
      }
    });
  }

  // WhatsApp Order Submission
  if (whatsappOrderBtn) {
    whatsappOrderBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Sepetinizde ürün bulunmamaktadır.');
        return;
      }

      const name = orderName ? orderName.value.trim() : '';
      const phone = orderPhone ? orderPhone.value.trim() : '';
      const address = orderAddress ? orderAddress.value.trim() : '';
      const note = orderNote ? orderNote.value.trim() : '';
      
      const paymentRadio = document.querySelector('input[name="payment-method"]:checked');
      const paymentMethod = paymentRadio ? paymentRadio.value : 'Kapıda Nakit';

      // Validation
      if (!name) {
        alert('Lütfen adınızı ve soyadınızı giriniz.');
        if (orderName) orderName.focus();
        return;
      }

      if (!phone || phone.length < 10) {
        alert('Lütfen geçerli bir telefon numarası giriniz.');
        if (orderPhone) orderPhone.focus();
        return;
      }

      if (!address || address.length < 10) {
        alert('Lütfen Alanya içi teslimat adresinizi eksiksiz giriniz.');
        if (orderAddress) orderAddress.focus();
        return;
      }

      // Save customer info for future convenience
      try {
        localStorage.setItem('aed_customer_info', JSON.stringify({ name, phone, address }));
      } catch (e) {}

      // Build WhatsApp Message
      let msg = `🥩 *ALANYA ET DÜNYASI - PAKET SERVİS SİPARİŞİ* 🛵\n`;
      msg += `----------------------------------\n`;
      msg += `👤 *Müşteri:* ${name}\n`;
      msg += `📞 *Telefon:* ${phone}\n`;
      msg += `📍 *Teslimat Adresi:* ${address}\n`;
      msg += `💳 *Ödeme Tercihi:* ${paymentMethod}\n`;
      msg += `🛵 *Teslimat:* Alanya İçi Ücretsiz (Min. 500 TL)\n`;
      if (note) {
        msg += `📝 *Sipariş Notu:* ${note}\n`;
      }
      msg += `----------------------------------\n`;
      msg += `🛒 *Sipariş Edilen Ürünler:*\n`;

      cart.forEach(item => {
        msg += `• ${item.qty} Adet - ${item.name} (${item.weight})\n`;
      });

      msg += `----------------------------------\n`;
      msg += `⚠️ *Bilgilendirme:* Sipariş üzerine taze tartım yapılarak hazırlanmaktadır.`;

      // Redirect to WhatsApp
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
  });

  // Initial render
  renderCart();
});
