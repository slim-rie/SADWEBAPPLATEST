document.addEventListener('DOMContentLoaded', function() {
    const products = {
        Shunfa: [
            {
                name: "Bobbin Case",
                partCode: "B9117-012-000",
                description: "High-quality bobbin case for sewing machines.",
                origin: "China Made",
                price: 150.00,
                rating: 4.5,
                sold: "120",
                image: "images/B9117-012-000.jpg",
                discount: "5%",
                refurbished: false
            },
            {
                name: "Bobbin",
                partCode: "B1837-012-000",
                description: "Durable bobbin for smooth sewing operations.",
                origin: "China Made",
                price: 50.00,
                rating: 4.2,
                sold: "200",
                image: "images/B1837-012-000.jpg",
                discount: null,
                refurbished: false
            },
            {
                name: "Positioning Finger",
                partCode: "B1835-012-000",
                description: "Precision positioning finger for sewing machines.",
                origin: "China Made",
                price: 75.00,
                rating: 4.0,
                sold: "80",
                image: "images/B1835-012-000.jpg",
                discount: null,
                refurbished: false
            },
            {
                name: "Rotating Hook",
                partCode: "B1830-127-000",
                description: "Reliable rotating hook for efficient sewing.",
                origin: "China Made",
                price: 300.00,
                rating: 4.8,
                sold: "50",
                image: "images/B1830-127-000.jpg",
                discount: "10%",
                refurbished: false
            },
            {
                name: "Presser Foot",
                partCode: "B3421-552-000",
                description: "Durable presser foot for various sewing applications.",
                origin: "China Made",
                price: 120.00,
                rating: 4.6,
                sold: "100",
                image: "images/B3421-552-000.png",
                discount: null,
                refurbished: false
            }
        ]
    };

    

   // DOM elements
   const productGrid = document.getElementById('productGrid');
    const categoryLinks = document.querySelectorAll('.category-list li a, .categories-grid a');
    const ratingItems = document.querySelectorAll('.rating-item');
    const sortButtons = document.querySelectorAll('.sort-btn:not(.dropdown-toggle)');
    const priceDropdown = document.getElementById('priceDropdown');
    const priceDropdownMenu = document.getElementById('priceDropdownMenu');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const applyPriceBtn = document.getElementById('applyPriceBtn');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const allCategoriesBtn = document.getElementById('allCategoriesBtn');
    const categoriesModal = document.getElementById('categoriesModal');
    const closeCategories = document.getElementById('closeCategories');

    let currentFilters = {
        category: 'Shunfa', 
        rating: 0,
        minPrice: 0,
        maxPrice: Infinity,
        sort: 'popular'
    };

    function renderProducts() {
        productGrid.innerHTML = '';
        
        let filteredProducts = [...(products[currentFilters.category] || [])];
        
        if (currentFilters.rating > 0) {
            filteredProducts = filteredProducts.filter(product => product.rating >= currentFilters.rating);
        }
        
        filteredProducts = filteredProducts.filter(product => 
            product.price >= currentFilters.minPrice && product.price <= currentFilters.maxPrice
        );
        
        switch(currentFilters.sort) {
            case 'popular':
                break;
            case 'latest':
                filteredProducts.reverse();
                break;
            case 'topsales':
                filteredProducts.sort((a, b) => {
                    const aSold = parseInt(a.sold.replace('K', '000'));
                    const bSold = parseInt(b.sold.replace('K', '000'));
                    return bSold - aSold;
                });
                break;
            case 'low-high':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'high-low':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
        }
        
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            let starsHTML = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= Math.floor(product.rating)) {
                    starsHTML += '<i class="fas fa-star"></i>';
                } else if (i - 0.5 <= product.rating) {
                    starsHTML += '<i class="fas fa-star-half-alt"></i>';
                } else {
                    starsHTML += '<i class="far fa-star"></i>';
                }
            }
            
            productCard.innerHTML = `
                <div class="product-badge">
                    ${product.discount ? `<span class="discount-badge">-${product.discount}</span>` : ''}
                    ${product.refurbished ? `<span class="refurbished-badge">Refurbished</span>` : ''}
                </div>
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">₱ ${product.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    <div class="product-rating">
                        <div class="stars">
                            ${starsHTML}
                        </div>
                        <span class="rating-value">${product.rating.toFixed(1)}</span>
                        <span class="review-count">${product.sold} sold</span>
                    </div>
                </div>
            `;
            
            productCard.addEventListener('click', function() {
                const productName = this.querySelector('h3').textContent.trim();
                window.location.href = `sp-productdetails.html?product=${encodeURIComponent(productName)}`;
            });
            
            productGrid.appendChild(productCard);
        });
        
        if (filteredProducts.length === 0) {
            productGrid.innerHTML = '<div class="no-products">No products match your filters. Try adjusting your criteria.</div>';
        }
        
        updateCategoryHighlighting();
    }
    
    function updateCategoryHighlighting() {
        document.querySelectorAll('.category-list li a').forEach(link => {
            const category = link.getAttribute('data-category');
            if (category === currentFilters.category) {
                link.parentElement.classList.add('active');
            } else {
                link.parentElement.classList.remove('active');
            }
        });
        
        document.querySelectorAll('.categories-grid a').forEach(link => {
            const category = link.getAttribute('data-category');
            if (category === currentFilters.category) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

  
    const defaultCategoryLink = document.querySelector(`.category-list li a[data-category="${currentFilters.category}"]`);
    if (defaultCategoryLink) {
        defaultCategoryLink.parentElement.classList.add('active');
    }
    renderProducts();

    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            
            currentFilters.category = category;
            renderProducts();
            
            categoriesModal.classList.remove('show-modal');
        });
    });


