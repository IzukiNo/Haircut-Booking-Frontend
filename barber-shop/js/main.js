// js/main.js

// Hàm nạp và chèn nội dung component
async function loadComponent(componentName) {
    const placeholders = document.querySelectorAll(`[data-component="${componentName}"]`);
    if (placeholders.length === 0) return; // Không có placeholder nào cần tải

    const filePath = `components/${componentName}.html`;
    
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Lỗi tải component: ${response.status} ${response.statusText}`);
        }
        const htmlContent = await response.text();
        
        placeholders.forEach(placeholder => {
            // Thay thế thẻ placeholder bằng nội dung HTML đã tải
            placeholder.outerHTML = htmlContent;
        });
        
    } catch (error) {
        console.error(`Không thể nạp component '${componentName}'. Đảm bảo bạn đang chạy trên Local Server.`, error);
    }
}

// Logic khởi tạo các tính năng tương tác (Hamburger, Sticky Header)
function initializeFeatures() {
    // 1. HAMBURGER MENU LOGIC
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');

    if (hamburgerBtn && mobileNav) {
        // Đảm bảo menu mobile có thể tương tác được sau khi tải component
        mobileNav.style.display = 'none'; 
        
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('is-active');

            if (mobileNav.style.display === 'flex') {
                mobileNav.style.display = 'none';
            } else {
                mobileNav.style.display = 'flex';
            }
        });
    }

    // 2. STICKY HEADER LOGIC
    const mainHeader = document.getElementById('main-header');
    if (mainHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) { 
                mainHeader.classList.add('sticky');
            } else {
                mainHeader.classList.remove('sticky');
            }
        });
    }
    
    // 3. LOGIC ACTIVE LINK (Cần component header đã được nạp)
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-header .nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}


document.addEventListener('DOMContentLoaded', async () => {
    // Tải các component theo thứ tự ưu tiên
    await loadComponent('header');
    await loadComponent('mobile-nav');
    await loadComponent('footer');
    await loadComponent('testimonials');
    await loadComponent('promo-banner'); 
    
    // Khởi tạo tính năng sau khi TẤT CẢ component đã được chèn vào DOM
    initializeFeatures();
});