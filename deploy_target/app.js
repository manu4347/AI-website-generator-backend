document.addEventListener('DOMContentLoaded', () => {
            const hamburger = document.querySelector('.hamburger');
            const navList = document.querySelector('.nav-list');
            const navLinks = document.querySelectorAll('.nav-link');
            const sections = document.querySelectorAll('section');
            const menuItemsContainer = document.getElementById('menu-items-container');

            // 1. Hamburger Menu Toggle
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navList.classList.toggle('active');
            });

            // Close mobile nav when a link is clicked
            navList.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    hamburger.classList.remove('active');
                    navList.classList.remove('active');
                }
            });

            // 2. Smooth Scrolling & Active Nav Link on Scroll
            // Root Margin: A value for the top, right, bottom, and left margins of the root.
            // This defines the bounding box for checking intersection. '0px 0px -20% 0px' means
            // the bottom 20% of the viewport is ignored, making sections active earlier.
            const observerOptions = {
                root: null, // viewport
                rootMargin: '0px 0px -20% 0px', 
                threshold: 0.5 // Section is considered active when 50% visible in the rootMargin adjusted area
            };

            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${entry.target.id}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            }, observerOptions);

            sections.forEach(section => {
                sectionObserver.observe(section);
            });

            // Handle the initial active state for the first section if page is loaded at top
            if (sections.length > 0) {
                const firstSectionId = sections[0].id;
                const firstNavLink = document.querySelector(`.nav-link[href="#${firstSectionId}"]`);
                if (firstNavLink) {
                    firstNavLink.classList.add('active');
                }
            }


            // 3. Reveal on Scroll Effect
            const revealElements = document.querySelectorAll('.reveal');

            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target); // Stop observing once revealed
                    }
                });
            }, {
                root: null,
                rootMargin: '0px',
                threshold: 0.1 // Reveal when 10% of the element is visible
            });

            revealElements.forEach(el => {
                revealObserver.observe(el);
            });

            // 4. Fetch API Data and Render Menu Cards
            const fetchMenuData = async () => {
                try {
                    // Using FakestoreAPI to simulate food items
                    // Fetch 6 products to display as food menu items
                    const response = await fetch('https://fakestoreapi.com/products?limit=6');
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const products = await response.json();

                    // Clear loading message
                    menuItemsContainer.innerHTML = '';

                    // Map products to menu items. We'll simulate food data from generic products.
                    products.forEach(product => {
                        const menuCard = document.createElement('div');
                        menuCard.classList.add('menu-card');

                        // Adapt API data to sound more like Indian food
                        const foodNames = [
                            "Spicy Chicken Tikka Masala", "Vegetable Korma", "Lamb Rogan Josh",
                            "Paneer Butter Masala", "Dal Makhani Delight", "Goan Fish Curry",
                            "Aloo Gobi", "Palak Paneer", "Biryani Special", "Tandoori Chicken"
                        ];
                        const foodName = foodNames[Math.floor(Math.random() * foodNames.length)];
                        
                        const foodDescriptions = [
                            "A rich and creamy tomato-based curry, bursting with authentic Indian spices.",
                            "A delightful medley of fresh vegetables simmered in a cashew-cream sauce.",
                            "Tender lamb cooked in a fragrant onion and yogurt gravy.",
                            "Soft paneer cubes in a luscious, mildly spiced tomato gravy.",
                            "Slow-cooked black lentils in a buttery, smoky sauce, a true comfort food.",
                            "Fresh fish cooked in a tangy coconut and red chili paste, a taste of coastal India."
                        ];
                        const foodDescription = foodDescriptions[Math.floor(Math.random() * foodDescriptions.length)];
                        
                        // Adjust price to be more typical for a restaurant menu item
                        const foodPrice = (product.price * 0.5 + Math.random() * 10).toFixed(2); 

                        menuCard.innerHTML = `
                            <img src="${product.image}" alt="${foodName}" loading="lazy">
                            <h3>${foodName}</h3>
                            <p>${foodDescription}</p>
                            <span class="price">$${foodPrice}</span>
                        `;
                        menuItemsContainer.appendChild(menuCard);
                    });

                } catch (error) {
                    console.error('Error fetching menu data:', error);
                    menuItemsContainer.innerHTML = '<p class="loading-message" style="color: #ff6b6b;">Failed to load menu items. Please try again later.</p>';
                }
            };

            fetchMenuData();

            // 5. Basic form submission (prevent default)
            const contactForm = document.querySelector('.contact-form');
            if (contactForm) {
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault(); // Prevent actual form submission
                    alert('Thank you for your message! We will get back to you shortly.');
                    contactForm.reset(); // Clear the form fields
                });
            }
        });