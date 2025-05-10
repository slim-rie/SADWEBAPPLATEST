document.addEventListener('DOMContentLoaded', function() {
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
    
    function openModal(modal) {
        modal.classList.add('show-modal');
        document.body.style.overflow = 'hidden'; 
    }
    
    function closeModal(modal) {
        modal.classList.remove('show-modal');
        document.body.style.overflow = ''; 
    }
    
    const loginBtn = document.getElementById('loginBtn');
    const signInLink = document.getElementById('signInLink');
    const loginModal = document.getElementById('loginModal');
    const closeModalButton = document.querySelector('.close-modal');
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    
    if (loginBtn) loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openModal(loginModal);
    });
    
    if (signInLink) signInLink.addEventListener('click', function(e) {
        e.preventDefault();
        openModal(loginModal);
    });
    
    if (closeModalButton) closeModalButton.addEventListener('click', function() {
        closeModal(loginModal);
    });
    
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', function() {
            const parentModal = this.parentElement;
            closeModal(parentModal);
        });
    });
    
    const passwordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const passwordMatchMessage = document.getElementById('password-match-message');
    const lengthReq = document.getElementById('length');
    const lowercaseReq = document.getElementById('lowercase');
    const uppercaseReq = document.getElementById('uppercase');
    const numberReq = document.getElementById('number');
    const specialReq = document.getElementById('special');
    
    passwordMatchMessage.style.display = 'none';
    
    function validatePassword() {
        const password = passwordInput.value;
        
        const hasLength = password.length >= 8;
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[$%/()[\]{}=?!.,\-_*|+~#]/.test(password);
        
        updateRequirement(lengthReq, hasLength);
        updateRequirement(lowercaseReq, hasLowercase);
        updateRequirement(uppercaseReq, hasUppercase);
        updateRequirement(numberReq, hasNumber);
        updateRequirement(specialReq, hasSpecial);
        
        return hasLength && hasLowercase && hasUppercase && hasNumber && hasSpecial;
    }
    
    function updateRequirement(element, isValid) {
        if (isValid) {
            element.classList.add('valid');
        } else {
            element.classList.remove('valid');
        }
    }
    
    function checkPasswordsMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword) {
            passwordMatchMessage.style.display = 'block';
            if (password === confirmPassword) {
                passwordMatchMessage.textContent = 'Passwords match';
                passwordMatchMessage.classList.add('valid');
                passwordMatchMessage.classList.remove('invalid');
                return true;
            } else {
                passwordMatchMessage.textContent = 'Passwords do not match';
                passwordMatchMessage.classList.add('invalid');
                passwordMatchMessage.classList.remove('valid');
                return false;
            }
        } else {
            passwordMatchMessage.style.display = 'none';
            return false;
        }
    }
    
    passwordInput.addEventListener('input', function() {
        validatePassword();
        if (confirmPasswordInput.value) {
            checkPasswordsMatch();
        }
    });
    
    confirmPasswordInput.addEventListener('input', checkPasswordsMatch);
    
    const successModal = document.getElementById('successModal');
    const successLoginBtn = document.getElementById('successLoginBtn');
    const signupForm = document.getElementById('signupForm');
    const loginForm = loginModal.querySelector('.login-form');
    const loginError = document.getElementById('loginError');
    
    successLoginBtn.addEventListener('click', function() {
        closeModal(successModal);
        
        openModal(loginModal);
    });
    
    if (loginModal) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const usernameInput = document.getElementById('username').value;
            const passwordInput = document.getElementById('password').value;
            
            if (usernameInput === 'customer' && passwordInput === 'customer') {
                localStorage.setItem('isLoggedIn', 'true');
                closeModal(loginModal);
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 400); 
            } else {
                loginError.textContent = 'Invalid username or password';
            }
        });
    }

    // Open Modal
    loginBtn.addEventListener('click', function () {
        loginModal.classList.add('show-modal');
        document.body.classList.add('modal-open'); // Disable scrolling
    });

    // Close Modal
    closeModalButton.addEventListener('click', function () {
        loginModal.classList.remove('show-modal');
        document.body.classList.remove('modal-open'); // Enable scrolling
    });

    // Close Modal When Clicking Outside
    loginModal.addEventListener('click', function (e) {
        if (e.target === loginModal) {
            loginModal.classList.remove('show-modal');
            document.body.classList.remove('modal-open'); // Enable scrolling
        }
    });
});