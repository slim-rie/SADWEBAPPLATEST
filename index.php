<?php
require_once 'config/database.php';
require_once 'includes/common/header.php';
require_once 'includes/common/chat_modal.php';
?>

<div class="hero">
    <div class="hero-content">
        <h1>JBR Tanching C.O</h1>
        <p>Quality Sewing Supplies Since 2014</p>
        <button class="shop-now-btn" id="heroShopNowBtn">Shop Now</button>
    </div>
</div>

<div class="user-dropdown">
    <div class="user-info">
        <img src="assets/images/user.png" alt="User" class="icon-img" id="user-icon">
        <span class="username" id="usernameDisplay">Guest</span>
    </div>
    <div class="dropdown-container" id="dropdownMenu" style="display: none;">
        <ul>
            <li><a href="profile.php">Profile</a></li>
            <li><a href="orders.php">My Orders</a></li>
            <li><a href="sign_out.php">Logout</a></li>
        </ul>
    </div>
</div>

<section class="categories container">
    <h2>Categories</h2>
    <div class="category-grid">
        <div class="category-card" id="sewingMachinesCard">
            <img src="https://th.bing.com/th/id/OIP.I6id9lwCR-8KziI8fqXzXgHaE7?rs=1&pid=ImgDetMain" alt="Sewing Machines">
            <div class="category-overlay">
                <div class="category-content">
                    <span class="category-icon">✂️</span>
                    <h3>Sewing Machines</h3>
                </div>
            </div>
        </div>

        <div class="category-card" id="sewingPartsCard">
            <img src="https://th.bing.com/th/id/R.af428faf9690299299f11425c3614434?rik=qYS3skZ56hJo%2bg&riu=http%3a%2f%2fwww.amtmim.com%2fwp-content%2fuploads%2f2018%2f12%2fMIM-Parts.jpg&ehk=B4K7LDUV8VE%2bbSb4NhUxuVjp1kCRlBU3semyuQPzYME%3d&risl=&pid=ImgRaw&r=0" alt="Sewing Parts">
            <div class="category-overlay">
                <div class="category-content">
                    <span class="category-icon">⚙️</span>
                    <h3>Sewing Parts</h3>
                </div>
            </div>
        </div>

        <div class="category-card" id="fabricsCard">
            <img src="https://th.bing.com/th/id/OIP.AyLuhVUfiMkRt-d0safm8AHaE8?rs=1&pid=ImgDetMain" alt="Fabrics">
            <div class="category-overlay">
                <div class="category-content">
                    <span class="category-icon">🧵</span>
                    <h3>Fabrics</h3>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="fabrics-section container">
    <h2 class="section-title">Fabrics of the Season</h2>
    <div class="product-grid">
        <div class="product-card">
            <img src="https://tse2.mm.bing.net/th/id/OIP.Kdi2IoX-waBszv0nQXhwjgHaHa?rs=1&pid=ImgDetMain" alt="Floral Fabric">
            <div class="product-info">
                <h3>Floral Fabric</h3>
                <p>Beautiful floral patterns perfect for summer projects.</p>
                <div class="product-footer">
                    <a href="#" class="shop-now-link" data-category="fabrics.php">Shop Now</a>
                </div> 
            </div>
        </div>

        <div class="product-card">
            <img src="https://tse4.mm.bing.net/th/id/OIP.gim17axiTfaQHXBg0B5_twHaE6?rs=1&pid=ImgDetMain" alt="Cotton Fabric">
            <div class="product-info">
                <h3>Cotton Fabric</h3>
                <p>Soft and breathable cotton fabric for all your sewing needs.</p>
                <div class="product-footer">
                    <a href="#" class="shop-now-link" data-category="fabrics.php">Shop Now</a>
                </div>
            </div>
        </div>

        <div class="product-card">
            <img src="https://www.luckybelly.com/wp-content/uploads/2023/07/Silk-fabric.jpg" alt="Silk Fabric">
            <div class="product-info">
                <h3>Silk Fabric</h3>
                <p>Luxurious silk fabric for elegant garments.</p>
                <div class="product-footer">
                    <a href="#" class="shop-now-link" data-category="fabrics.php">Shop Now</a>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="save-on-dream-machine container">
    <h2 class="section-title">Save on Your Dream Machine</h2>
    <div class="slider-container">
        <button class="slider-arrow slider-prev">
            <i class="fas fa-chevron-left"></i>
        </button>
        <div class="product-slider">
            <div class="product-card">
                <img src="https://i5.walmartimages.com/asr/e88894ec-374d-4af9-83b0-36fd50099543_2.52ebec62073f16daa444db05478c0d54.jpeg" alt="Brother Sewing Machine">
                <div class="product-info">
                    <h3>Brother Sewing Machine</h3>
                    <p>Advanced computerized sewing machine with 100+ built-in stitches.</p>
                    <div class="product-footer">
                        <span class="price">₱14,599</span>
                        <a href="#" class="cart-icon"><i class="fas fa-shopping-cart"></i></a>
                    </div>
                </div>
            </div>

            <div class="product-card">
                <img src="https://tse2.mm.bing.net/th/id/OIP.LDNjnaMwmEQIyumN_zLGxgHaHa?rs=1&pid=ImgDetMain" alt="Janome Sewing Machine">
                <div class="product-info">
                    <h3>Janome Sewing Machine</h3>
                    <p>Professional-grade sewing machine perfect for quilting and heavy fabrics.</p>
                    <div class="product-footer">
                        <span class="price">₱10,999</span>
                        <a href="#" class="cart-icon"><i class="fas fa-shopping-cart"></i></a>
                    </div>
                </div>
            </div>

            <div class="product-card">
                <img src="https://tse1.mm.bing.net/th/id/OIP.6mzowDJS7jOOYVcAkGr-5QHaGU?rs=1&pid=ImgDetMain" alt="Singer Sewing Machine">
                <div class="product-info">
                    <h3>Singer Sewing Machine</h3>
                    <p>Reliable mechanical sewing machine ideal for beginners and everyday use.</p>
                    <div class="product-footer">
                        <span class="price">₱15,799</span>
                        <a href="#" class="cart-icon"><i class="fas fa-shopping-cart"></i></a>
                    </div>
                </div>
            </div>

            <div class="product-card">
                <img src="https://tse1.mm.bing.net/th/id/OIP.Tx36Jma92GYQD3DeOiQSaAHaFj?rs=1&pid=ImgDetMain" alt="Juki Sewing Machine">
                <div class="product-info">
                    <h3>Juki Sewing Machine</h3>
                    <p>Industrial-strength sewing machine for heavy-duty projects and constant use.</p>
                    <div class="product-footer">
                        <span class="price">₱19,999</span>
                        <a href="#" class="cart-icon"><i class="fas fa-shopping-cart"></i></a>
                    </div>
                </div>
            </div>

            <div class="product-card">
                <img src="https://media.rainpos.com/2280/bernina_350pe_sewing_machine_0.jpg" alt="Bernina Sewing Machine">
                <div class="product-info">
                    <h3>Bernina Sewing Machine</h3>
                    <p>Swiss precision engineering with innovative features for perfect stitching.</p>
                    <div class="product-footer">
                        <span class="price">₱23,899</span>
                        <a href="#" class="cart-icon"><i class="fas fa-shopping-cart"></i></a>
                    </div>
                </div>
            </div>
        </div>
        <button class="slider-arrow slider-next">
            <i class="fas fa-chevron-right"></i>
        </button>
    </div>
