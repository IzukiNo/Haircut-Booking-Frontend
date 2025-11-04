function setActiveFilter(btn) {
  const pageInfo = document.getElementById("page-info");
  const page = pageInfo.getAttribute("page") || 1;

  if (btn.classList.contains("is-active")) return;
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("is-active"));
  btn.classList.add("is-active");

  populateAppointmentsTable(page, 6, btn.getAttribute("data-filter"));
}

// + New Appointment Handler

function initAddAppointmentModal() {
  const addBtn = document.querySelector(".btn-add-new");
  const modal = document.getElementById("add-appointment-modal");
  const cancelBtn = document.getElementById("cancel-add-appointment");

  if (addBtn && modal && cancelBtn) {
    addBtn.addEventListener("click", function () {
      modal.style.display = "flex";
    });
    cancelBtn.addEventListener("click", function () {
      modal.style.display = "none";
    });
    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.style.display = "none";
    });
  } else {
    return Swal.fire({
      icon: "error",
      title: "Initialization Error",
      text: "Some required elements for adding appointments are missing from the page.",
    });
  }
}

function generateTimeOptions(start = "09:00", end = "18:00", step = 30) {
  const select = document.getElementById("time");
  select.innerHTML = "";
  let [h, m] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  while (h < endH || (h === endH && m <= endM)) {
    const timeStr = `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}`;
    const option = document.createElement("option");
    option.value = timeStr;
    option.textContent = timeStr;
    select.appendChild(option);
    m += step;
    if (m >= 60) {
      h++;
      m -= 60;
    }
  }
}

async function getServiceList() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage.");
    return null;
  }
  try {
    const res = await fetch("api/services", {
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
      console.error("Failed to fetch service list:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching service list:", error);
    return null;
  }
}

async function getBranchList() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage.");
    return null;
  }
  try {
    const res = await fetch("api/branches", {
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
      console.error("Failed to fetch service list:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching service list:", error);
    return null;
  }
}

async function getStylistListByBranch(branchId) {
  const token = localStorage.getItem("token");
  if (!branchId) return [];
  if (!token) {
    console.warn("No token found in localStorage.");
    return null;
  }
  try {
    const res = await fetch(`api/stylists?branchId=${branchId}`, {
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
      console.error("Failed to fetch stylist list:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching stylist list:", error);
    return null;
  }
}

function populateSelectOptions(selectId, options, placeholderText) {
  const select = document.getElementById(selectId);
  if (!select) return;
  select.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.hidden = true;
  placeholder.textContent = placeholderText;
  select.appendChild(placeholder);
  options.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.label;
    select.appendChild(option);
  });
}

async function populateStylistOptions(branchId) {
  const data = await getStylistListByBranch(branchId);
  let stylistOptions = [];
  data.forEach((stylist) => {
    stylistOptions.push({
      value: stylist.userId._id,
      label: stylist.userId.username,
    });
  });
  populateSelectOptions(
    "barber",
    stylistOptions,
    stylistOptions.length ? "Chọn Thợ" : "Chưa Có Thợ"
  );
}

async function populateBranchOptions() {
  const data = await getBranchList();
  let branchOptions = [];
  data.forEach((branch) => {
    branchOptions.push({ value: branch._id, label: branch.name });
  });
  populateSelectOptions("branch", branchOptions, "Chọn Chi Nhánh");
}

async function populateServiceOptions() {
  const data = await getServiceList();
  let serviceOptions = [];
  data.forEach((service) => {
    serviceOptions.push({ value: service._id, label: service.name });
  });
  populateSelectOptions("service", serviceOptions, "Chọn Dịch Vụ");
}

function handleApproveButton(appointmentId) {
  if (!appointmentId) return;
  const token = localStorage.getItem("token");
  Swal.fire({
    icon: "question",
    title: "Xác nhận duyệt lịch?",
    text: "Bạn có chắc muốn duyệt lịch hẹn này?",
    showCancelButton: true,
    confirmButtonText: "Duyệt lịch",
    cancelButtonText: "Đóng",
    confirmButtonColor: "#34d399",
    cancelButtonColor: "#888",
  }).then(async (result) => {
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`api/appointments/${appointmentId}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Đã duyệt lịch thành công!",
        });
        const pageInfo = document.getElementById("page-info");
        const page = pageInfo ? pageInfo.getAttribute("page") || 1 : 1;
        populateAppointmentsTable(page, 6, "all");
      } else {
        Swal.fire({
          icon: "error",
          title: "Duyệt lịch thất bại",
          text: data.message || "Đã xảy ra lỗi khi duyệt lịch.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Duyệt lịch thất bại",
        text: "Đã xảy ra lỗi khi duyệt lịch.",
      });
    }
  });
}

function handleDeleteButton(appointmentId) {
  if (!appointmentId) return;
  const token = localStorage.getItem("token");
  Swal.fire({
    icon: "warning",
    title: "Xác nhận xóa lịch hẹn?",
    text: "Bạn có chắc muốn xóa lịch hẹn này? Hành động này không thể hoàn tác.",
    showCancelButton: true,
    confirmButtonText: "Xóa lịch",
    cancelButtonText: "Đóng",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#888",
  }).then(async (result) => {
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`api/appointments/${appointmentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Đã xóa lịch thành công!",
        });
        const pageInfo = document.getElementById("page-info");
        const page = pageInfo ? pageInfo.getAttribute("page") || 1 : 1;
        populateAppointmentsTable(page, 6, "all");
      } else {
        Swal.fire({
          icon: "error",
          title: "Xóa lịch thất bại",
          text: data.message || "Đã xảy ra lỗi khi xóa lịch.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Xóa lịch thất bại",
        text: "Đã xảy ra lỗi khi xóa lịch.",
      });
    }
  });
}

