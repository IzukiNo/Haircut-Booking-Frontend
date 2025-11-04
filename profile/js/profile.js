let userProfile = null;
let resetSaveBtnState;
let resetChangePasswordBtnState;

async function getUserProfile() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage.");
    return null;
  }

  try {
    const res = await fetch("http://localhost:3000/api/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = await res.json();
    if (res.ok) {
      return data.data;
    } else {
      console.error("Failed to fetch user profile:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

async function populateUserProfile() {
  userProfile = await getUserProfile();
  const nameElem = document.getElementById("customer-name");
  const emailElem = document.getElementById("customer-email");
  const fullnameInput = document.getElementById("fullname");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const roleElem = document.getElementById("role-label");
  const roleInput = document.getElementById("role");

  function getRoleText(index) {
    const roleText = {
      0: "Khách Hàng",
      1: "Thu Ngân",
      2: "Thợ Cắt Tóc",
      3: "Quản Lý",
      4: "Quản Trị Viên",
    };
    return roleText[index] || "-";
  }

  if (userProfile) {
    if (nameElem) nameElem.textContent = userProfile.username || "-";
    if (emailElem) emailElem.textContent = userProfile.email || "-";
    if (fullnameInput) fullnameInput.value = userProfile.username || "";
    if (emailInput) emailInput.value = userProfile.email || "";
    if (phoneInput) phoneInput.value = userProfile.phone || "";
    if (roleElem) roleElem.textContent = getRoleText(userProfile.role) || "-";
    if (roleInput) roleInput.value = getRoleText(userProfile.role) || "-";

    if (userProfile.role >= 1) {
      addDashboardTab();
    }

    return true;
  }
  return false;
}

function setupSaveButtonState() {
  const fullnameInput = document.getElementById("fullname");
  const phoneInput = document.getElementById("phone");
  const saveBtn = document.getElementById("save-button");
  if (!fullnameInput || !phoneInput || !saveBtn) return;

  // Store initial values
  let initialFullname = fullnameInput.value;
  let initialPhone = phoneInput.value;

  function checkChanges() {
    const changed =
      fullnameInput.value !== initialFullname ||
      phoneInput.value !== initialPhone;
    saveBtn.disabled = !changed;
  }

  fullnameInput.addEventListener("input", checkChanges);
  phoneInput.addEventListener("input", checkChanges);
  checkChanges();

  // Expose a way to reset initial values after update
  return function resetInitialValues() {
    initialFullname = fullnameInput.value;
    initialPhone = phoneInput.value;
    checkChanges();
  };
}

function setupChangePasswordButtonState() {
  const form = document.querySelector(".change-password-form");
  if (!form) return;
  const newPassInput = form.querySelector("#new-password");
  const repeatPassInput = form.querySelector("#confirm-password");
  const submitBtn = form.querySelector("#change-password-button");

  function checkMatch() {
    const newPass = newPassInput.value;
    const repeatPass = repeatPassInput.value;
    submitBtn.disabled = !(newPass && repeatPass && newPass === repeatPass);
  }

  newPassInput.addEventListener("input", checkMatch);
  repeatPassInput.addEventListener("input", checkMatch);
  checkMatch();

  return function resetChangePasswordBtn() {
    checkMatch();
  };
}

async function changePassword(currentPassword, newPassword) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage.");
    return false;
  }

  try {
    const res = await fetch("http://localhost:3000/api/users/me/password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      return true;
    } else {
      console.error("Failed to change password:", data.message);
      return false;
    }
  } catch (error) {
    console.error("Error changing password:", error);
    return false;
  }
}

async function handleChangePasswordButton() {
  const form = document.querySelector(".change-password-form");
  if (!form) return;
  const currentPassInput = form.querySelector("#current-password");
  const newPassInput = form.querySelector("#new-password");
  const repeatPassInput = form.querySelector("#confirm-password");

  const currentPassword = currentPassInput.value.trim();
  const newPassword = newPassInput.value.trim();
  const confirmPassword = repeatPassInput.value.trim();

  if (!currentPassword || !newPassword || !confirmPassword) {
    Swal.fire({
      icon: "warning",
      title: "Lỗi",
      text: "Vui lòng điền đầy đủ thông tin.",
    });
    return;
  }

  if (newPassword.length < 8) {
    Swal.fire({
      icon: "warning",
      title: "Lỗi",
      text: "Mật khẩu mới phải có ít nhất 8 ký tự.",
    });
    newPassInput.focus();
    return;
  }
  if (
    !/[A-Z]/.test(newPassword) ||
    !/[a-z]/.test(newPassword) ||
    !/\d/.test(newPassword)
  ) {
    Swal.fire({
      icon: "warning",
      title: "Lỗi",
      text: "Mật khẩu mới phải chứa chữ hoa, chữ thường và số.",
    });
    newPassInput.focus();
    return;
  }

  // Validate confirm password matches
  if (newPassword !== confirmPassword) {
    Swal.fire({
      icon: "warning",
      title: "Lỗi",
      text: "Mật khẩu mới và xác nhận mật khẩu không khớp.",
    });
    repeatPassInput.focus();
    return;
  }

  const success = await changePassword(currentPassword, newPassword);
  if (success) {
    Swal.fire({
      icon: "success",
      title: "Thành công",
      text: "Đã thay đổi mật khẩu.",
    });
    currentPassInput.value = "";
    newPassInput.value = "";
    repeatPassInput.value = "";
    if (typeof resetChangePasswordBtnState === "function") {
      resetChangePasswordBtnState();
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Thất bại",
      text: "Sai mật khẩu hiện tại hoặc lỗi hệ thống.",
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const res = await populateUserProfile();
  if (!res) {
    console.warn("No user profile available.");
    localStorage.removeItem("token");
    window.location.href = "../auth.html";
    return;
  }
  resetSaveBtnState = setupSaveButtonState();
  resetChangePasswordBtnState = setupChangePasswordButtonState();
  const tabs = document.querySelectorAll(".tab-item");
  const panes = document.querySelectorAll(".tab-pane");

  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();

      const targetId = tab.getAttribute("data-target");
      const targetPane = document.getElementById(targetId);

      tabs.forEach((t) => t.classList.remove("is-active"));
      panes.forEach((p) => p.classList.remove("is-active"));

      tab.classList.add("is-active");
      if (targetPane) {
        targetPane.classList.add("is-active");
        if (targetId === "history") {
          handleAppointmentHistory();
        }
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab-item");
  const footer = document.getElementById("content-footer");
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const target = tab.getAttribute("data-target");
      if (target === "info") {
        footer.style.display = "";
      } else {
        footer.style.display = "none";
      }
    });
  });
});

