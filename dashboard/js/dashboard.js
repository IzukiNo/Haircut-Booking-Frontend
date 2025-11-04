let currentPage = 1;
let totalPages = 1;

let appointmentFilterStatus = "all";

let userProfile = {};

let cacheServices = {};
let cacheEmployees = {};
let cacheBranches = {};
let cacheAppointment = {};

// Sidebar permission map: perm[index] = obj
// index: 1 = cashier, 2 = stylist, 3 = staff, 4 = admin
const perm = new Map();

perm.set(1, {
  nav: [
    { href: "./", icon: "home.svg", text: "Tổng quan" },
    {
      href: "dashboard-appointments.html",
      icon: "calendar.svg",
      text: "Lịch hẹn",
    },
  ],
});
perm.set(2, {
  nav: [
    {
      href: "dashboard-appointments.html",
      icon: "calendar.svg",
      text: "Lịch hẹn",
    },
  ],
});
perm.set(3, {
  nav: [
    { href: "./", icon: "home.svg", text: "Tổng quan" },
    {
      href: "dashboard-appointments.html",
      icon: "calendar.svg",
      text: "Lịch hẹn",
    },
  ],
});
perm.set(4, {
  nav: [
    { href: "./", icon: "home.svg", text: "Tổng quan" },
    { href: "dashboard-users.html", icon: "user.svg", text: "Nhân Viên" },
    {
      href: "dashboard-appointments.html",
      icon: "calendar.svg",
      text: "Lịch hẹn",
    },
    { href: "dashboard-services.html", icon: "scissors.svg", text: "Dịch vụ" },
    { href: "dashboard-settings.html", icon: "settings.svg", text: "Cài đặt" },
  ],
});

async function getBranchList() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage.");
    return null;
  }
  try {
    const res = await fetch("http://localhost:3000/api/branches", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = await res.json();
    if (res.ok) {
      const branchMap = {};
      const branches = data.data;
      if (data.data && Array.isArray(data.data)) {
        branches.forEach((branch) => {
          branchMap[branch._id] = branch;
        });
      }
      cacheBranches = branchMap;
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
      if (data.data.role === 0) {
        window.location.href = "/";
        return null;
      }
      document.querySelector(".dashboard-sidebar").outerHTML =
        renderSidebarByRole(data.data.role);
      userProfile = data.data;
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

async function getServiceList(page = 1, limit = 10) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage.");
    return null;
  }
  try {
    const res = await fetch(
      `http://localhost:3000/api/services?page=${page}&limit=${limit}`,
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
      cacheServices = {};
      data.data.forEach((service) => {
        cacheServices[service._id] = service;
      });
      return data;
    } else {
      console.error("Failed to fetch service list:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching service list:", error);
    return null;
  }
}

async function getEmployeesList(page = 1, limit = 10) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage.");
    return null;
  }
  try {
    const res = await fetch(
      `http://localhost:3000/api/employees?page=${page}&limit=${limit}`,
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
      cacheEmployees = {};
      data.data.forEach((employee) => {
        cacheEmployees[employee.id] = employee;
      });
      return data;
    } else {
      console.error("Failed to fetch employee list:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching employee list:", error);
    return null;
  }
}

async function getAppointmentsList(page = 1, limit = 10, status = "all") {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage.");
    return null;
  }
  try {
    const res = await fetch(
      `http://localhost:3000/api/appointments?status=${status}&limit=${limit}&page=${page}`,
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
      cacheAppointment = {};
      data.data.appointments.forEach((appointment) => {
        cacheAppointment[appointment._id] = appointment;
      });
      return data.data;
    } else {
      console.error("Failed to get appointments list:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error loading appointments list:", error);
    return null;
  }
}

function renderAppointmentsTable(data) {
  if (!data || !data.length) {
    return '<tr><td colspan="8"><div style="text-align:center;padding:32px 0;color:#9ca3af;font-size:18px;font-weight:500;">Không có lịch hẹn</div></td></tr>';
  }
  return data
    .map(
      (item) => `
          <tr data-id="${item.id}">
            <td>${item.customer}</td>
            <td>${item.stylist}</td>
            <td>${item.service}</td>
            <td>${item.time}</td>
            <td>${item.branch}</td>
            <td>${item.createdAt}</td>
            <td>
              <span class="status status--${item.statusClass}">${
        item.statusText
      }</span>
            </td>
            <td>
              <div class="table-actions">
                              ${
                                item.statusClass === "pending"
                                  ? `
                                    <a class="btn-action btn-approve">Duyệt</a>
                                    <a class="btn-action btn-cancel">Hủy</a>
                                  `
                                  : ""
                              }
                              ${
                                item.statusClass === "confirmed"
                                  ? `
                                  <a class="btn-action btn-complete">Hoàn thành</a>
                                  <a class="btn-action btn-add-service">Thêm Dịch Vụ</a>
                                  `
                                  : ""
                              }
                              ${
                                item.statusClass === "completed" && !item.isPaid
                                  ? '<a class="btn-action btn-payment">Thanh Toán</a>'
                                  : ""
                              }
                <a class="btn-action btn-delete">Xóa</a>
              </div>
            </td>
          </tr>
        `
    )
    .join("");
}

function renderServicesTable(data) {
  return data
    .map(
      (item) => `
    <tr data-id="${item.id}">
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${item.desc}</td>
      <td class="status--${item.active ? "active" : "inactive"}">${
        item.active ? "Bật" : "Tắt"
      }</td>
      <td>
        <div class="table-actions">
          <a class="btn-action">Sửa</a>
          <a class="btn-action btn-delete">Xóa</a>
        </div>
      </td>
    </tr>
  `
    )
    .join("");
}

function renderUsersTable(data) {
  return data
    .map(
      (user) => `
    <tr data-id="${user.id}">
      <td>${user.name}</td>
      <td><span class="role-badge">${user.role}</span></td>
      <td>${user.branch}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td class="status--${user.active ? "active" : "inactive"}">${
        user.active ? "Hoạt động" : "Ngừng"
      }</td>
      <td>
        <div class="table-actions">
          <a href="#" class="btn-action">Sửa</a>
          <a href="#" class="btn-action btn-delete">Xóa</a>
        </div>
      </td>
    </tr>
  `
    )
    .join("");
}

async function populateUsersTable(page = 1, limit = 10) {
  const data = await getEmployeesList(page, limit);
  if (!data) {
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: "Không thể tải danh sách nhân viên.",
    });
    return;
  }
  let usersData = [];

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

  data.data.forEach((item) => {
    usersData.push({
      id: item.id,
      name: item.username,
      role: getRoleText(item.role),
      branch: item.branch.name ? item.branch.name : "Chưa cập nhật",
      phone: item.phone ? item.phone : "Chưa cập nhật",
      active: item.status,
      email: item.email ? item.email : "Chưa cập nhật",
    });
  });
  const tbody = document.querySelector(".data-table tbody");
  if (tbody) {
    tbody.innerHTML = renderUsersTable(usersData);
    updatePaginationState(
      data.pagination.currentPage,
      data.pagination.totalPages,
      data.pagination.hasNext,
      data.pagination.hasPrev
    );
    currentPage = data.pagination.currentPage;
    totalPages = data.pagination.totalPages;
  }
}

