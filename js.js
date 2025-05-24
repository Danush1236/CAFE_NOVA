// Performance optimizations
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Cache DOM elements
const elements = {
    loading: document.getElementById('loading'),
    navbar: document.getElementById('navbar'),
    cartModal: document.getElementById('cartModal'),
    cartItems: document.getElementById('cartItems'),
    cartTotal: document.getElementById('cartTotal'),
    cartIcon: document.getElementById('cartIcon'),
    cartCount: document.getElementById('cartCount'),
    themeToggle: document.getElementById('themeToggle')
};

// Loading Screen
        window.addEventListener('load', () => {
    if (elements.loading) {
            setTimeout(() => {
            elements.loading.classList.add('hidden');
            }, 1500);
    }
        });

        // **6. Sticky Navbar with Scroll Animation - ENHANCED**
        const navbar = document.getElementById('navbar');
        const logo = navbar.querySelector('.logo');
        
// Optimized scroll handling
const handleScroll = debounce(() => {
            const scrolled = window.scrollY;
            
    if (elements.navbar) {
            if (scrolled > 100) {
            elements.navbar.classList.add('scrolled');
            } else {
            elements.navbar.classList.remove('scrolled');
        }
            }
            
            // Parallax effect for hero
            const hero = document.querySelector('.hero');
            if (hero && scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
}, 10);

window.addEventListener('scroll', handleScroll);

        // **4. Dark/Light Mode Toggle with Smooth Transitions - ENHANCED**
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        const icon = themeToggle.querySelector('i');
        
// Optimized theme toggle
if (elements.themeToggle) {
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        body.setAttribute('data-theme', savedTheme);
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

    elements.themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        });
}

        // **8. Add to Cart Animation with Fly-to-cart - ENHANCED**
let cart = [];

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart display
    updateCartDisplay();
    updateCartCount();
    updateCartTotal();
    
    // Add click event to cart icon
        const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleCart();
        });
    }
});
            
// Toggle cart modal
function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.toggle('active');
        if (cartModal.classList.contains('active')) {
            updateCartDisplay();
            // Add overlay when cart is open
            const overlay = document.createElement('div');
            overlay.className = 'cart-overlay';
            document.body.appendChild(overlay);
            overlay.addEventListener('click', toggleCart);
        } else {
            // Remove overlay when cart is closed
            const overlay = document.querySelector('.cart-overlay');
            if (overlay) {
                overlay.remove();
            }
        }
    }
}

// Update cart count in navbar
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Update cart total
function updateCartTotal() {
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <p>Add some delicious coffee to your cart!</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
}

// Add to cart function
function addToCart(itemName, price, button) {
    const existingItem = cart.find(item => item.name === itemName);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: itemName,
            price: price,
            quantity: 1
        });
                }
    
    updateCartDisplay();
    updateCartCount();
    updateCartTotal();
            
    // Show cart modal
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.add('active');
        // Add overlay when cart is open
        const overlay = document.createElement('div');
        overlay.className = 'cart-overlay';
        document.body.appendChild(overlay);
        overlay.addEventListener('click', toggleCart);
    }
    
    // Button feedback
            const originalBg = button.style.background;
            const originalText = button.textContent;
            
            button.style.background = '#4CAF50';
            button.style.transform = 'scale(0.95)';
            button.textContent = '✓ Added!';
            button.disabled = true;
            
            setTimeout(() => {
                button.style.transform = 'scale(1.05)';
            }, 100);
            
            setTimeout(() => {
                button.style.background = originalBg;
                button.style.transform = '';
                button.textContent = originalText;
                button.disabled = false;
            }, 1500);
}

// Update quantity function
function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity = Math.max(1, cart[index].quantity + change);
        updateCartDisplay();
        updateCartCount();
        updateCartTotal();
    }
}

// Remove from cart function
function removeFromCart(index) {
    if (cart[index]) {
        cart.splice(index, 1);
        updateCartDisplay();
        updateCartCount();
        updateCartTotal();
    }
}