function handleLogout() {
  localStorage.removeItem("token");
  window.location.href = "../auth.html";
}

async function handleSaveButtonClick() {
  const fullnameInput = document.getElementById("fullname");
  const phoneInput = document.getElementById("phone");

  const phoneValue = phoneInput.value.trim();
  if (phoneValue && !/^\d{10}$/.test(phoneValue)) {
    Swal.fire({
      icon: "warning",
      title: "Lỗi",
      text: "Số điện thoại phải gồm đúng 10 chữ số và không có chữ cái",
    });
    phoneInput.focus();
    return;
  }

  const updatedData = {};
  if (fullnameInput.value !== userProfile.username) {
    updatedData.username = fullnameInput.value;
  }
  if (phoneInput.value !== userProfile.phone) {
    updatedData.phone = phoneInput.value;
  }

  if (Object.keys(updatedData).length === 0) {
    return;
  }

  const success = await updateUserProfile(updatedData);
  if (success) {
    if (updatedData.username) userProfile.username = updatedData.username;
    if (updatedData.phone) userProfile.phone = updatedData.phone;
    if (typeof resetSaveBtnState === "function") resetSaveBtnState();
    Swal.fire({
      icon: "success",
      title: "Cập nhật hồ sơ thành công!",
    }).then(() => {
      window.location.reload();
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Cập nhật hồ sơ thất bại.",
      text: "Đã xảy ra lỗi khi cập nhật hồ sơ của bạn.",
    });
  }
}

async function updateUserProfile(updatedData) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage.");
    return false;
  }
  try {
    const res = await fetch("http://localhost:3000/api/users/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(updatedData),
    });
    const data = await res.json();
    if (res.ok) {
      return true;
    } else {
      console.error("Failed to update user profile:", data.message);
      return false;
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    return false;
  }
}

function updateHistoryPagination(totalPages, currentPage, hasNext, hasPrev) {
  const pageInfo = document.getElementById("page-info");
  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");

  pageInfo.textContent = `Trang ${currentPage ? currentPage : 1} / ${
    totalPages ? totalPages : 1
  }`;
  prevBtn.disabled = !hasPrev;
  nextBtn.disabled = !hasNext;
}

function createHistoryItem(
  service = "Dịch vụ không xác định",
  date = "00/00/0000",
  time = "00-00",
  status = "pending",
  barber = "Chưa xác định",
  branch = "Chưa xác định",
  appointmentId = null
) {
  const statusMessage = {
    completed: "Hoàn Thành",
    pending: "Đang Duyệt",
    confirmed: "Đã Duyệt",
    canceled: "Đã Hủy",
  };
  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateStr).toLocaleDateString("vi-VN", options);
  };
  date = formatDate(date);
  let cancelBtnHtml = "";
  if (status === "pending" && appointmentId) {
    cancelBtnHtml = `<button class="btn-cancel" data-id="${appointmentId}">Hủy lịch</button>`;
  }
  const html = `
              <div class="history-item">
                <div class="history-info">
                  <div class="history-service">${service}</div>
                  <div class="history-date">${date} - ${time}</div>
                  <div class="history-status ${status}">${
    statusMessage[status] || "Trạng thái không xác định"
  }</div>
                </div>
                <div class="history-barber">Thợ: ${barber}</div>
                <div class="history-branch">Chi nhánh: ${branch}</div>
                ${
                  cancelBtnHtml
                    ? `<div class='cancel-btn-wrapper'>${cancelBtnHtml}</div>`
                    : ""
                }
              </div>`;
  return html;
}

