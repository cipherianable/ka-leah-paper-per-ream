document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const menuIcon = document.getElementById('menu-icon');
    const mobileNav = document.getElementById('mobile-navigation');

    if (menuIcon && mobileNav) {
        menuIcon.addEventListener('click', () => {
            const isExpanded = menuIcon.getAttribute('aria-expanded') === 'true';
            menuIcon.setAttribute('aria-expanded', !isExpanded);

            if (mobileNav.style.display === 'block') {
                mobileNav.style.display = 'none';
            } else {
                mobileNav.style.display = 'block';
                mobileNav.style.animation = 'fadeIn 0.3s ease-out';
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                mobileNav.style.display = 'none';
                menuIcon.setAttribute('aria-expanded', 'false');
            }
        });

        // Close when clicking links
        const links = mobileNav.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.style.display = 'none';
                menuIcon.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- Search Logic ---
    const searchInput = document.getElementById('search-input');
    const categories = document.querySelectorAll('.product');
    const noResultsMessage = document.getElementById('no-results-message');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const value = e.target.value.toLowerCase().trim();
            let found = false;

            categories.forEach(cat => {
                const text = cat.innerText.toLowerCase();
                if (text.includes(value)) {
                    cat.style.display = 'flex';
                    found = true;
                } else {
                    cat.style.display = 'none';
                }
            });

            if (found) {
                noResultsMessage.style.display = 'none';
            } else {
                noResultsMessage.style.display = 'block';
            }
        });
    }

    // --- Shopping Cart Logic ---
    let cart = [];
    const cartItemsDiv = document.getElementById('cart-items');
    const cartControls = document.getElementById('cart-controls');

    function saveCart() {
        localStorage.setItem('ka-leah-cart', JSON.stringify(cart));
        updateCartBadges();
    }

    function loadCart() {
        const saved = localStorage.getItem('ka-leah-cart');
        if (saved) {
            try {
                cart = JSON.parse(saved);
            } catch (e) {
                cart = [];
            }
        }
    }

    function updateCartBadges() {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        const cartLinks = document.querySelectorAll('a[href="#cart-section"], a[href="products.html#cart-section"]');
        cartLinks.forEach(link => {
            link.textContent = totalItems > 0 ? `Cart (${totalItems})` : 'Cart';
        });
    }

    function updateCartUI() {
        updateCartBadges();
        if (!cartItemsDiv) return;

        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p class="centered-text">Your cart is empty.</p>';
            cartControls.style.display = 'none';
            return;
        }

        cartControls.style.display = 'block';
        let html = '';
        let total = 0;

        cart.forEach((item, index) => {
            let itemTotal = item.price * item.qty;
            total += itemTotal;

            html += `
            <div class="cart-item-row">
                <span>${item.qty}x ${item.name} - ₱${itemTotal.toFixed(2)}</span>
                <button onclick="removeItem(${index})" class="remove-item-btn" aria-label="Remove item">✕</button>
            </div>`;
        });

        html += `<div class="cart-total">Total: ₱${total.toFixed(2)}</div>`;
        cartItemsDiv.innerHTML = html;
        saveCart();
    }

    // --- Batch Add Logic ---
    const batchButtons = document.querySelectorAll('.batch-add-btn');
    batchButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const categoryDiv = e.target.closest('.product');
            const items = categoryDiv.querySelectorAll('.item');
            let addedCount = 0;

            items.forEach(itemDiv => {
                const qtyInput = itemDiv.querySelector('.qty');
                const qty = parseInt(qtyInput.value);

                if (qty > 0) {
                    const name = itemDiv.getAttribute('data-name');
                    const price = parseFloat(itemDiv.getAttribute('data-price'));

                    let existingItem = cart.find(i => i.name === name);
                    if (existingItem) {
                        existingItem.qty += qty;
                    } else {
                        cart.push({ name, price, qty });
                    }
                    addedCount++;

                    // Reset item
                    qtyInput.value = 0;
                    itemDiv.classList.remove('staged');
                }
            });

            if (addedCount > 0) {
                saveCart();
                updateCartUI();
                showToast(`Added ${addedCount} item types to your cart!`);

                // Immediate navigation to cart
                setTimeout(() => {
                    document.getElementById('cart-section').scrollIntoView({ behavior: 'smooth' });
                }, 500);
            } else {
                showToast(`Please set a quantity first!`);
            }
        });
    });

    // --- Row Highlighting ---
    document.querySelectorAll('.qty').forEach(input => {
        input.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            const itemDiv = e.target.closest('.item');
            if (val > 0) {
                itemDiv.classList.add('staged');
            } else {
                itemDiv.classList.remove('staged');
            }
        });
    });

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: var(--primary-indigo);
            color: white;
            padding: 1rem 1.75rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-xl);
            z-index: 3000;
            font-weight: 600;
            animation: slideUp 0.3s ease-out;
            pointer-events: none;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    window.removeItem = function (index) {
        cart.splice(index, 1);
        saveCart();
        updateCartUI();
    };

    // --- Message Generator ---
    function createOrderMessage(isWhatsApp) {
        const reason = document.getElementById('inquiry-reason').value;
        const note = document.getElementById('custom-note').value;
        let total = 0;
        let msg = "";

        // Header
        if (isWhatsApp) {
            // Clean version for WhatsApp
            msg = `Hi Ka Leah! I was browsing your website and ${reason}.\n\n*Here is my list:* \n`;
        } else {
            // Fancy version for Messenger
            msg = `Hi Ka Leah! 👋\n\nI was browsing your website and ${reason}.\n\n*Here is my list:* \n`;
        }

        // Items Loop
        cart.forEach(item => {
            if (isWhatsApp) {
                msg += `- ${item.qty}x ${item.name}\n`;
            } else {
                msg += `✅ ${item.qty}x ${item.name}\n`;
            }
            total += (item.price * item.qty);
        });

        // Footer
        msg += `\n*Estimated Total:* ₱${total.toFixed(2)}`;

        if (note.trim() !== "") {
            msg += `\n\n*My Notes:* ${note}`;
        }

        msg += `\n\nPlease let me know the next steps. Thank you!`;

        return msg;
    }

    // --- WhatsApp Button ---
    const waBtn = document.getElementById('inquire-whatsapp-btn');
    if (waBtn) {
        waBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Your cart is empty! Please add items first.");
                return;
            }

            const message = createOrderMessage(true);
            const url = `https://api.whatsapp.com/send?phone=639277385656&text=${encodeURIComponent(message)}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        });
    }

    // --- Accessibility Enhancements ---
    function enhanceAccessibility() {
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            const name = item.getAttribute('data-name');
            if (name) {
                // Enhance Quantity Input
                const qtyInput = item.querySelector('.qty');
                if (qtyInput && !qtyInput.hasAttribute('aria-label')) {
                    qtyInput.setAttribute('aria-label', `Quantity for ${name}`);
                }
            }
        });
    }
    enhanceAccessibility();

    // --- Messenger Button ---
    const fbBtn = document.getElementById('inquire-messenger-btn');
    if (fbBtn) {
        fbBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Your cart is empty! Please add items first.");
                return;
            }

            const message = createOrderMessage(false);

            navigator.clipboard.writeText(message).then(() => {
                alert("Order copied to clipboard!\n\nMessenger will open now. Please PASTE the message there.");

                window.open("https://www.messenger.com/t/16Leah", "_blank", 'noopener,noreferrer');

            }).catch(err => {
                alert("Could not auto-copy. Please check your cart.");
                window.open("https://www.messenger.com/t/16Leah", "_blank", 'noopener,noreferrer');
            });
        });
    }

    // --- Sticky Search Intersection Observer ---
    const searchContainer = document.getElementById('search-container');
    if (searchContainer) {
        const observer = new IntersectionObserver(
            ([e]) => { e.target.classList.toggle('is-stuck', e.intersectionRatio < 1) },
            { threshold: [1], rootMargin: '-71px 0px 0px 0px' }
        );
        observer.observe(searchContainer);
    }

    // Initialize Cart
    loadCart();
    updateCartUI();
});