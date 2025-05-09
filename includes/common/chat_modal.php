<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once 'config/database.php';

class ChatHandler {
    private $conn;
    private $user_id;
    private $is_logged_in;

    public function __construct($conn) {
        $this->conn = $conn;
        $this->user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
        $this->is_logged_in = isset($_SESSION['user_id']);
    }

    public function handleMessage($message, $type = 'user') {
        if (!$this->is_logged_in && $type === 'user') {
            return [
                'success' => false,
                'message' => 'Please login to send messages'
            ];
        }

        try {
            if ($type === 'user') {
                // Save user message
                $stmt = $this->conn->prepare("INSERT INTO chat_messages (user_id, message, type) VALUES (?, ?, 'user')");
                $stmt->execute([$this->user_id, $message]);

                // Get bot response
                $response = $this->getBotResponse($message);
                
                // Save bot response
                $stmt = $this->conn->prepare("INSERT INTO chat_messages (user_id, message, type) VALUES (?, ?, 'bot')");
                $stmt->execute([$this->user_id, $response]);

                return [
                    'success' => true,
                    'user_message' => $message,
                    'bot_response' => $response
                ];
            }
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'An error occurred while processing your message'
            ];
        }
    }

    private function getBotResponse($message) {
        // Simple response logic - you can make this more sophisticated
        $message = strtolower($message);
        
        if (strpos($message, 'shipping') !== false) {
            return "We offer free shipping for orders above ₱5,000. Standard shipping takes 3-5 business days.";
        } elseif (strpos($message, 'return') !== false) {
            return "You can return items within 7 days of delivery. Items must be unused and in original packaging.";
        } elseif (strpos($message, 'payment') !== false) {
            return "We accept GCash, Bank Transfer, and Cash on Delivery.";
        } elseif (strpos($message, 'track') !== false) {
            return "You can track your order by logging into your account and visiting the Orders section.";
        } elseif (strpos($message, 'seller') !== false) {
            return "Our customer service team is available Monday to Friday, 9 AM to 6 PM.";
        } else {
            return "I'm here to help! You can ask me about shipping, returns, payments, order tracking, or chat with a seller.";
        }
    }

    public function getChatHistory() {
        if (!$this->is_logged_in) {
            return [
                'success' => false,
                'message' => 'Please login to view chat history'
            ];
        }

        try {
            $stmt = $this->conn->prepare("SELECT * FROM chat_messages WHERE user_id = ? ORDER BY created_at DESC LIMIT 10");
            $stmt->execute([$this->user_id]);
            $messages = $stmt->fetchAll();

            return [
                'success' => true,
                'messages' => $messages
            ];
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'An error occurred while fetching chat history'
            ];
        }
    }
}

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $chat = new ChatHandler($conn);
    
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'send_message':
                if (isset($_POST['message'])) {
                    $result = $chat->handleMessage($_POST['message']);
                    echo json_encode($result);
                }
                break;
                
            case 'get_history':
                $result = $chat->getChatHistory();
                echo json_encode($result);
                break;
        }
    }
}
?>

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

<script>
document.addEventListener('DOMContentLoaded', function() {
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const quickQuestions = document.getElementById('quickQuestions');

    // Handle quick questions
    quickQuestions.addEventListener('click', function(e) {
        if (e.target.classList.contains('quick-question-btn')) {
            const question = e.target.dataset.question;
            sendMessage(question);
        }
    });

    // Handle form submission
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (message) {
            sendMessage(message);
            chatInput.value = '';
        }
    });

    function sendMessage(message) {
        // Add user message to chat
        addMessage(message, 'user');

        // Send message to server
        fetch('includes/common/chat_modal.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=send_message&message=${encodeURIComponent(message)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                addMessage(data.bot_response, 'bot');
            } else {
                addMessage(data.message, 'bot');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            addMessage('Sorry, there was an error processing your message.', 'bot');
        });
    }

    function addMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Load chat history
    fetch('includes/common/chat_modal.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=get_history'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            data.messages.reverse().forEach(msg => {
                addMessage(msg.message, msg.type);
            });
        }
    })
    .catch(error => console.error('Error loading chat history:', error));
});
</script>
    