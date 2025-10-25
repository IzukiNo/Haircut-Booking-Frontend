
// Hàm nạp và chèn nội dung component (Fetch and Insert HTML)
async function loadComponent(componentName) {
    const placeholders = document.querySelectorAll(`[data-component="${componentName}"]`);
    if (placeholders.length === 0) return;

    const filePath = `html-components/${componentName}.html`;
    
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Lỗi tải component: ${response.status} ${response.statusText}`);
        }
        const htmlContent = await response.text();
        
        placeholders.forEach(placeholder => {
            placeholder.outerHTML = htmlContent;
        });
        
    } catch (error) {
        console.error(`Không thể nạp component '${componentName}'. Vui lòng chạy trên Local Server.`, error);
    }
}

// Logic khởi tạo các tính năng tương tác sau khi DOM được tải xong
function initializeFeatures() {
    // 1. HAMBURGER MENU LOGIC
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');

    if (hamburgerBtn && mobileNav) {
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
    
    // 3. LOGIC ACTIVE LINK (Đánh dấu trang hiện tại)
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-header .nav-link, .mobile-nav .nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}


document.addEventListener('DOMContentLoaded', async () => {
    // Tải component bắt buộc (header và mobile-nav) trước
    await loadComponent('header');
    await loadComponent('mobile-nav');
    
    // Tải các component còn lại (chờ 50ms để DOM ổn định)
    await new Promise(resolve => setTimeout(resolve, 50)); 
    await loadComponent('footer');
    await loadComponent('testimonials');
    await loadComponent('promo-banner'); 
    
    initializeFeatures();
});