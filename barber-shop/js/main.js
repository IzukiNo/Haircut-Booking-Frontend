
document.addEventListener('DOMContentLoaded', () => {
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
    
    // 3. ACTIVE LINK LOGIC
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-header .nav-link, .mobile-nav .nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});