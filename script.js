document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const menuIcon = document.getElementById('menu-icon');
    const mobileNav = document.getElementById('mobile-navigation');

    if (menuIcon && mobileNav) { 
        menuIcon.addEventListener('click', () => {
            if (mobileNav.style.display === 'block') {
                mobileNav.style.display = 'none';
            } else {
                mobileNav.style.display = 'block';
            }
        });
        
        window.addEventListener('resize', () => {
            if (window.innerWidth > 680) mobileNav.style.display = 'none';
        });
    }

    // Search Logic
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

    // Cart Logic
    let cart = [];
    const cartItemsDiv = document.getElementById('cart-items');
    const cartControls = document.getElementById('cart-controls');

    function updateCartUI() {
        if (!cartItemsDiv) return;

        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p class="centered-text">Your cart is empty.</p>';
            cartControls.style.display = 'none';
            return;
        }

        cartControls.style.display = 'block';
        let html = '';
        let total = 0;
        
        for(let i = 0; i < cart.length; i++) {
            let item = cart[i];
            let itemTotal = item.price * item.qty;
            total += itemTotal;

            html += `
            <div class="cart-item-row">
                <span>${item.qty}x ${item.name} - ₱${itemTotal.toFixed(2)}</span>
                <button onclick="removeItem(${i})" style="background:#ff4444; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">X</button>
            </div>`;
        }
        
        html += `<div style="text-align:right; font-weight:bold; margin-top:10px;">Total: ₱${total.toFixed(2)}</div>`;
        cartItemsDiv.innerHTML = html;
    }

    const buttons = document.querySelectorAll('.add-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemDiv = e.target.closest('.item');
            const name = itemDiv.getAttribute('data-name');
            const price = parseFloat(itemDiv.getAttribute('data-price'));
            const qtyInput = itemDiv.querySelector('.qty');
            const qty = parseInt(qtyInput.value);

            if(qty < 1) return;

            let existingItem = null;
            for(let i=0; i < cart.length; i++) {
                if(cart[i].name === name) {
                    existingItem = cart[i];
                }
            }

            if (existingItem) {
                existingItem.qty += qty;
            } else {
                cart.push({ name: name, price: price, qty: qty });
            }

            updateCartUI();
            alert("Added to cart!");
            qtyInput.value = 1;
        });
    });

    window.removeItem = function(index) {
        cart.splice(index, 1);
        updateCartUI();
    };

    function createOrderMessage() {
        let msg = "Hello Ka Leah! I would like to order:\n\n";
        let total = 0;

        cart.forEach(item => {
            msg += `- ${item.qty}x ${item.name}\n`;
            total += (item.price * item.qty);
        });

        const reason = document.getElementById('inquiry-reason').value;
        msg += `\nTotal: ₱${total.toFixed(2)}`;
        msg += `\nReason: ${reason}`;
        
        return msg;
    }

    const waBtn = document.getElementById('inquire-whatsapp-btn');
    if(waBtn) {
        waBtn.addEventListener('click', () => {
            const message = createOrderMessage();
            const url = `https://wa.me/639277385656?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        });
    }

    const fbBtn = document.getElementById('inquire-messenger-btn');
    if(fbBtn) {
        fbBtn.addEventListener('click', () => {
            const message = createOrderMessage();
            navigator.clipboard.writeText(message).then(() => {
                alert("Order copied! Paste it in Messenger.");
                window.open("https://m.me/16Leah", "_blank");
            });
        });
    }
});