function buyNow(name, price) {
    // Add to cart first
    addToCart(name, price);
    
    // Show confirmation message
    const confirmation = document.createElement('div');
    confirmation.className = 'buy-now-confirmation';
    confirmation.innerHTML = `
        <div class="confirmation-content">
            <i class="fas fa-check-circle"></i>
            <h3>Order Placed Successfully!</h3>
            <p>Your ${name} is being prepared.</p>
            <p>Total: $${price.toFixed(2)}</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(confirmation);

    // Add styles for the confirmation
    const style = document.createElement('style');
    style.textContent = `
        .buy-now-confirmation {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        .confirmation-content {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            animation: slideUp 0.3s ease;
        }
        .confirmation-content i {
            color: #4CAF50;
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        .confirmation-content h3 {
            color: var(--primary-color);
            margin-bottom: 1rem;
        }
        .confirmation-content p {
            margin: 0.5rem 0;
            color: var(--text-light);
        }
        .confirmation-content button {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 0.8rem 2rem;
            border-radius: 25px;
            margin-top: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .confirmation-content button:hover {
            background: var(--secondary-color);
            transform: translateY(-2px);
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
        }

        // **7. Testimonials Slider with Auto-slide - ENHANCED**
        let currentTestimonial = 1;
        const testimonials = document.querySelectorAll('.testimonial');
        const dots = document.querySelectorAll('.dot');
        let testimonialInterval;

        function showSlide(n, direction = 'next') {
            // Remove active class from all
            testimonials.forEach(testimonial => {
                testimonial.classList.remove('active', 'prev');
            });
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Add appropriate classes
            testimonials[n - 1].classList.add('active');
            dots[n - 1].classList.add('active');
            
            // Add previous class to create slide effect
            if (direction === 'next') {
                testimonials.forEach((testimonial, index) => {
                    if (index < n - 1) {
                        testimonial.classList.add('prev');
                    }
                });
            }
        }

        function currentSlide(n) {
            currentTestimonial = n;
            showSlide(n);
            resetInterval();
        }

        function nextSlide() {
            currentTestimonial++;
            if (currentTestimonial > testimonials.length) {
                currentTestimonial = 1;
            }
            showSlide(currentTestimonial, 'next');
        }

        function resetInterval() {
            clearInterval(testimonialInterval);
            testimonialInterval = setInterval(nextSlide, 5000);
        }

        // Initialize testimonials
        resetInterval();

        // **3. Section Reveal on Scroll - ENHANCED**
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('section-title')) {
                        entry.target.classList.add('animate');
                    }
                    if (entry.target.classList.contains('menu-item')) {
                        setTimeout(() => {
                            entry.target.classList.add('animate');
                        }, Math.random() * 300);
                    }
                    if (entry.target.classList.contains('stat-number')) {
                        animateCounter(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        document.querySelectorAll('.section-title, .menu-item, .stat-number').forEach(el => {
            observer.observe(el);
        });

        // Counter animation for stats
        function animateCounter(element) {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current).toLocaleString();
            }, 16);
        }

        // Smooth scrolling for navigation links - ENHANCED
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Form submission with enhanced feedback
        document.querySelector('.contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            const formInputs = this.querySelectorAll('input, textarea');
            
            // Disable form
            formInputs.forEach(input => input.disabled = true);
            
            submitBtn.textContent = 'Sending Message...';
            submitBtn.disabled = true;
            submitBtn.style.background = '#FF9500';
            
            // Simulate sending
            setTimeout(() => {
                submitBtn.textContent = '✓ Message Sent Successfully!';
                submitBtn.style.background = '#4CAF50';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    formInputs.forEach(input => {
                        input.disabled = false;
                        input.value = '';
                    });
                }, 3000);
            }, 2000);
        });

// Mobile Menu Functionality
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.style.display = 'none';
        
const navContainer = document.querySelector('.nav-container');
const navLinks = document.querySelector('.nav-links');

if (navContainer && navLinks) {
    navContainer.insertBefore(mobileMenuBtn, navLinks);

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navContainer.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }, 250);
});
        
        // Enhanced scroll effects for all elements
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        // Apply fade-in effect to sections
        document.querySelectorAll('.about, .contact, .stat-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            fadeObserver.observe(el);
        });

        // Enhanced cart icon bounce effect
        function bounceCart() {
    document.getElementById('cartIcon').style.animation = 'bounce 0.6s ease-in-out';
            setTimeout(() => {
        document.getElementById('cartIcon').style.animation = '';
            }, 600);
        }

        // Add bounce animation to cart when items are added
        const originalAddToCart = window.addToCart;
        window.addToCart = function(...args) {
            originalAddToCart.apply(this, args);
            bounceCart();
        };

        // Keyboard navigation support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open modals or menus
                document.querySelectorAll('.modal, .dropdown').forEach(el => {
                    el.style.display = 'none';
                });
            }
        });