</section>

<section class="perfect-parts container">
    <h2 class="section-title">Perfect Parts for Precision</h2>
    <div class="product-grid">
        <div class="product-card">
            <img src="https://th.bing.com/th/id/OIP.cfVbbj4_rhNz-iuqyxkZ0gHaE8?rs=1&pid=ImgDetMain" alt="Sewing Machine Needles">
            <div class="product-info">
                <h3>Sewing Machine Needles</h3>
                <p>High-quality needles for all types of fabrics.</p>
                <div class="product-footer">
                    <a href="#" class="shop-now-link" data-category="sewingparts.php">Shop Now</a>
                </div>
            </div>
        </div>

        <div class="product-card">
            <img src="https://d2culxnxbccemt.cloudfront.net/sew/content/uploads/2017/12/29094928/sewing-machine-feet.png" alt="Sewing Machine Feet">
            <div class="product-info">
                <h3>Sewing Machine Feet</h3>
                <p>Versatile feet for various sewing techniques.</p>
                <div class="product-footer">
                    <a href="#" class="shop-now-link" data-category="sewingparts.php">Shop Now</a>
                </div>
            </div>
        </div>

        <div class="product-card">
            <img src="https://d2culxnxbccemt.cloudfront.net/sew/content/uploads/2017/12/29094928/sewing-machine-feet.png" alt="Sewing Machine Bobbin">
            <div class="product-info">
                <h3>Sewing Machine Bobbin</h3>
                <p>Keep your stitches smooth and your machine humming with our premium sewing machine bobbins.</p>
                <div class="product-footer">
                    <a href="#" class="shop-now-link" data-category="sewingparts.php">Shop Now</a>
                </div>
            </div>
        </div>
    </div>
