
document.addEventListener('DOMContentLoaded', () => {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const signUpMobileLink = document.getElementById('signUpMobile');
    const signInMobileLink = document.getElementById('signInMobile');
    const container = document.getElementById('auth-container');

    // Hàm để kích hoạt panel đăng ký
    function activateSignUp(event) {
        event.preventDefault(); // Ngăn link nhảy trang
        container.classList.add("right-panel-active");
    }

    // Hàm để kích hoạt panel đăng nhập
    function activateSignIn(event) {
        event.preventDefault(); // Ngăn link nhảy trang
        container.classList.remove("right-panel-active");
    }

    // Gán sự kiện cho các nút
    if (signUpButton) signUpButton.addEventListener('click', activateSignUp);
    if (signInButton) signInButton.addEventListener('click', activateSignIn);
    if (signUpMobileLink) signUpMobileLink.addEventListener('click', activateSignUp);
    if (signInMobileLink) signInMobileLink.addEventListener('click', activateSignIn);
});