async function populateServicesTable(page = 1, limit = 10) {
  const data = await getServiceList(page, limit);
  if (!data) {
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: "Không thể tải danh sách dịch vụ.",
    });
    return;
  }
  let servicesData = [];

  function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }

  data.data.forEach((item) => {
    servicesData.push({
      id: item._id,
      name: item.name,
      desc:
        item.description.length > 50
          ? item.description.slice(0, 50) + "..."
          : item.description,
      price: formatPrice(item.price),
      active: item.status,
    });
  });
  const tbody = document.querySelector(".data-table tbody");
  if (tbody) {
    tbody.innerHTML = renderServicesTable(servicesData);
    updatePaginationState(
      data.pagination.currentPage,
      data.pagination.totalPages,
      data.pagination.hasNext,
      data.pagination.hasPrev
    );
    currentPage = data.pagination.currentPage;
    totalPages = data.pagination.totalPages;
  }
}

async function populateAppointmentsTable(page = 1, limit = 10, status = "all") {
  const data = await getAppointmentsList(page, limit, status);
  if (!data) {
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: "Không thể tải danh sách lịch hẹn.",
    });
    return;
  }
  let appointmentsData = [];

  function getStatusText(status) {
    switch (status) {
      case "pending":
        return "Chờ Duyệt";
      case "confirmed":
        return "Đã Xác Nhận";
      case "completed":
        return "Hoàn Thành";
      case "canceled":
        return "Đã Hủy";
      default:
        return "Không xác định";
    }
  }

  function getDateText(time, date) {
    const hour = parseInt(time.split(":")[0], 10);
    const ampm = hour < 12 ? "AM" : "PM";
    return `${time} ${ampm} ${new Date(date).toLocaleDateString("vi-VN")}`;
  }

  data.appointments.forEach((item) => {
    appointmentsData.push({
      isPaid: item.isPaid ? item.isPaid : false,
      id: item._id,
      stylist:
        item.stylistId && item.stylistId.userId
          ? item.stylistId.userId.username
          : "Chưa cập nhật",
      customer:
        item.customerId && item.customerId.username
          ? item.customerId.username
          : "Chưa cập nhật",
      service:
        item.serviceId && item.serviceId[0] && item.serviceId[0].name
          ? item.serviceId[0].name
          : "Chưa cập nhật",
      time:
        item.time && item.date
          ? getDateText(item.time, item.date)
          : "Chưa cập nhật",
      branch:
        item.branchId && item.branchId.name
          ? item.branchId.name
          : "Chưa cập nhật",
      createdAt: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("vi-VN")
        : "Chưa cập nhật",
      statusClass: item.status ? item.status : "unknown",
      statusText: item.status ? getStatusText(item.status) : "Không xác định",
    });
  });

  const tableBody = document.querySelector(".data-table tbody");
  if (tableBody) {
    tableBody.innerHTML = renderAppointmentsTable(appointmentsData);
    updatePaginationState(
      data.pagination.currentPage,
      data.pagination.totalPages,
      data.pagination.hasNext,
      data.pagination.hasPrev
    );
    currentPage = data.pagination.currentPage;
    totalPages = data.pagination.totalPages;
  }
}

