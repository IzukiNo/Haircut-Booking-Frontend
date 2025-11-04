document.addEventListener("DOMContentLoaded", () => {
  const loadComponents = async () => {
    const components = document.querySelectorAll("[data-component]");
    for (const component of components) {
      const componentName = component.getAttribute("data-component");
      try {
        const response = await fetch(`html-components/${componentName}.html`);
        if (response.ok) {
          const content = await response.text();
          component.innerHTML = content;
        } else {
          component.innerHTML = `<p style="color:red;">Error loading ${componentName}.html</p>`;
          console.error("Could not load component:", componentName);
        }
      } catch (error) {
        console.error("Error fetching component:", error);
      }
    }
  };

  const initializePage = () => {
    // 1. HAMBURGER MENU LOGIC
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const mobileNav = document.getElementById("mobile-nav");

    if (hamburgerBtn && mobileNav) {
      hamburgerBtn.addEventListener("click", () => {
        hamburgerBtn.classList.toggle("is-active");
        mobileNav.classList.toggle("is-active"); // Sử dụng class thay vì style
      });
    } // 2. STICKY HEADER LOGIC (IMPROVED - WITH THROTTLING)
    const mainHeader = document.getElementById("main-header");
    if (mainHeader) {
      let ticking = false;

      const updateHeader = () => {
        if (window.scrollY > 50) {
          if (!mainHeader.classList.contains("sticky")) {
            mainHeader.classList.add("sticky");
          }
        } else {
          if (mainHeader.classList.contains("sticky")) {
            mainHeader.classList.remove("sticky");
          }
        }
        ticking = false;
      };

      const requestTick = () => {
        if (!ticking) {
          requestAnimationFrame(updateHeader);
          ticking = true;
        }
      };

      window.addEventListener("scroll", requestTick, { passive: true });
    }

    // 3. ACTIVE LINK LOGIC
    const currentPath =
      window.location.pathname.split("/").pop() || "index.html";
    document
      .querySelectorAll(".main-header .nav-link, .mobile-nav .nav-link")
      .forEach((link) => {
        const linkPath = link.getAttribute("href").split("/").pop();
        if (linkPath === currentPath) {
          link.classList.add("active");
        }
      });
  };

  // Chạy tuần tự: Tải component trước, sau đó mới khởi tạo các chức năng
  loadComponents().then(initializePage);
});
