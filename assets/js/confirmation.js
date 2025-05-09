function redirectToOrders() {
    window.location.href = "orders.html"; 
}
document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('username') || "Guest"; 

    const usernameDisplay = document.getElementById('usernameDisplay');
    usernameDisplay.textContent = username; 
    usernameDisplay.style.display = 'inline-block';
});