function getDashboardType() {
  if (document.body.classList.contains("appointments-page"))
    return "appointments";
  if (document.body.classList.contains("users-page")) return "users";
  if (document.body.classList.contains("services-page")) return "services";
  if (document.body.classList.contains("settings-page")) return "settings";
  if (document.body.classList.contains("dashboard-page")) return "dashboard";
  return null;
}

function updatePaginationState(currentPage, totalPages, hasNext, hasPrev) {
  const prevBtn =
    document.getElementById("appointments-prev") ||
    document.getElementById("users-prev") ||
    document.getElementById("services-prev") ||
    document.getElementById("settings-prev");
  const nextBtn =
    document.getElementById("appointments-next") ||
    document.getElementById("users-next") ||
    document.getElementById("services-next") ||
    document.getElementById("settings-next");

  if (prevBtn) prevBtn.disabled = !hasPrev;
  if (nextBtn) nextBtn.disabled = !hasNext;
  const pageInfo = document.getElementById("page-info");

  if (pageInfo) {
    pageInfo.setAttribute("page", currentPage);
  }

  if (pageInfo) {
    pageInfo.textContent = `Trang ${currentPage ? currentPage : 1} / ${
      totalPages ? totalPages : 1
    }`;
  }
}

function handlePrev() {
  if (currentPage <= 1) return;
  switch (getDashboardType()) {
    case "appointments":
      populateAppointmentsTable(currentPage - 1, 6, appointmentFilterStatus);
      break;
    case "users":
      populateUsersTable(currentPage - 1, 6);
      break;
    case "services":
      populateServicesTable(currentPage - 1, 6);
      break;
    case "settings":
      // soon
      break;
    default:
      break;
  }
}

function handleNext() {
  if (currentPage >= totalPages) return;
  switch (getDashboardType()) {
    case "appointments":
      populateAppointmentsTable(currentPage + 1, 6, appointmentFilterStatus);
      break;
    case "users":
      populateUsersTable(currentPage + 1, 6);
      break;
    case "services":
      populateServicesTable(currentPage + 1, 6);
      break;
    default:
      break;
  }
}

function renderSidebarByRole(index) {
  const obj = perm.get(index) || perm.get(1);
  const path = window.location.pathname.split("/").pop();
  let html = `<aside class="dashboard-sidebar">
    <div class="sidebar-header">
      <a href="../" class="logo">BARBERSHOP</a>
    </div>
    <ul>`;
  obj.nav.forEach((item) => {
    const isActive =
      item.href === path ||
      (item.href === "./" && (path === "" || path === "index.html"));
    html += `<li>
      <a ${isActive ? "" : `href=\"${item.href}\"`} class="nav-item${
      isActive ? " is-active" : ""
    }">
        <span class="nav-icon">
          <img src="../assets/dashboard/${item.icon}" alt="${
      item.text
    }" width="20" height="20" />
        </span>
        <span class="nav-text">${item.text}</span>
      </a>
    </li>`;
  });
  html += `</ul></aside>`;
  return html;
}

document.addEventListener("DOMContentLoaded", function () {
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const dashboardLayout = document.querySelector(".dashboard-layout");
  if (dashboardLayout && localStorage.getItem("sidebarCollapsed") === "true") {
    dashboardLayout.classList.add("sidebar-collapsed");
  }
  if (sidebarToggle && dashboardLayout) {
    sidebarToggle.addEventListener("click", function () {
      dashboardLayout.classList.toggle("sidebar-collapsed");
      localStorage.setItem(
        "sidebarCollapsed",
        dashboardLayout.classList.contains("sidebar-collapsed")
          ? "true"
          : "false"
      );
    });
  }
  const prevBtn =
    document.getElementById("appointments-prev") ||
    document.getElementById("users-prev") ||
    document.getElementById("services-prev") ||
    document.getElementById("settings-prev");
  const nextBtn =
    document.getElementById("appointments-next") ||
    document.getElementById("users-next") ||
    document.getElementById("services-next") ||
    document.getElementById("settings-next");
  if (prevBtn) prevBtn.onclick = handlePrev;
  if (nextBtn) nextBtn.onclick = handleNext;
});

document.addEventListener("DOMContentLoaded", () => {
  const userProfile = getUserProfile();
  if (!userProfile) {
    window.location.href = "/";
  }
  const page = getDashboardType();
  switch (page) {
    case "appointments":
      populateAppointmentsTable(1, 6, "all");
      break;
    case "services":
      populateServicesTable(1, 6);
      break;
    case "users":
      populateUsersTable(1, 6);
      break;
    case "dashboard":
      populateAppointmentsTable(1, 3, "all");
      break;
  }
});
