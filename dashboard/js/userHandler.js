let scheduleArr = [];
let editScheduleArr = [];

function generateTimeOptions(start = "09:00", end = "18:00", step = 30) {
  const startSelect = document.getElementById("schedule-start");
  const endSelect = document.getElementById("schedule-end");
  if (startSelect) startSelect.innerHTML = "";
  if (endSelect) endSelect.innerHTML = "";
  let [h, m] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  while (h < endH || (h === endH && m <= endM)) {
    const timeStr = `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}`;
    const optionStart = document.createElement("option");
    optionStart.value = timeStr;
    optionStart.textContent = timeStr;
    if (startSelect) startSelect.appendChild(optionStart);

    const optionEnd = document.createElement("option");
    optionEnd.value = timeStr;
    optionEnd.textContent = timeStr;
    if (endSelect) endSelect.appendChild(optionEnd);

    m += step;
    if (m >= 60) {
      h++;
      m -= 60;
    }
  }
}

function handleDeleteButton(userId) {
  if (!userId) return;
  const roles = ["user", "cashier", "stylist", "staff", "admin"];
  const token = localStorage.getItem("token");
  Swal.fire({
    icon: "warning",
    title: "Xác nhận xóa nhân viên?",
    text: "Bạn có chắc muốn xóa nhân viên này? Hành động này không thể hoàn tác.",
    showCancelButton: true,
    confirmButtonText: "Xóa nhân viên",
    cancelButtonText: "Đóng",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#888",
  }).then(async (result) => {
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`http://localhost:3000/api/employees/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ role: roles[cacheEmployees[userId].role] }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Đã xóa nhân viên thành công!",
        });
        // Reload bảng nhân viên
        const pageInfo = document.getElementById("page-info");
        const page = pageInfo ? pageInfo.getAttribute("page") || 1 : 1;
        populateUsersTable(page, 10);
      } else {
        Swal.fire({
          icon: "error",
          title: "Xóa nhân viên thất bại",
          text: data.message || "Đã xảy ra lỗi khi xóa nhân viên.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Xóa nhân viên thất bại",
        text: "Đã xảy ra lỗi khi xóa nhân viên.",
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  await getBranchList();
  const editUserModal = document.getElementById("edit-user-modal");
  const editUserForm = document.getElementById("edit-user-form");
  const cancelEditUserBtn = document.getElementById("cancel-edit-user");

  // Đóng popup khi nhấn nút hủy hoặc click ra ngoài
  if (editUserModal && cancelEditUserBtn) {
    cancelEditUserBtn.addEventListener("click", function () {
      editUserModal.style.display = "none";
    });
    editUserModal.addEventListener("click", function (e) {
      if (e.target === editUserModal) editUserModal.style.display = "none";
    });
  }

  // Mở popup và fill dữ liệu khi nhấn nút Sửa
  document.body.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("btn-action") &&
      e.target.textContent.trim() === "Sửa"
    ) {
      e.preventDefault();
      populateBranchOptions(
        document.getElementById("edit-user-branch"),
        "edit-user-branch"
      );
      const tr = e.target.closest("tr[data-id]");
      if (tr) {
        const userId = tr.getAttribute("data-id");
        const emp = cacheEmployees[userId];
        if (emp) {
          document
            .getElementById("edit-user-modal")
            .setAttribute("data-id", userId);
          document.getElementById("edit-user-name").value = emp.username || "";
          document.getElementById("edit-user-phone").value = emp.phone || "";
          document.getElementById("edit-user-role").value = String(emp.role);
          document.getElementById("edit-user-branch").value =
            emp.branch.id || "";
          document.getElementById("edit-user-status").value = emp.status
            ? "active"
            : "inactive";
          editUserModal.style.display = "flex";
        }
      }
    }
  });

  const editScheduleListDiv = document.getElementById("edit-schedule-list");
  const editAddScheduleBtn = document.getElementById("edit-add-schedule-btn");
  const addScheduleModal = document.getElementById("add-schedule-modal");
  const addScheduleForm = document.getElementById("add-schedule-form");

  const cancelAddScheduleBtn = document.getElementById("cancel-add-schedule");
  if (cancelAddScheduleBtn) {
    cancelAddScheduleBtn.onclick = function () {
      addScheduleModal.style.display = "none";
    };
  }

  function renderEditSchedule() {
    if (!editScheduleListDiv) return;
    editScheduleListDiv.innerHTML = editScheduleArr
      .map(
        (item, idx) => `
          <div class="schedule-card">
            <span class="schedule-card-day">${getDayText(item.day)}</span>
            <span class="schedule-card-time">${item.startTime} - ${
          item.endTime
        }</span>
            <button type="button" class="schedule-card-remove" data-idx="${idx}">&times;</button>
          </div>
        `
      )
      .join("");
    editScheduleListDiv
      .querySelectorAll(".schedule-card-remove")
      .forEach((btn) => {
        btn.onclick = function () {
          const idx = +btn.getAttribute("data-idx");
          editScheduleArr.splice(idx, 1);
          renderEditSchedule();
        };
      });
  }

  // Fix: Khi mở popup thêm/sửa lịch làm việc, cần reset lại form và set lại select option
  if (editAddScheduleBtn) {
    editAddScheduleBtn.onclick = function () {
      addScheduleModal.style.display = "flex";
      addScheduleForm.reset();
      generateTimeOptions("6:00", "21:00", 60);
    };
  }

  // Khi mở popup sửa, render lại schedule
  document.body.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("btn-action") &&
      e.target.textContent.trim() === "Sửa"
    ) {
      const tr = e.target.closest("tr[data-id]");
      if (tr) {
        const userId = tr.getAttribute("data-id");
        const emp = cacheEmployees[userId];
        if (emp && Array.isArray(emp.schedule)) {
          editScheduleArr = emp.schedule.map((s) => ({ ...s }));
          renderEditSchedule();
        } else {
          editScheduleArr = [];
          renderEditSchedule();
        }
      }
    }
  });

  // Fix: Đảm bảo chỉ gán 1 event submit cho addScheduleForm, không bị lặp
  if (addScheduleForm) {
    addScheduleForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const day = document.getElementById("schedule-day").value;
      const start = document.getElementById("schedule-start").value;
      const end = document.getElementById("schedule-end").value;
      if (!day || !start || !end) {
        Swal.fire({
          icon: "warning",
          title: "Thiếu thông tin",
          text: "Vui lòng chọn đầy đủ ngày và thời gian làm việc!",
        });
        return;
      }
      if (start >= end) {
        Swal.fire({
          icon: "error",
          title: "Thời gian không hợp lệ",
          text: "Giờ bắt đầu phải nhỏ hơn giờ kết thúc!",
        });
        return;
      }

      const targetArr =
        editUserModal && editUserModal.style.display === "flex"
          ? editScheduleArr
          : scheduleArr;

      const duplicate = targetArr.some((s) => s.day === day);
      if (duplicate) {
        Swal.fire({
          icon: "info",
          title: "Ngày làm việc đã tồn tại",
          text: `Lịch làm việc cho "${day}" đã được thêm trước đó!`,
        });
        return;
      }
      targetArr.push({ day, startTime: start, endTime: end });
      if (targetArr === editScheduleArr) {
        renderEditSchedule();
      } else {
        renderSchedule();
      }
      addScheduleModal.style.display = "none";
    });
  }

  // Event cho nút xóa nhân viên
  document.body.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("btn-delete") &&
      e.target.closest("tr[data-id]")
    ) {
      e.preventDefault();
      const tr = e.target.closest("tr[data-id]");
      const userId = tr.getAttribute("data-id");
      handleDeleteButton(userId);
    }
  });

  // --- CREATE USER POPUP LOGIC ---
  const createUserModal = document.getElementById("create-user-modal");
  const createUserForm = document.getElementById("create-user-form");
  const cancelCreateUserBtn = document.getElementById("cancel-create-user");
  const branchSelect = document.getElementById("create-user-branch");
  const scheduleListDiv = document.getElementById("schedule-list");
  const addScheduleBtn = document.getElementById("add-schedule-btn");

  generateTimeOptions("6:00", "21:00", 60);

  const btnAddNew = document.querySelector(".btn-add-new");
  if (btnAddNew && createUserModal) {
    btnAddNew.addEventListener("click", function (e) {
      e.preventDefault();
      createUserModal.style.display = "flex";
      createUserForm.reset();
      scheduleArr = [];
      scheduleListDiv.innerHTML = "";
      if (branchSelect) branchSelect.selectedIndex = 0;
    });
  }

  if (cancelCreateUserBtn) {
    cancelCreateUserBtn.onclick = () => {
      createUserModal.style.display = "none";
      createUserForm.reset();
      scheduleListDiv.innerHTML = "";
      scheduleArr = [];
    };
  }

  populateBranchOptions(branchSelect, "create-user-branch");

  function renderSchedule() {
    scheduleListDiv.innerHTML = scheduleArr
      .map(
        (item, idx) => `
          <div class="schedule-card">
            <span class="schedule-card-day">${getDayText(item.day)}</span>
            <span class="schedule-card-time">${item.startTime} - ${
          item.endTime
        }</span>
            <button type="button" class="schedule-card-remove" data-idx="${idx}">&times;</button>
          </div>
        `
      )
      .join("");
    scheduleListDiv.querySelectorAll(".schedule-card-remove").forEach((btn) => {
      btn.onclick = function () {
        const idx = +btn.getAttribute("data-idx");
        scheduleArr.splice(idx, 1);
        renderSchedule();
      };
    });
  }
  function getDayText(day) {
    const map = {
      monday: "Thứ 2",
      tuesday: "Thứ 3",
      wednesday: "Thứ 4",
      thursday: "Thứ 5",
      friday: "Thứ 6",
      saturday: "Thứ 7",
      sunday: "Chủ nhật",
    };
    return map[day] || day;
  }
  if (addScheduleBtn) {
    addScheduleBtn.onclick = function () {
      addScheduleModal.style.display = "flex";
      addScheduleForm.reset();
      generateTimeOptions("6:00", "21:00", 60);
    };
  }
  if (addScheduleForm) {
    addScheduleForm.onsubmit = null;
    addScheduleForm.onsubmit = function (event) {
      event.preventDefault();

      const selectedDay = document.getElementById("schedule-day").value;
      const startTime = document.getElementById("schedule-start").value;
      const endTime = document.getElementById("schedule-end").value;

      if (!selectedDay || !startTime || !endTime) {
        return Swal.fire({
          icon: "warning",
          title: "Thiếu thông tin!",
          text: "Vui lòng chọn đầy đủ ngày, giờ bắt đầu và giờ kết thúc.",
          confirmButtonColor: "#3085d6",
        });
      }

      if (startTime >= endTime) {
        return Swal.fire({
          icon: "error",
          title: "Thời gian không hợp lệ!",
          text: "Giờ bắt đầu phải nhỏ hơn giờ kết thúc.",
          confirmButtonColor: "#d33",
        });
      }

      const alreadyExists = scheduleArr.some(
        (s) => s.day.trim().toLowerCase() === selectedDay.trim().toLowerCase()
      );
      if (alreadyExists) return;

      scheduleArr.push({ day: selectedDay, startTime, endTime });
      renderSchedule();

      addScheduleForm.reset();
      addScheduleModal.style.display = "none";
    };
  }

  if (createUserForm) {
    createUserForm.onsubmit = async function (e) {
      e.preventDefault();
      const roles = ["user", "cashier", "stylist", "staff", "admin"];
      const email = document.getElementById("create-user-email").value.trim();
      const role = document.getElementById("create-user-role").value;
      const branch = branchSelect.value;
      if (!email || !role || !branch) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
      }
      if (scheduleArr.length === 0) {
        alert("Vui lòng thêm lịch làm việc!");
        return;
      }
      const payload = {
        email,
        role: roles[role],
        branchId: branch,
        schedule: scheduleArr,
      };
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:3000/api/employees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          Swal.fire({
            icon: "success",
            title: "Tạo nhân viên thành công!",
          });
          createUserModal.style.display = "none";
          createUserForm.reset();
          scheduleArr = [];
          scheduleListDiv.innerHTML = "";
          if (typeof populateUsersTable === "function")
            populateUsersTable(1, 6);
        } else {
          createUserModal.style.display = "none";
          createUserForm.reset();
          scheduleArr = [];
          scheduleListDiv.innerHTML = "";
          Swal.fire({
            icon: "error",
            title: "Tạo nhân viên thất bại",
            text: data.message || "Đã xảy ra lỗi khi tạo nhân viên.",
          });
        }
      } catch (error) {
        console.error(error);
        createUserModal.style.display = "none";
        createUserForm.reset();
        scheduleArr = [];
        scheduleListDiv.innerHTML = "";
        Swal.fire({
          icon: "error",
          title: "Tạo nhân viên thất bại",
          text: "Đã xảy ra lỗi khi tạo nhân viên.",
        });
      }
    };
  }

  // Hàm populate branch cho select option (sửa & thêm mới)
  function populateBranchOptions(selectEl, selectedId = "") {
    if (!selectEl || typeof cacheBranches !== "object")
      console.log("cacheBranches:", cacheBranches);
    let html = "";
    Object.values(cacheBranches).forEach((branch) => {
      html += `<option value="${branch._id}"${
        branch._id === selectedId ? " selected" : ""
      }>${branch.name}</option>`;
    });
    selectEl.innerHTML = html;
  }

  // Xử lý submit form sửa user
  if (editUserForm) {
    editUserForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const userId = editUserModal.getAttribute("data-id");
      const currentRole = cacheEmployees[userId].role;

      const name = document.getElementById("edit-user-name").value.trim();
      const phone = document.getElementById("edit-user-phone").value.trim();
      const newRole = document.getElementById("edit-user-role").value.trim();
      const branchId = document.getElementById("edit-user-branch").value.trim();
      const status = document.getElementById("edit-user-status").value;

      if (!name || !phone || !newRole || !branchId) {
        Swal.fire({
          icon: "warning",
          title: "Vui lòng nhập đầy đủ thông tin!",
        });
        return;
      }

      if (editScheduleArr.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Vui lòng thêm lịch làm việc!",
        });
        return;
      }

      // 🔧 Build data body động — chỉ thêm field nào có giá trị
      const payload = {
        userId,
        currentRole,
        newRole: Number(newRole),
        branchId,
        username: name,
        phone,
        active: status === "active" ? true : false,
        schedule: editScheduleArr,
      };

      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`http://localhost:3000/api/employees`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (res.ok) {
          Swal.fire({
            icon: "success",
            title: "Cập nhật người dùng thành công!",
          });
          editUserModal.style.display = "none";
          editUserForm.reset();
          editScheduleArr = [];
          renderEditSchedule();
          if (typeof populateUsersTable === "function")
            populateUsersTable(1, 6);
        } else {
          Swal.fire({
            icon: "error",
            title: "Cập nhật thất bại",
            text: data.message || "Đã xảy ra lỗi khi cập nhật.",
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Cập nhật thất bại",
          text: "Đã xảy ra lỗi khi cập nhật.",
        });
      }
    });
  }
});
