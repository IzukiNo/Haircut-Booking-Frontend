
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-item');
    const panes = document.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = tab.getAttribute('data-target');
            const targetPane = document.getElementById(targetId);

            // Bỏ active ở tất cả các tab và pane
            tabs.forEach(t => t.classList.remove('is-active'));
            panes.forEach(p => p.classList.remove('is-active'));

            // Thêm active cho tab và pane được chọn
            tab.classList.add('is-active');
            if (targetPane) {
                targetPane.classList.add('is-active');
            }
        });
    });
});