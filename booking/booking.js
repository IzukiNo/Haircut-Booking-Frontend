let userProfile = null;

async function getUserProfile() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage.");
    return null;
  }

  try {
    const res = await fetch("https://api.izukino.tech/api/auth/me", {
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

async function getServiceList() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage.");
    return null;
  }
  try {
    const res = await fetch("https://api.izukino.tech/api/services", {
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
    const res = await fetch("https://api.izukino.tech/api/branches", {
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
  if (!token) {
    console.warn("No token found in localStorage.");
    return null;
  }
  try {
    const res = await fetch(
      `https://api.izukino.tech/api/stylists?branchId=${branchId}`,
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
      console.error("Failed to fetch stylist list:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching stylist list:", error);
    return null;
  }
}

async function bookingAppointment(appointmentData) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage.");
    return null;
  }

  try {
    const res = await fetch("https://api.izukino.tech/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(appointmentData),
    });
    const data = await res.json();
    if (res.ok) {
      return data.data;
    } else {
      console.error("Failed to book appointment:", data.message);
      Swal.fire({
        icon: "error",
        title: "Lỗi Đặt Lịch",
        text: data.message,
      });
      return null;
    }
  } catch (error) {
    console.error("Error booking appointment:", error);
    return null;
  }
}

async function populateUserProfile() {
  userProfile = await getUserProfile();
  const nameElem = document.getElementById("username");
  if (userProfile) {
    if (nameElem) nameElem.textContent = userProfile.username || "-";
    return true;
  }
  return false;
}

function handleLogout() {
  localStorage.removeItem("token");
  window.location.href = "../auth.html";
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

async function populateServiceOptions() {
  const data = await getServiceList();
  let serviceOptions = [];
  data.forEach((service) => {
    serviceOptions.push({ value: service._id, label: service.name });
  });
  populateSelectOptions("service", serviceOptions, "Chọn Dịch Vụ");
}

async function populateBranchOptions() {
  const data = await getBranchList();
  let branchOptions = [];
  data.forEach((branch) => {
    branchOptions.push({ value: branch._id, label: branch.name });
  });
  populateSelectOptions("branch", branchOptions, "Chọn Chi Nhánh");
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

document
  .getElementById("branch")
  .addEventListener("change", async function (e) {
    const branchId = e.target.value;
    await populateStylistOptions(branchId);
  });

document.addEventListener("DOMContentLoaded", async function () {
  const res = await populateUserProfile();
  if (!res) {
    window.location.href = "../auth.html";
    return;
  }

  populateSelectOptions("barber", [], "Chọn chi nhánh trước");
  await populateServiceOptions();
  await populateBranchOptions();
});

document
  .querySelector(".booking-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    handleSubmitAppointment();
  });

async function handleSubmitAppointment() {
  const data = {
    stylistId: document.getElementById("barber").value,
    serviceId: document.getElementById("service").value,
    branchId: document.getElementById("branch").value,
    note: document.getElementById("note").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
  };

  if (
    !data.stylistId ||
    !data.serviceId ||
    !data.branchId ||
    !data.date ||
    !data.time
  ) {
    Swal.fire({
      icon: "error",
      title: "Lỗi Đặt Lịch",
      text: "Vui lòng điền đầy đủ thông tin.",
    });
    return;
  }

  const now = new Date();
  const appointmentDateTime = new Date(`${data.date}T${data.time}`);
  if (appointmentDateTime < now || data.time < "09:00" || data.time > "18:00") {
    Swal.fire({
      icon: "error",
      title: "Lỗi Đặt Lịch",
      text: "Thời gian hẹn không hợp lệ.",
    });
    return;
  }

  const result = await bookingAppointment(data);
  if (result) {
    Swal.fire({
      icon: "success",
      title: "Đặt Lịch Thành Công",
      text: "Lịch hẹn của bạn đã được đặt thành công!",
    });
  }
  document.querySelector(".booking-form").reset();
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
document.addEventListener("DOMContentLoaded", () => {
  generateTimeOptions("9:00", "18:00", 30);
});
