// js/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Logic ẩn/hiện Sidebar
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const layout = document.querySelector('.dashboard-layout');

    if (sidebarToggle && layout) {
        sidebarToggle.addEventListener('click', () => {
            layout.classList.toggle('sidebar-collapsed');
        });
    }

    // 2. Logic cho các nút lọc (Filter Buttons trên trang Lịch hẹn)
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Bỏ active ở tất cả các nút
            filterButtons.forEach(btn => btn.classList.remove('is-active'));
            // Thêm active cho nút vừa bấm
            button.classList.add('is-active');
            // (Trong dự án thực tế, bạn sẽ gọi hàm để lọc dữ liệu ở đây)
        });
    });
});