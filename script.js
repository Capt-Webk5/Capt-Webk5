// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Password Generator
const passwordLength = document.getElementById('passwordLength');
const lengthValue = document.getElementById('lengthValue');
const includeUppercase = document.getElementById('includeUppercase');
const includeLowercase = document.getElementById('includeLowercase');
const includeNumbers = document.getElementById('includeNumbers');
const includeSymbols = document.getElementById('includeSymbols');
const generatedPassword = document.getElementById('generatedPassword');

// Update length display
if (passwordLength) {
    passwordLength.addEventListener('input', function() {
        lengthValue.textContent = this.value;
    });
}

function generatePassword() {
    const length = parseInt(passwordLength.value);
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = '';
    let password = '';

    if (includeUppercase.checked) charset += uppercase;
    if (includeLowercase.checked) charset += lowercase;
    if (includeNumbers.checked) charset += numbers;
    if (includeSymbols.checked) charset += symbols;

    if (charset === '') {
        alert('Vui lòng chọn ít nhất một loại ký tự!');
        return;
    }

    // Ensure at least one character from each selected type
    if (includeUppercase.checked) password += getRandomChar(uppercase);
    if (includeLowercase.checked) password += getRandomChar(lowercase);
    if (includeNumbers.checked) password += getRandomChar(numbers);
    if (includeSymbols.checked) password += getRandomChar(symbols);

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += getRandomChar(charset);
    }

    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    generatedPassword.value = password;
}

function getRandomChar(str) {
    return str.charAt(Math.floor(Math.random() * str.length));
}

function copyPassword() {
    const password = generatedPassword.value;
    if (password) {
        navigator.clipboard.writeText(password).then(() => {
            showNotification('Mật khẩu đã được sao chép!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            generatedPassword.select();
            document.execCommand('copy');
            showNotification('Mật khẩu đã được sao chép!', 'success');
        });
    }
}

// Password Strength Checker
const passwordInput = document.getElementById('passwordInput');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const suggestions = document.getElementById('suggestions');

if (passwordInput) {
    passwordInput.addEventListener('input', function() {
        checkPasswordStrength(this.value);
    });
}

function checkPasswordStrength(password) {
    let score = 0;
    let feedback = [];

    if (password.length === 0) {
        strengthText.textContent = 'Nhập mật khẩu';
        strengthBar.style.width = '0%';
        suggestions.textContent = '';
        return;
    }

    // Length check
    if (password.length >= 8) score += 1;
    else feedback.push('Sử dụng ít nhất 8 ký tự');

    if (password.length >= 12) score += 1;
    else if (password.length >= 8) feedback.push('Tốt hơn nếu dài hơn 12 ký tự');

    // Complexity checks
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Thêm chữ thường');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Thêm chữ hoa');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Thêm số');

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('Thêm ký tự đặc biệt');

    // Common patterns check
    if (/(.)\1{2,}/.test(password)) {
        score -= 1;
        feedback.push('Tránh lặp ký tự');
    }

    if (/123|abc|qwe|asd|zxc/i.test(password)) {
        score -= 1;
        feedback.push('Tránh chuỗi ký tự liên tiếp');
    }

    // Update display
    const percentage = Math.max(0, (score / 6) * 100);
    strengthBar.style.width = percentage + '%';

    if (score <= 2) {
        strengthBar.style.background = '#ff4444';
        strengthText.textContent = 'Yếu';
        strengthText.style.color = '#ff4444';
    } else if (score <= 4) {
        strengthBar.style.background = '#ffa500';
        strengthText.textContent = 'Trung bình';
        strengthText.style.color = '#ffa500';
    } else {
        strengthBar.style.background = '#00ff00';
        strengthText.textContent = 'Mạnh';
        strengthText.style.color = '#00ff00';
    }

    suggestions.textContent = feedback.join(', ');
}

// URL Scanner
function scanURL() {
    const urlInput = document.getElementById('urlInput');
    const scanResult = document.getElementById('scanResult');
    const url = urlInput.value.trim();

    if (!url) {
        showNotification('Vui lòng nhập URL!', 'error');
        return;
    }

    if (!isValidURL(url)) {
        showNotification('URL không hợp lệ!', 'error');
        return;
    }

    scanResult.style.display = 'block';
    scanResult.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang quét...';
    scanResult.className = 'scan-result';

    // Simulate scanning process
    setTimeout(() => {
        const result = simulateURLScan(url);
        displayScanResult(result);
    }, 2000);
}

