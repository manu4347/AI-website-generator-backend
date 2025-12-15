document.addEventListener('DOMContentLoaded', () => {
            const hamburger = document.getElementById('hamburger');
            const navLinks = document.getElementById('navLinks');
            const productGrid = document.getElementById('productGrid');
            const loadingMessage = document.getElementById('loadingMessage');
            const contactForm = document.getElementById('contactForm');
            const navItems = document.querySelectorAll('.nav-links a');

            /**
             * Handles the mobile navigation toggle.
             * Toggles 'active' class on hamburger icon and nav links.
             */
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navLinks.classList.toggle('active');
            });

            /**
             * Smooth scrolling for navigation links and closes mobile menu.
             */
            navItems.forEach(item => {
                item.addEventListener('click', (event) => {
                    // Remove active class from all nav items
                    navItems.forEach(link => link.classList.remove('active'));
                    // Add active class to the clicked item
                    event.currentTarget.classList.add('active');

                    // If mobile menu is open, close it
                    if (navLinks.classList.contains('active')) {
                        hamburger.classList.remove('active');
                        navLinks.classList.remove('active');
                    }

                    // For smooth scroll, this is already handled by CSS scroll-behavior: smooth
                    // If you needed custom scroll, you'd add:
                    // const targetId = item.getAttribute('href').substring(1);
                    // document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
                });
            });

            /**
             * Dynamically fetches product data from a public API and renders it.
             * Using fakestoreapi.com to simulate product listings.
             * Note: Real cold pressed oil products would typically come from a custom backend API.
             */
            const fetchProducts = async () => {
                try {
                    const response = await fetch('https://fakestoreapi.com/products?limit=6'); // Fetch 6 items
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const products = await response.json();
                    
                    // Clear loading message
                    loadingMessage.remove();

                    // Map fetched products to a more relevant "oil" context (simulated)
                    const simulatedOils = products.map(product => {
                        let oilType = "Variety"; // Default
                        if (product.category.includes("jewelery")) oilType = "Olive";
                        else if (product.category.includes("electronics")) oilType = "Sesame";
                        else if (product.category.includes("men's clothing")) oilType = "Coconut";
                        else if (product.category.includes("women's clothing")) oilType = "Sunflower";

                        // Shorten titles and descriptions for better display
                        const title = product.title.length > 50 ? product.title.substring(0, 47) + '...' : product.title;
                        const description = product.description.length > 120 ? product.description.substring(0, 117) + '...' : product.description;

                        return {
                            id: product.id,
                            name: `${oilType} Oil`, // Simulate oil name
                            category: `Cold Pressed ${oilType}`,
                            description: `Discover the pure essence of ${oilType} oil. Rich in nutrients and perfect for healthy cooking or skincare. ${description}`,
                            price: (product.price * 0.7).toFixed(2), // Adjust price for realism
                            image: product.image // Use original image
                        };
                    });

                    // Render products to the DOM
                    simulatedOils.forEach(product => {
                        const productCard = document.createElement('article'); // Use <article> for individual products
                        productCard.classList.add('product-card');
                        productCard.innerHTML = `
                            <img src="${product.image}" alt="${product.name}">
                            <p class="category">${product.category}</p>
                            <h3>${product.name}</h3>
                            <p class="description">${product.description}</p>
                            <span class="price">$${product.price}</span>
                            <button class="btn-add-to-cart" data-product-id="${product.id}" data-product-name="${product.name}">Add to Cart</button>
                        `;
                        productGrid.appendChild(productCard);
                    });

                    // Add event listeners for "Add to Cart" buttons
                    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
                        button.addEventListener('click', (event) => {
                            const productName = event.target.dataset.productName;
                            // Simulate adding to cart - in a real app, this would update a cart state or send to backend
                            alert(`${productName} added to cart! (This is a client-side simulation)`);
                            console.log(`Product ID ${event.target.dataset.productId} (${productName}) added to cart.`);
                        });
                    });

                } catch (error) {
                    console.error('Failed to fetch products:', error);
                    loadingMessage.textContent = 'Failed to load products. Please try again later.';
                    // Optionally, remove the product grid to show only the error message
                    productGrid.innerHTML = `<p class="text-center" style="color: red;">Failed to load products. Please try again later. Error: ${error.message}</p>`;
                }
            };

            // Call fetchProducts when the DOM is loaded
            fetchProducts();

            /**
             * Handles contact form submission.
             * Prevents default form submission and logs data (client-side simulation).
             */
            contactForm.addEventListener('submit', (event) => {
                event.preventDefault(); // Prevent actual form submission

                const formData = new FormData(contactForm);
                const formObject = {};
                formData.forEach((value, key) => {
                    formObject[key] = value;
                });

                console.log('Contact form submitted:', formObject);
                alert('Thank you for your message! We will get back to you shortly. (This is a client-side simulation)');
                contactForm.reset(); // Clear the form
            });

            /**
             * Intersection Observer for active navigation links based on scroll position.
             */
            const sections = document.querySelectorAll('section');
            const options = {
                root: null, // viewport
                rootMargin: '0px',
                threshold: 0.5 // Trigger when 50% of the section is visible
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        navItems.forEach(item => {
                            item.classList.remove('active');
                            if (item.getAttribute('href') === `#${entry.target.id}`) {
                                item.classList.add('active');
                            }
                        });
                    }
                });
            }, options);

            sections.forEach(section => {
                observer.observe(section);
            });

            // Handle initial active link for hero section if it's visible on load
            const heroLink = document.querySelector('.nav-links a[href="#hero"]');
            if (heroLink) {
                heroLink.classList.add('active');
            }
        });