
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const signUpMobileButton = document.getElementById('signUpMobile');
const signInMobileButton = document.getElementById('signInMobile');
const container = document.getElementById('auth-container');

function activateSignUp() {
    container.classList.add("right-panel-active");
}

function activateSignIn() {
    container.classList.remove("right-panel-active");
}

if (signUpButton) signUpButton.addEventListener('click', activateSignUp);
if (signInButton) signInButton.addEventListener('click', activateSignIn);
if (signUpMobileButton) signUpMobileButton.addEventListener('click', activateSignUp);
if (signInMobileButton) signInMobileButton.addEventListener('click', activateSignIn);