function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function simulateURLScan(url) {
    // Simple simulation based on URL characteristics
    const domain = new URL(url).hostname.toLowerCase();
    
    // Simulated malicious patterns
    const suspiciousDomains = ['phishing', 'malware', 'virus', 'hack', 'suspicious'];
    const trustedDomains = ['google.com', 'facebook.com', 'microsoft.com', 'apple.com', 'github.com'];
    
    if (suspiciousDomains.some(pattern => domain.includes(pattern))) {
        return {
            status: 'danger',
            message: '⚠️ CẢNH BÁO: URL có thể độc hại!',
            details: 'Domain này có chứa từ khóa đáng ngờ. Không nên truy cập.'
        };
    }
    
    if (trustedDomains.some(trusted => domain.includes(trusted))) {
        return {
            status: 'safe',
            message: '✅ An toàn',
            details: 'URL này được xác định là an toàn.'
        };
    }
    
    if (!url.startsWith('https://')) {
        return {
            status: 'warning',
            message: '⚠️ Cảnh báo',
            details: 'URL không sử dụng HTTPS. Dữ liệu có thể không được mã hóa.'
        };
    }
    
    return {
        status: 'safe',
        message: '✅ Có vẻ an toàn',
        details: 'Không phát hiện dấu hiệu đáng ngờ rõ ràng.'
    };
}

function displayScanResult(result) {
    const scanResult = document.getElementById('scanResult');
    scanResult.className = `scan-result ${result.status}`;
    scanResult.innerHTML = `
        <div><strong>${result.message}</strong></div>
        <div>${result.details}</div>
    `;
}

// Hash Generator
async function generateHash() {
    const hashInput = document.getElementById('hashInput');
    const hashType = document.getElementById('hashType');
    const hashResult = document.getElementById('hashResult');
    
    const text = hashInput.value.trim();
    const type = hashType.value;
    
    if (!text) {
        showNotification('Vui lòng nhập text cần hash!', 'error');
        return;
    }
    
    try {
        let hash;
        if (type === 'md5') {
            hash = await md5(text);
        } else if (type === 'sha1') {
            hash = await sha1(text);
        } else if (type === 'sha256') {
            hash = await sha256(text);
        }
        
        hashResult.value = hash;
    } catch (error) {
        showNotification('Lỗi khi tạo hash!', 'error');
    }
}

// Simple hash functions (for demonstration - in production use crypto libraries)
async function md5(text) {
    // This is a simplified version - use a proper crypto library in production
    return 'md5_' + btoa(text).substring(0, 32);
}

async function sha1(text) {
    if (window.crypto && window.crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hash = await window.crypto.subtle.digest('SHA-1', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    } else {
        return 'sha1_' + btoa(text).substring(0, 40);
    }
}

async function sha256(text) {
    if (window.crypto && window.crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hash = await window.crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    } else {
        return 'sha256_' + btoa(text).substring(0, 64);
    }
}

function copyHash() {
    const hashResult = document.getElementById('hashResult');
    const hash = hashResult.value;
    if (hash) {
        navigator.clipboard.writeText(hash).then(() => {
            showNotification('Hash đã được sao chép!', 'success');
        }).catch(() => {
            hashResult.select();
            document.execCommand('copy');
            showNotification('Hash đã được sao chép!', 'success');
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#00ff00' : type === 'error' ? '#ff4444' : '#00d4ff'};
        color: #000;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        header.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Generate initial password
    if (document.getElementById('generatedPassword')) {
        generatePassword();
    }
    
    // Add some interactive effects
    const cards = document.querySelectorAll('.tool-card, .news-card, .tip-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.tool-card, .news-card, .tip-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Contact form handling
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.', 'success');
        this.reset();
    });
}

// Easter egg - Konami code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length && 
        konamiCode.every((code, index) => code === konamiSequence[index])) {
        showNotification('🎉 Bạn đã khám phá được Easter Egg! Chế độ hacker đã được kích hoạt!', 'success');
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 3000);
        konamiCode = [];
    }
});