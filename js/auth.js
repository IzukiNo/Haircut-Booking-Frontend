async function register(username, email, password) {
  try {
    const response = await fetch(
      "http://157.66.100.145:4000/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: username, email, password }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      console.log("User registered successfully:", data);
    }

    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    return null;
  }
}
async function login(email, password) {
  try {
    const response = await fetch("http://157.66.100.145:4000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!data) {
      throw new Error("No response data");
    }
    return data;
  } catch (error) {
    console.error("Error logging in user:", error);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(registerForm);
      const username = formData.get("username");
      const email = formData.get("email");
      const password = formData.get("password");

      const res = await register(username, email, password);

      if (res && res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: (res && res.message) || "You have registered successfully!",
        }).then(() => {
          window.location.href = "profile";
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text:
            (res && res.message) || "An error occurred during registration.",
        });
        registerForm.reset();
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const email = formData.get("email");
      const password = formData.get("password");

      const res = await login(email, password);

      if (res && res.status === 200) {
        localStorage.setItem("token", res.token);
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: res.message || "You have logged in successfully!",
        }).then(() => {
          window.location.href = "profile";
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: (res && res.message) || "An error occurred during login.",
        });
        loginForm.reset();
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const signUpButton = document.getElementById("signUp");
  const signInButton = document.getElementById("signIn");
  const signUpMobileLink = document.getElementById("signUpMobile");
  const signInMobileLink = document.getElementById("signInMobile");
  const container = document.getElementById("auth-container");

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
  if (signUpButton) signUpButton.addEventListener("click", activateSignUp);
  if (signInButton) signInButton.addEventListener("click", activateSignIn);
  if (signUpMobileLink)
    signUpMobileLink.addEventListener("click", activateSignUp);
  if (signInMobileLink)
    signInMobileLink.addEventListener("click", activateSignIn);
});