async function handleAppointmentHistory(page = 1, limit = 5) {
  const historyData = await loadAppointmentHistory(page, limit);
  const historyContainer = document.getElementById("history-list");
  if (!historyData || historyData.appointments.length === 0) {
    if (historyContainer) {
      historyContainer.innerHTML =
        '<p style="text-align: center; opacity: 0.5">Chưa có lịch sử đặt lịch nào.</p>';
    } else {
      console.error("History container not found.");
    }
  } else if (historyData && historyContainer) {
    historyContainer.innerHTML = "";
    historyData.appointments.forEach((item) => {
      const historyItem = createHistoryItem(
        item.serviceId.name,
        item.date,
        item.time,
        item.status,
        item.stylistId.userId.username,
        item.branchId.name,
        item._id
      );
      historyContainer.innerHTML += historyItem;
    });
    // Add cancel button handler
    historyContainer.querySelectorAll(".btn-cancel").forEach((btn) => {
      btn.addEventListener("click", async function () {
        const appointmentId = btn.getAttribute("data-id");
        if (!appointmentId) return;
        const confirmResult = await Swal.fire({
          icon: "warning",
          title: "Xác nhận hủy lịch?",
          text: "Bạn có chắc muốn hủy lịch này? Hành động này không thể hoàn tác.",
          showCancelButton: true,
          confirmButtonText: "Hủy lịch",
          cancelButtonText: "Đóng",
          confirmButtonColor: "#d32f2f",
          cancelButtonColor: "#888",
        });
        if (!confirmResult.isConfirmed) return;
        const token = localStorage.getItem("token");
        try {
          const res = await fetch(
            `http://localhost:3000/api/appointments/${appointmentId}/cancel`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
            }
          );
          const data = await res.json();
          if (res.ok) {
            Swal.fire({
              icon: "success",
              title: "Đã hủy lịch thành công!",
            });
            handleAppointmentHistory();
          } else {
            Swal.fire({
              icon: "error",
              title: "Hủy lịch thất bại",
              text: data.message || "Đã xảy ra lỗi khi hủy lịch.",
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Hủy lịch thất bại",
            text: "Đã xảy ra lỗi khi hủy lịch.",
          });
        }
      });
    });
  }

  updateHistoryPagination(
    historyData.pagination.totalPages,
    historyData.pagination.currentPage,
    historyData.pagination.hasNext,
    historyData.pagination.hasPrev
  );
}

async function loadAppointmentHistory(page = 1, limit = 5) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage.");
    return null;
  }
  try {
    const res = await fetch(
      `http://localhost:3000/api/appointments/me?status=all&limit=${limit}&page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      return data.data;
    } else {
      console.error("Failed to load appointment history:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error loading appointment history:", error);
    return null;
  }
}

document.querySelectorAll(".toggle-password").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const targetId = btn.getAttribute("data-target");
    const input = document.getElementById(targetId);
    const img = btn.querySelector("img");
    if (input) {
      if (input.type === "password") {
        input.type = "text";
        img.src = "../assets/profile/eye-slash.svg";
        img.alt = "Ẩn mật khẩu";
      } else {
        input.type = "password";
        img.src = "../assets/profile/eye.svg";
        img.alt = "Hiện mật khẩu";
      }
    }
  });
});

document
  .getElementById("change-password-button")
  .addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelectorAll(".tab-item").forEach(function (tab) {
      tab.classList.remove("is-active");
      if (tab.getAttribute("data-target") === "change-password") {
        tab.classList.add("is-active");
      }
    });
    document.querySelectorAll(".tab-pane").forEach(function (pane) {
      pane.classList.remove("is-active");
      if (pane.id === "change-password") {
        pane.classList.add("is-active");
      }
    });
    var saveBtn = document.getElementById("save-button");
    if (saveBtn) {
      saveBtn.style.display = "none";
    }
  });

document.querySelectorAll(".tab-item").forEach(function (tab) {
  tab.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelectorAll(".tab-item").forEach(function (t) {
      t.classList.remove("is-active");
    });
    tab.classList.add("is-active");
    document.querySelectorAll(".tab-pane").forEach(function (pane) {
      pane.classList.remove("is-active");
      if (pane.id === tab.getAttribute("data-target")) {
        pane.classList.add("is-active");
      }
    });
    var saveBtn = document.getElementById("save-button");
    if (saveBtn) {
      if (tab.getAttribute("data-target") === "change-password") {
        saveBtn.style.display = "none";
      } else {
        saveBtn.style.display = "";
      }
    }
  });
});

function addDashboardTab() {
  if (document.querySelector('.tab-item[data-target="dashboard"]')) return;
  const nav = document.querySelector(".content-tabs");
  if (!nav) return;
  const dashboardTab = document.createElement("a");
  dashboardTab.href = "../dashboard";
  dashboardTab.className = "tab-item";
  dashboardTab.setAttribute("data-target", "dashboard");
  dashboardTab.textContent = "Trang Quản Lý";
  nav.appendChild(dashboardTab);
  dashboardTab.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "../dashboard";
  });
}
