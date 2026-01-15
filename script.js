document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
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

    // --- Message Generator ---
    function createOrderMessage(isWhatsApp) {
        const reason = document.getElementById('inquiry-reason').value;
        const note = document.getElementById('custom-note').value; 
        let total = 0;
        let msg = "";

        // Header
        if (isWhatsApp) {
            // Clean version for WhatsApp (No Wave Emoji to prevent link errors)
            msg = `Hi Ka Leah! I was browsing your website and ${reason}.\n\n*Here is my list:* \n`;
        } else {
            // Fancy version for Messenger
            msg = `Hi Ka Leah! 👋\n\nI was browsing your website and ${reason}.\n\n*Here is my list:* \n`;
        }

        // Items Loop
        cart.forEach(item => {
            if (isWhatsApp) {
                // Use a Dash (-) instead of Checkmark Emoji
                msg += `- ${item.qty}x ${item.name}\n`;
            } else {
                // Use Checkmark Emoji
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
    if(waBtn) {
        waBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Your cart is empty! Please add items first.");
                return;
            }

            const message = createOrderMessage(true); 
            
            // FIX: Use full API URL instead of wa.me to reduce ISP errors
            const url = `https://api.whatsapp.com/send?phone=639277385656&text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        });
    }

    // --- Messenger Button ---
    const fbBtn = document.getElementById('inquire-messenger-btn');
    if(fbBtn) {
        fbBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Your cart is empty! Please add items first.");
                return;
            }

            const message = createOrderMessage(false);
            
            navigator.clipboard.writeText(message).then(() => {
                alert("Order copied to clipboard!\n\nMessenger will open now. Please PASTE the message there.");
                // Use standard link, but note that mobile data often blocks redirects
                window.open("https://m.me/16Leah", "_blank");
            }).catch(err => {
                alert("Could not auto-copy. Please check your cart.");
                window.open("https://m.me/16Leah", "_blank");
            });
        });
    }
});