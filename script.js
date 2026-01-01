document.addEventListener('DOMContentLoaded', () => {

    // --- MOBILE MENU FUNCTIONALITY ---
    const menuIcon = document.getElementById('menu-icon');
    const mobileNav = document.getElementById('mobile-navigation');

    // Check if the menu icon exists (Safety check)
    if (menuIcon && mobileNav) { 
        // Toggle the menu on/off when clicking the hamburger icon
        menuIcon.addEventListener('click', () => {
            if (mobileNav.style.display === 'block') {
                mobileNav.style.display = 'none';
            } else {
                mobileNav.style.display = 'block';
            }
        });

        // Close the menu if a link is clicked
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.style.display = 'none';
            });
        });

        // If user resizes screen to desktop width, hide the mobile menu automatically
        window.addEventListener('resize', () => {
            if (window.innerWidth > 680) {
                mobileNav.style.display = 'none';
            }
        });
    }

    // --- SEARCH BAR FUNCTIONALITY ---
    const searchInput = document.getElementById('search-input');
    const products = document.querySelectorAll('.product');
    const noResultsMessage = document.getElementById('no-results-message');

    // Only run this if the search bar exists (e.g., on products page)
    if (searchInput) { 
        searchInput.addEventListener('input', (e) => {
            // .trim() removes the automatic space mobile keyboards add
            const value = e.target.value.toLowerCase().trim();
            let hasVisibleProduct = false; // Flag to check if we found any matches

            // Loop through all product boxes
            products.forEach(product => {
                // Get the text inside the product box
                const text = product.textContent.toLowerCase();

                // Show or hide based on whether text matches the search
                if (text.includes(value)) {
                    product.style.display = 'flex'; 
                    hasVisibleProduct = true;
                } else {
                    product.style.display = 'none'; 
                }
            });

            // If no products matched, show the "No Results" message
            if (hasVisibleProduct) {
                noResultsMessage.style.display = 'none';
            } else {
                noResultsMessage.style.display = 'block';
            }
        });
    }
});