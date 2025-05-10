document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');
    
    let redirectTarget = null;
    
    updateUIForLoginStatus(isLoggedIn, username);
    
    const slider = document.querySelector('.product-slider');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    let scrollAmount = 350; 
    
    prevBtn.addEventListener('click', function() {
        slider.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    
    nextBtn.addEventListener('click', function() {
        slider.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    const userIcon = document.getElementById('user-icon');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    userIcon.addEventListener('click', function() {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
    
    window.addEventListener('click', function(event) {
        if (!event.target.matches('#user-icon')) {
            if (dropdownMenu.style.display === 'block') {
                dropdownMenu.style.display = 'none';
            }
        }
    });

    const loginModal = document.getElementById('loginModal');
    const closeModal = document.querySelector('.close-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    
    function openLoginModal(target = null) {
        redirectTarget = target;
        
        loginModal.classList.add('show-modal');
        document.body.style.overflow = 'hidden'; 
    }
    
    function closeLoginModal() {
        loginModal.classList.remove('show-modal');
        document.body.style.overflow = ''; 
    }
    
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;

        // Clear previous error message
        loginError.textContent = '';

        // Send AJAX request to the backend
        fetch('includes/auth/sign_in.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: usernameInput,
                password: passwordInput,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    // Login successful
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('username', data.username);
                    updateUIForLoginStatus(true, data.username);
                    closeLoginModal();

                    if (redirectTarget) {
                        window.location.href = redirectTarget;
                    }
                } else {
                    // Login failed
                    loginError.textContent = data.message || 'Invalid username or password';
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                loginError.textContent = 'An error occurred. Please try again.';
            });
    });
    
    function logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        updateUIForLoginStatus(false, null);
        
        window.location.href = 'index.php';
    }
    
    const chatLink = document.getElementById('chatLink');
    const chatModal = document.getElementById('chatModal');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const quickQuestions = document.querySelectorAll('.quick-question-btn');

    function addMessage(text, className) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', className);
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    quickQuestions.forEach(button => {
        button.addEventListener('click', function () {
            const question = this.getAttribute('data-question');
            addMessage(question, 'user-message'); 

            setTimeout(() => {
                let response = '';
                switch (question.toLowerCase()) {
                    case 'shipping policy':
                        response = 'Our shipping policy ensures delivery within 3-5 business days.';
                        break;
                    case 'return policy':
                        response = 'You can return items within 30 days of purchase.';
                        break;
                    case 'product inquiry':
                        response = 'Please provide the product name for more details.';
                        break;
                    case 'payment methods':
                        response = 'We accept GCash, bank transfers, and cash on delivery.';
                        break;
                    case 'order tracking':
                        response = 'You can track your order using the tracking ID sent to your email.';
                        break;
                    default:
                        response = 'Thank you for your message! Our team will get back to you shortly.';
                        break;
                }
                addMessage(response, 'bot-message'); 
            }, 1000);
        });
    });

    function openChatModal() {
        chatModal.classList.add('show-modal');
        document.body.style.overflow = 'hidden';
    }
    
    function closeChatModal() {
        chatModal.classList.remove('show-modal');
        document.body.style.overflow = '';
    }
    
    if (chatLink) {
        chatLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (isLoggedIn) {
                openChatModal();
            } else {
                openLoginModal();
            }
        });
    }
    
    if (chatForm) {
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const message = chatInput.value.trim();
            
            if (message) {
                addMessage(message, 'user-message');
                
                chatInput.value = '';
                
                setTimeout(() => {
                    addMessage('Thank you for your message! Our team will get back to you shortly.', 'system-message');
                }, 1000);
            }
        });
    }
    
    if (chatModal) {
        const closeChatBtn = chatModal.querySelector('.close-chat');
        
        if (closeChatBtn) {
            closeChatBtn.addEventListener('click', closeChatModal);
        }
    }
    
    function updateUIForLoginStatus(isLoggedIn, username) {
        const dropdownMenu = document.getElementById('dropdownMenu');
        const usernameDisplay = document.getElementById('usernameDisplay');
        const heroShopNowBtn = document.getElementById('heroShopNowBtn');
        const footerShopLink = document.getElementById('footerShopLink');
        const shopNowLinks = document.querySelectorAll('.shop-now-link');
        const cartLinks = document.querySelectorAll('.cart-icon');
        const categoryCards = document.querySelectorAll('.category-card');
        
        if (isLoggedIn && username) {
            usernameDisplay.textContent = username;
            usernameDisplay.style.display = 'inline-block';
            
            dropdownMenu.innerHTML = `
                <a href="myaccount.php" class="dropdown-item">My Account</a>
                <a href="orders.php" class="dropdown-item">Orders</a>
                <a href="#" class="dropdown-item" id="logoutBtn">Logout</a>
            `;
            
            document.getElementById('logoutBtn').addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
            
            document.getElementById('sewingMachinesCard').onclick = function() {
                window.location.href = 'sewingmachines.php';
            };
            document.getElementById('sewingPartsCard').onclick = function() {
                window.location.href = 'sewingparts.php';
            };
            document.getElementById('fabricsCard').onclick = function() {
                window.location.href = 'fabrics.php';
            };
            
            heroShopNowBtn.onclick = function() {
                window.location.href = 'sewingmachines.php';
            };
            
            footerShopLink.onclick = function(e) {
                e.preventDefault();
                window.location.href = 'sewingmachines.php';
            };
            
            shopNowLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const category = this.getAttribute('data-category');
                    window.location.href = category;
                });
            });
            
            cartLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.location.href = 'cart.php';
                });
            });
            
        } else {
            usernameDisplay.textContent = '';
            usernameDisplay.style.display = 'none';
            
            dropdownMenu.innerHTML = `
                <button class="login-btn" id="loginBtn">LOGIN</button>
                <button class="signup-btn" id="signupBtn">SIGN UP</button>
            `;
            
            document.getElementById('loginBtn').addEventListener('click', function() {
                openLoginModal();
            });
            document.getElementById('signupBtn').addEventListener('click', function() {
                // Close any open modals before redirecting
                const loginModal = document.getElementById('loginModal');
                if (loginModal) {
                    loginModal.classList.remove('show-modal');
                    document.body.style.overflow = '';
                }
                window.location.href = 'includes/auth/sign_up.php';
            });
            
            document.getElementById('sewingMachinesCard').onclick = function() {
                openLoginModal('sewingmachines.php');
            };
            document.getElementById('sewingPartsCard').onclick = function() {
                openLoginModal('sewingparts.php');
            };
            document.getElementById('fabricsCard').onclick = function() {
                openLoginModal('fabrics.php');
            };
            
            heroShopNowBtn.onclick = function() {
                openLoginModal('sewingmachines.php');
            };
            
            footerShopLink.onclick = function(e) {
                e.preventDefault();
                openLoginModal('sewingmachines.php');
            };
            
            shopNowLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const category = this.getAttribute('data-category');
                    openLoginModal(category);
                });
            });
            
            cartLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    openLoginModal('cart.php');
                });
            });
        }
    }
    
    closeModal.addEventListener('click', closeLoginModal);
    modalOverlay.addEventListener('click', closeLoginModal);
    
    if (!isLoggedIn) {
        const loginBtns = document.querySelectorAll('.open-login-modal, #loginBtn');
        loginBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                openLoginModal();
            });
        });
    }

    const cartLink = document.querySelector('.cart-link');

    cartLink.addEventListener('click', function (e) {
        e.preventDefault(); 

        if (isLoggedIn) {
            window.location.href = 'cart.php';
        } else {
            openLoginModal('cart.php');
        }
    });
});