// Optimized image loading
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

    images.forEach(img => imageObserver.observe(img));
        });

        // Add loading states for better UX
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', function() {
                if (!this.disabled) {
                    this.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                }
            });
        });

        // Enhanced form validation with real-time feedback
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', function() {
                if (this.required && !this.value.trim()) {
                    this.style.borderColor = '#FF4757';
                    this.style.boxShadow = '0 0 0 3px rgba(255, 71, 87, 0.1)';
                } else if (this.type === 'email' && this.value && !isValidEmail(this.value)) {
                    this.style.borderColor = '#FF4757';
                    this.style.boxShadow = '0 0 0 3px rgba(255, 71, 87, 0.1)';
                } else {
                    this.style.borderColor = '#4CAF50';
                    this.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
                }
            });

            input.addEventListener('focus', function() {
                this.style.borderColor = 'var(--primary-color)';
                this.style.boxShadow = '0 0 0 3px rgba(139, 69, 19, 0.1)';
            });
        });

        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        // Add scroll progress indicator
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: var(--gradient);
            z-index: 10001;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = Math.min(scrolled, 100) + '%';
        });

        // Add typing effect for hero text
        function typeWriter(element, text, speed = 100) {
            let i = 0;
            element.textContent = '';
            
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
            type();
        }

        // Initialize typing effect after page load
        setTimeout(() => {
            const heroTitle = document.querySelector('.hero h1');
            const heroSubtitle = document.querySelector('.hero p');
            
            if (heroTitle && heroSubtitle) {
                const originalTitle = heroTitle.textContent;
                const originalSubtitle = heroSubtitle.textContent;
                
                typeWriter(heroTitle, originalTitle, 80);
                setTimeout(() => {
                    typeWriter(heroSubtitle, originalSubtitle, 60);
                }, originalTitle.length * 80 + 500);
            }
        }, 2000);

        // Add easter egg - coffee rain effect
        let easterEggCount = 0;
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('logo')) {
                easterEggCount++;
                if (easterEggCount >= 5) {
                    createCoffeeRain();
                    easterEggCount = 0;
                }
            }
        });

        function createCoffeeRain() {
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const coffee = document.createElement('div');
                    coffee.innerHTML = '☕';
                    coffee.style.cssText = `
                        position: fixed;
                        top: -50px;
                        left: ${Math.random() * window.innerWidth}px;
                        font-size: 2rem;
                        z-index: 9999;
                        pointer-events: none;
                        animation: fall 3s linear forwards;
                    `;
                    
                    document.body.appendChild(coffee);
                    
                    setTimeout(() => {
                        coffee.remove();
                    }, 3000);
                }, i * 200);
            }
        }

        // Add CSS for falling coffee
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fall {
                to {
                    transform: translateY(${window.innerHeight + 100}px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Add sound effects (optional - commented out for performance)
        /*
        function playSound(soundName) {
            const audio = new Audio(`/sounds/${soundName}.mp3`);
            audio.volume = 0.3;
            audio.play().catch(() => {}); // Ignore errors if sound files don't exist
        }
        */

        // Add accessibility improvements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Add focus styles for keyboard navigation
        const keyboardStyle = document.createElement('style');
        keyboardStyle.textContent = `
            .keyboard-navigation *:focus {
                outline: 3px solid var(--primary-color) !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(keyboardStyle);

        // Performance monitoring
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                }, 0);
            });
        }

        // Service Worker registration for PWA capabilities (optional)
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // Uncomment the next line if you have a service worker file
                // navigator.serviceWorker.register('/sw.js');
            });
        }

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderSummary = cart.map(item => 
        `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    // Show confirmation message
    const confirmation = document.createElement('div');
    confirmation.className = 'buy-now-confirmation';
    confirmation.innerHTML = `
        <div class="confirmation-content">
            <i class="fas fa-check-circle"></i>
            <h3>Order Placed Successfully!</h3>
            <p>Your order has been placed.</p>
            <p>Total: $${total.toFixed(2)}</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(confirmation);
    
    // Clear cart after successful checkout
    cart = [];
    updateCartDisplay();
    updateCartCount();
    updateCartTotal();
    toggleCart();
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart display
    updateCartDisplay();
    updateCartCount();
    updateCartTotal();
    
    // Add click event to cart icon
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleCart();
        });
    }

    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        const cartModal = document.getElementById('cartModal');
        if (cartModal && cartModal.classList.contains('active')) {
            if (!cartModal.contains(e.target) && !e.target.closest('#cartIcon')) {
                toggleCart();
            }
        }
    });

    // Prevent clicks inside cart modal from closing it
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});

// Optimize cart functionality
let cartTimeout;
function updateCart() {
    if (cartTimeout) {
        clearTimeout(cartTimeout);
    }
    cartTimeout = setTimeout(() => {
        // Your cart update code here
    }, 100);
}

// Optimize animations for mobile
if (window.innerWidth <= 768) {
    document.querySelectorAll('.floating-beans .bean').forEach(bean => {
        bean.style.animation = 'none';
    });
}

// Add print styles
window.addEventListener('beforeprint', function() {
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', function() {
    document.body.classList.remove('printing');
});