function handlePaymentButton(appointmentId) {
  if (![1, 4].includes(userProfile?.role))
    return Swal.fire({
      icon: "error",
      title: "Không có quyền thanh toán",
      text: "Chỉ nhân viên thu ngân hoặc quản trị viên mới được thực hiện thanh toán.",
    });
  const modal = document.getElementById("payment-method-modal");
  if (!modal) return;
  modal.style.display = "flex";
  modal.setAttribute("data-appointment-id", appointmentId);

  const cancelBtn = document.getElementById("cancel-payment-method");
  if (cancelBtn) {
    cancelBtn.onclick = function () {
      modal.style.display = "none";
      modal.removeAttribute("data-appointment-id");
    };
  }

  const form = document.getElementById("payment-method-form");
  if (form) {
    form.onsubmit = function (e) {
      e.preventDefault();

      const method = document.getElementById("payment-method").value;
      const cashierId = userProfile ? userProfile.id : null;
      const appointmentId = modal.getAttribute("data-appointment-id");
      if (!appointmentId || !cashierId || !method) return;

      modal.style.display = "none";
      modal.removeAttribute("data-appointment-id");

      const url = `../payment?id=${appointmentId}&cashier=${cashierId}&type=${method}`;
      const width = 750;
      const height = 600;
      const left = (screen.width - width) / 2;
      const top = (screen.height - height) / 2;

      const paymentWindow = window.open(
        url,
        "PaymentWindow",
        `width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=yes,status=no`
      );

      const checkPopup = setInterval(() => {
        if (paymentWindow.closed) {
          clearInterval(checkPopup);
          console.log("Payment window closed — reloading parent page...");
          window.location.reload();
        }
      }, 1000);

      window.addEventListener("message", (event) => {
        if (event.data?.action === "paymentSuccess") {
          console.log("Payment completed via postMessage — reloading page...");
          clearInterval(checkPopup);
          paymentWindow.close();
          window.location.reload();
        }
      });
    };
  }
}