</section>

<div class="modal" id="loginModal">
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Login to Your Account</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <form class="login-form" id="loginForm">
                    <div class="form-group">
                        <label for="username">Username/Email</label>
                        <input type="text" id="username" placeholder="Enter your username or email">
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" placeholder="Enter your password">
                    </div>
                    <div class="error-message" id="loginError"></div>
                    <button type="submit" class="submit-btn">LOGIN</button>
                </form>
                <div class="or-divider">
                    <span>OR</span>
                </div>
                <button class="google-btn" onclick="window.location.href='redirect.php'">
                    <i class="fab fa-google"></i> Continue with Google
                </button>
                <p class="signup-link">Don't have an account? 
                <a href="includes/auth/sign_up.php">Sign Up</a>
            </div>
        </div>
    </div>

<div class="chat-modal" id="chatModal">
    <div class="chat-header">
        <h3>Customer Support</h3>
        <button class="close-chat" id="closeChat">&times;</button>
    </div>
    <div class="chat-messages" id="chatMessages">
        <div class="message bot-message">
            Hello! How can I help you with your shopping today?
        </div>
    </div>
    <div class="quick-questions" id="quickQuestions">
        <button class="quick-question-btn" data-question="Shipping policy">Shipping policy</button>
        <button class="quick-question-btn" data-question="Return policy">Return policy</button>
        <button class="quick-question-btn" data-question="Product inquiry">Product inquiry</button>
        <button class="quick-question-btn" data-question="Payment methods">Payment methods</button>
        <button class="quick-question-btn" data-question="Order tracking">Order tracking</button>
        <button class="quick-question-btn" data-question="Chat with Seller">Chat with Seller</button>
    </div>
    <form class="chat-form" id="chatForm">
        <input type="text" class="chat-input" id="chatInput" placeholder="Type your message...">
        <label for="fileInput" class="file-label">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="clip-icon">
                <path d="M21.44 11.05l-8.49 8.49a5.5 5.5 0 01-7.78-7.78l8.49-8.49a3.5 3.5 0 014.95 4.95l-8.49 8.49a1.5 1.5 0 01-2.12-2.12l8.49-8.49.71.71-8.49 8.49a.5.5 0 00.71.71l8.49-8.49a2.5 2.5 0 10-3.54-3.54l-8.49 8.49a4.5 4.5 0 006.36 6.36l8.49-8.49.71.71z"/>
            </svg>
            <input type="file" id="fileInput" class="file-input" style="display: none;" accept="image/*,video/*">
        </label>
        <button type="submit" class="send-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
        </button>
    </form>
    <div id="filePreview" class="file-preview"></div>
</div>
<script src="assets/js/main.js"></script>
</body>
</html>
<?php
require_once 'includes/common/footer.php';
?>