ratingItems.forEach(item => {
item.addEventListener('click', function() {
const rating = parseInt(this.getAttribute('data-rating'));

ratingItems.forEach(ri => {
    ri.classList.remove('active');
});

this.classList.add('active');

currentFilters.rating = rating;
renderProducts();
});
});

    sortButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sort = this.getAttribute('data-sort');
            
            sortButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            currentFilters.sort = sort;
            renderProducts();
        });
    });

    priceDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
        priceDropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', function() {
        priceDropdownMenu.classList.remove('show');
    });

    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            const sort = this.getAttribute('data-sort');
            
            currentFilters.sort = sort;
            renderProducts();
            
            priceDropdown.querySelector('.dropdown-toggle').innerHTML = 
                this.textContent + ' <i class="fas fa-chevron-down"></i>';
        });
    });

    applyPriceBtn.addEventListener('click', function() {
        const minPrice = parseFloat(minPriceInput.value) || 0;
        const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
        
        currentFilters.minPrice = minPrice;
        currentFilters.maxPrice = maxPrice;
        renderProducts();
    });

    allCategoriesBtn.addEventListener('click', function() {
        categoriesModal.classList.add('show-modal');
    });

    if (closeCategories) {
        closeCategories.addEventListener('click', function() {
            categoriesModal.classList.remove('show-modal');
        });
    }

    const modalOverlay = document.querySelector('#categoriesModal .modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function() {
            categoriesModal.classList.remove('show-modal');
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');

    const userIcon = document.getElementById('user-icon');
    const usernameDisplay = document.createElement('span');
    const dropdownMenu = document.getElementById('dropdownMenu');

    usernameDisplay.className = 'username';
    userIcon.parentNode.insertBefore(usernameDisplay, userIcon.nextSibling);

    function updateUIForLoginStatus(isLoggedIn, username) {
        if (isLoggedIn && username) {
            usernameDisplay.textContent = username;
            usernameDisplay.style.display = 'inline-block';

            dropdownMenu.innerHTML = `
                <a href="myaccount.html" class="dropdown-item">My Account</a>
                <a href="orders.html" class="dropdown-item">Orders</a>
                <a href="#" class="dropdown-item" id="logoutBtn">Logout</a>
            `;

            document.getElementById('logoutBtn').addEventListener('click', function (e) {
                e.preventDefault();
                logout();
            });
        } else {
            usernameDisplay.textContent = '';
            usernameDisplay.style.display = 'none';

            dropdownMenu.innerHTML = `
                <button class="login-btn" id="loginBtn">LOGIN</button>
                <button class="signup-btn" onclick="window.location.href='signup.html'">SIGN UP</button>
            `;

            document.getElementById('loginBtn').addEventListener('click', openLoginModal);
        }
    }

    function logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = 'index.html'; 
    }

    function openLoginModal() {
        const loginModal = document.getElementById('loginModal');
        loginModal.classList.add('show-modal');
        document.body.style.overflow = 'hidden'; 
    }

    const closeModal = document.querySelector('.close-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    closeModal.addEventListener('click', function () {
        const loginModal = document.getElementById('loginModal');
        loginModal.classList.remove('show-modal');
        document.body.style.overflow = ''; 
    });
    modalOverlay.addEventListener('click', function () {
        const loginModal = document.getElementById('loginModal');
        loginModal.classList.remove('show-modal');
        document.body.style.overflow = ''; 
    });

    updateUIForLoginStatus(isLoggedIn, username);
});