function handleCompleteButton(appointmentId) {
  if (!appointmentId) return;
  const token = localStorage.getItem("token");
  Swal.fire({
    icon: "question",
    title: "Xác nhận hoàn thành",
    text: "Bạn có chắc muốn đánh dấu lịch này là đã hoàn thành?",
    showCancelButton: true,
    confirmButtonText: "Hoàn thành",
    cancelButtonText: "Hủy",
    confirmButtonColor: "#3b82f6",
    cancelButtonColor: "#888",
  }).then(async (result) => {
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`api/appointments/${appointmentId}/complete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Lịch đã được đánh dấu hoàn thành!",
        });
        // Reload appointments table
        const pageInfo = document.getElementById("page-info");
        const page = pageInfo ? pageInfo.getAttribute("page") || 1 : 1;
        populateAppointmentsTable(page, 6, "all");
      } else {
        Swal.fire({
          icon: "error",
          title: "Hoàn thành lịch thất bại",
          text: data.message || "Đã xảy ra lỗi khi hoàn thành lịch.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Hoàn thành lịch thất bại",
        text: "Đã xảy ra lỗi khi hoàn thành lịch.",
      });
    }
  });
}

async function handleAddServiceButton(appointmentId, currentServiceIds = []) {
  // Hiển thị popup
  const modal = document.getElementById("add-service-modal");
  if (!modal) return;
  modal.style.display = "flex";
  modal.setAttribute("data-appointment-id", appointmentId);

  // Lấy danh sách dịch vụ từ API
  const allServices = await getServiceList();
  const listDiv = document.getElementById("service-checkbox-list");
  if (!listDiv) return;
  listDiv.innerHTML = "";

  // Render checkbox, check những dịch vụ hiện tại
  allServices.forEach((service) => {
    const wrapper = document.createElement("div");
    wrapper.className = "service-checkbox-item";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = service._id;
    checkbox.id = `service-check-${service._id}`;
    checkbox.checked = currentServiceIds.some((s) => s._id === service._id);
    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.textContent = service.name;
    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    listDiv.appendChild(wrapper);
  });

  // Nút lưu chỉ hiện khi có thay đổi
  const saveBtn = document.getElementById("save-service-btn");
  saveBtn.style.display = "none";
  let initialChecked = currentServiceIds.slice();

  listDiv.onchange = function () {
    const checked = Array.from(
      listDiv.querySelectorAll("input[type=checkbox]:checked")
    ).map((c) => c.value);
    const changed =
      checked.length !== initialChecked.length ||
      checked.some((id) => !initialChecked.includes(id)) ||
      initialChecked.some((id) => !checked.includes(id));
    saveBtn.style.display = changed ? "inline-block" : "none";
  };

  // Đóng popup khi click ra ngoài
  modal.onclick = function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
      modal.removeAttribute("data-appointment-id");
      listDiv.innerHTML = "";
      saveBtn.style.display = "none";
    }
  };

  // Xử lý lưu thay đổi
  saveBtn.onclick = async function () {
    const checked = Array.from(
      listDiv.querySelectorAll("input[type=checkbox]:checked")
    ).map((c) => c.value);
    // Gọi API cập nhật dịch vụ cho lịch hẹn
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`api/appointments/${appointmentId}/services`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ serviceId: checked }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Cập nhật dịch vụ thành công!" });
        modal.style.display = "none";
        modal.removeAttribute("data-appointment-id");
        listDiv.innerHTML = "";
        saveBtn.style.display = "none";
        // Reload bảng lịch hẹn
        const pageInfo = document.getElementById("page-info");
        const page = pageInfo ? pageInfo.getAttribute("page") || 1 : 1;
        populateAppointmentsTable(page, 6, "all");
      } else {
        modal.style.display = "none";
        modal.removeAttribute("data-appointment-id");
        listDiv.innerHTML = "";
        saveBtn.style.display = "none";
        Swal.fire({
          icon: "error",
          title: "Cập nhật thất bại",
          text: data.message || "Đã xảy ra lỗi.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Cập nhật thất bại",
        text: "Đã xảy ra lỗi.",
      });
    }
  };
}

function handleAddAppointmentSubmit(e) {
  e.preventDefault();
  const form = document.getElementById("add-appointment-form");
  if (!form) return;
  const customer = form.customer.value.trim();
  const branch = form.branch.value;
  const barber = form.barber.value;
  const service = form.service.value;
  const date = form.date.value;
  const time = form.time.value;
  const note = form.note.value.trim();

  if (!customer || !branch || !barber || !service || !date || !time) {
    Swal.fire({ icon: "error", title: "Vui lòng nhập đầy đủ thông tin!" });
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    Swal.fire({ icon: "error", title: "Bạn chưa đăng nhập!" });
    return;
  }

  // Gửi dữ liệu lên backend
  fetch("api/appointments/force", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      email: customer,
      branchId: branch,
      stylistId: barber,
      serviceId: [service],
      date: date,
      time: time,
      note: note,
    }),
  })
    .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
    .then((result) => {
      if (result.ok) {
        Swal.fire({ icon: "success", title: "Đã thêm lịch thành công!" });
        document.getElementById("add-appointment-modal").style.display = "none";
        form.reset();
        // Reload bảng lịch hẹn
        const pageInfo = document.getElementById("page-info");
        const page = pageInfo ? pageInfo.getAttribute("page") || 1 : 1;
        populateAppointmentsTable(page, 6, "all");
      } else {
        document.getElementById("add-appointment-modal").style.display = "none";
        form.reset();
        Swal.fire({
          icon: "error",
          title: "Thêm lịch thất bại",
          text: result.data.message || "Đã xảy ra lỗi.",
        });
      }
    })
    .catch(() => {
      Swal.fire({
        icon: "error",
        title: "Thêm lịch thất bại",
        text: "Đã xảy ra lỗi.",
      });
    });
}

document.addEventListener("DOMContentLoaded", async () => {
  if (document.getElementById("add-appointment")) {
    populateSelectOptions("barber", [], "Chọn chi nhánh trước");
    await populateServiceOptions();
    await populateBranchOptions();
    initAddAppointmentModal();
    generateTimeOptions();

    document
      .getElementById("branch")
      .addEventListener("change", async function (e) {
        const branchId = e.target.value;
        await populateStylistOptions(branchId);
      });

    const addAppointmentForm = document.getElementById("add-appointment-form");
    if (addAppointmentForm) {
      addAppointmentForm.onsubmit = handleAddAppointmentSubmit;
    }
  }

  document.body.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-approve")) {
      e.preventDefault();
      const tr = e.target.closest("tr[data-id]");
      if (tr) {
        const appointmentId = tr.getAttribute("data-id");
        handleApproveButton(appointmentId);
      }
    }
    if (e.target.classList.contains("btn-delete")) {
      e.preventDefault();
      const tr = e.target.closest("tr[data-id]");
      if (tr) {
        const appointmentId = tr.getAttribute("data-id");
        handleDeleteButton(appointmentId);
      }
    }
    if (e.target.classList.contains("btn-complete")) {
      e.preventDefault();
      const tr = e.target.closest("tr[data-id]");
      if (tr) {
        const appointmentId = tr.getAttribute("data-id");
        handleCompleteButton(appointmentId);
      }
    }
    if (e.target.classList.contains("btn-payment")) {
      e.preventDefault();
      const tr = e.target.closest("tr[data-id]");
      if (tr) {
        const appointmentId = tr.getAttribute("data-id");
        handlePaymentButton(appointmentId);
      }
    }
    if (e.target.classList.contains("btn-add-service")) {
      e.preventDefault();
      const tr = e.target.closest("tr[data-id]");
      if (tr) {
        const appointmentId = tr.getAttribute("data-id");
        handleAddServiceButton(
          appointmentId,
          cacheAppointment[appointmentId].serviceId || []
        );
      }
    }
  });

  if (userProfile && userProfile.role) {
    let filterBtn = null;
    switch (userProfile.role) {
      case 1:
        filterBtn = document.querySelector(
          ".filter-btn[data-filter='pending']"
        );
        break;
      case 2:
        filterBtn = document.querySelector(
          ".filter-btn[data-filter='confirmed']"
        );
        break;
      default:
        filterBtn = document.querySelector(".filter-btn[data-filter='all']");
        break;
    }
    if (filterBtn) setActiveFilter(filterBtn);
  }
});
