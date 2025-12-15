/*
         * PRODUCTION-READY JAVASCRIPT
         *
         * This script handles interactive features such as the mobile navigation
         * and dynamically fetching and rendering menu items from a public API.
         */

        document.addEventListener('DOMContentLoaded', () => {
            // --- 1. Mobile Navigation Toggle ---
            const hamburger = document.getElementById('hamburger-menu');
            const navLinks = document.getElementById('nav-links');

            if (hamburger && navLinks) {
                hamburger.addEventListener('click', () => {
                    hamburger.classList.toggle('active');
                    navLinks.classList.toggle('active');
                    // Add/remove aria-expanded for accessibility
                    const isExpanded = navLinks.classList.contains('active');
                    hamburger.setAttribute('aria-expanded', isExpanded);
                });

                // Close nav menu when a link is clicked (for smooth scrolling)
                navLinks.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => {
                        if (navLinks.classList.contains('active')) {
                            hamburger.classList.remove('active');
                            navLinks.classList.remove('active');
                            hamburger.setAttribute('aria-expanded', false);
                        }
                    });
                });
            }

            // --- 2. Fetch API Data and Render Menu Items ---
            const menuItemsContainer = document.getElementById('menu-items-container');
            const API_URL = 'https://fakestoreapi.com/products?limit=8'; // Using Fakestore API for demonstration

            // Mapping for generic product titles to Indian dish names
            const indianDishNames = [
                "Butter Chicken Masala",
                "Paneer Tikka Delight",
                "Hyderabadi Biryani",
                "Vegetable Korma",
                "Tandoori Chicken Skewers",
                "Dal Makhani Extravaganza",
                "Goan Fish Curry",
                "Palak Paneer Special"
            ];

            const fetchMenu = async () => {
                // Show loading spinner
                menuItemsContainer.innerHTML = '<div class="loading-spinner"></div>';

                try {
                    const response = await fetch(API_URL);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const products = await response.json();
                    renderMenuItems(products);
                } catch (error) {
                    console.error('Failed to fetch menu items:', error);
                    menuItemsContainer.innerHTML = `
                        <p style="color: var(--light-text-color); grid-column: 1 / -1; text-align: center;">
                            Failed to load menu items. Please try again later.
                            <br> Error: ${error.message}
                        </p>
                    `;
                }
            };

            const renderMenuItems = (products) => {
                if (!menuItemsContainer) return; // Exit if container not found

                menuItemsContainer.innerHTML = ''; // Clear loading spinner

                if (products.length === 0) {
                    menuItemsContainer.innerHTML = `
                        <p style="color: var(--light-text-color); grid-column: 1 / -1; text-align: center;">
                            No menu items available at the moment.
                        </p>
                    `;
                    return;
                }

                products.forEach((product, index) => {
                    const dishName = indianDishNames[index % indianDishNames.length]; // Cycle through names
                    const descriptionSnippet = product.description.length > 100 
                                              ? product.description.substring(0, 97) + '...' 
                                              : product.description;

                    const menuItemHTML = `
                        <article class="menu-item" tabindex="0">
                            <div class="menu-item-image">
                                <img src="${product.image}" alt="${dishName}">
                            </div>
                            <div class="menu-item-content">
                                <h3>${dishName}</h3>
                                <p>${descriptionSnippet}</p>
                                <span class="menu-item-price">$${product.price.toFixed(2)}</span>
                                <button class="btn primary-btn order-now-btn" aria-label="Order ${dishName}">Order Now</button>
                            </div>
                        </article>
                    `;
                    menuItemsContainer.insertAdjacentHTML('beforeend', menuItemHTML);
                });

                // Add event listeners to newly created "Order Now" buttons
                document.querySelectorAll('.menu-item .order-now-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const dishName = event.target.closest('.menu-item-content').querySelector('h3').textContent;
                        alert(`You've added "${dishName}" to your order! (This is a demo, no actual order placed)`);
                    });
                });
            };

            // Initial fetch of menu items when the page loads
            fetchMenu();

            // --- 3. Global "Order Now" Button Functionality (e.g., in Header) ---
            document.querySelectorAll('a.order-now-btn, button.order-now-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Prevent default link behavior if it's an anchor tag
                    if (e.target.tagName === 'A') {
                        e.preventDefault();
                    }
                    alert('Ready to order? Please browse our menu first! (This is a demo, no actual order placed)');
                    // For a real site, this might navigate to a cart page or open a modal
                });
            });

        });