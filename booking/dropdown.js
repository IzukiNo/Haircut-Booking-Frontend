document.addEventListener("DOMContentLoaded", function () {
  const userProfile = document.querySelector(".user-profile");
  if (userProfile) {
    userProfile.addEventListener("click", function (e) {
      userProfile.classList.toggle("open");
      userProfile.setAttribute(
        "aria-expanded",
        userProfile.classList.contains("open")
      );
      e.stopPropagation();
    });
    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
      if (!userProfile.contains(e.target)) {
        userProfile.classList.remove("open");
        userProfile.setAttribute("aria-expanded", "false");
      }
    });
  }
});
