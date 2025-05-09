document.addEventListener('DOMContentLoaded', function () {
    const usernameDisplay = document.getElementById('usernameDisplay');
    const sidebarUsername = document.getElementById('sidebarUsername');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const userIcon = document.getElementById('user-icon');

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');

    if (isLoggedIn && username) {
        usernameDisplay.textContent = username;
        usernameDisplay.style.display = 'inline-block';

        sidebarUsername.textContent = username;

        dropdownMenu.innerHTML = `
            <a href="myaccount.html" class="dropdown-item">My Account</a>
            <a href="orders.html" class="dropdown-item">Orders</a>
            <a href="#" class="dropdown-item" id="logoutBtn">Logout</a>
        `;

        document.getElementById('logoutBtn').addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            alert('Logged out successfully!');
            window.location.href = 'index.html'; 
        });
    } else {
        window.location.href = 'login.html';
    }

    userIcon.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
    });

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.user-dropdown')) {
            dropdownMenu.classList.remove('active');
        }
    });

    const chatLink = document.getElementById('chatLink');
    const chatModal = document.getElementById('chatModal');
    const closeChat = document.getElementById('closeChat');

    chatLink.addEventListener('click', function (e) {
        e.preventDefault();
        chatModal.style.display = 'block';
    });

    closeChat.addEventListener('click', function () {
        chatModal.style.display = 'none';
    });

    window.addEventListener('click', function (e) {
        if (e.target === chatModal) {
            chatModal.style.display = 'none';
        }
    });

    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    deleteAccountBtn.addEventListener('click', function () {
        window.location.href = 'deleteinfo.html'; 
    });
});