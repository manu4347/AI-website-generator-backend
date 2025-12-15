document.addEventListener('DOMContentLoaded', () => {
            const hamburger = document.querySelector('.hamburger');
            const navLinks = document.querySelector('.nav-links');
            const sections = document.querySelectorAll('.section');
            const navMenuLinks = document.querySelectorAll('.nav-link');
            const sectionContents = document.querySelectorAll('.section-content');

            // --- Hamburger Menu Toggle ---
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navLinks.classList.toggle('active');
            });

            // Close mobile nav when a link is clicked
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (navLinks.classList.contains('active')) {
                        hamburger.classList.remove('active');
                        navLinks.classList.remove('active');
                    }
                });
            });

            // --- Active Nav Link on Scroll ---
            const options = {
                root: null, // viewport
                rootMargin: '0px',
                threshold: 0.5 // Percentage of section visible before it's "active"
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const id = entry.target.id;
                    const navLink = document.querySelector(`.nav-links a[href="#${id}"]`);

                    if (entry.isIntersecting) {
                        // Remove 'active' from all links
                        navMenuLinks.forEach(link => link.classList.remove('active'));
                        // Add 'active' to the current section's link
                        if (navLink) {
                            navLink.classList.add('active');
                        }
                    }
                });
            }, options);

            sections.forEach(section => {
                observer.observe(section);
            });

            // Initial active link setup for when page loads at the top
            const firstNavLink = document.querySelector('.nav-links a[href="#home"]');
            if (firstNavLink) {
                firstNavLink.classList.add('active');
            }


            // --- Reveal on Scroll Effect ---
            const revealOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.2 // Trigger when 20% of the element is visible
            };

            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        revealObserver.unobserve(entry.target); // Stop observing once revealed
                    }
                });
            }, revealOptions);

            // Observe all section-content except for the home section-content
            sectionContents.forEach(content => {
                if (content.closest('section').id !== 'home') {
                    revealObserver.observe(content);
                }
            });

            // --- Fetch API Data for Insights Section ---
            const blogPostsContainer = document.getElementById('blog-posts-container');
            const fetchPosts = async () => {
                try {
                    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=6'); // Fetch a few posts
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const posts = await response.json();

                    blogPostsContainer.innerHTML = ''; // Clear loading message

                    posts.forEach(post => {
                        const card = document.createElement('div');
                        card.classList.add('glass-card', 'insight-card');
                        card.innerHTML = `
                            <h3>${post.title}</h3>
                            <p>${post.body}</p>
                            <a href="#">Read More</a>
                        `;
                        blogPostsContainer.appendChild(card);
                    });
                } catch (error) {
                    console.error('Error fetching blog posts:', error);
                    blogPostsContainer.innerHTML = `<p class="glass-card" style="text-align: center;">Failed to load insights. Please try again later.</p>`;
                }
            };

            fetchPosts();
        });