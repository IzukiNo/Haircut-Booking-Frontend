function populateBranchSelect(options) {
  const select = document.getElementById("branch-settings-select");
  if (!select) return;
  select.innerHTML = "";
  options.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.label;
    select.appendChild(option);
  });
}

async function updateBranchSetting(branchId, data) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage.");
    return null;
  }
  try {
    const res = await fetch(
      `http://157.66.100.145:4000/api/branches/${branchId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(data),
      }
    );
    const result = await res.json();
    if (res.ok) {
      return result.data;
    } else {
      Swal.fire({
        title: "Lỗi Khi Cập Nhật",
        text: result.message || "Cập Nhật Thất Bại",
        icon: "error",
      });
      console.error("Failed to update branch:", result.message);
      return null;
    }
  } catch (error) {
    console.error("Error updating branch:", error);
    return null;
  }
}

async function handlerSaveButton() {
  const select = document.getElementById("branch-settings-select");
  const branchId = select.value;
  const data = {};
  const nameInput = document.getElementById("shop-name");
  const phoneInput = document.getElementById("shop-phone");
  const addressInput = document.getElementById("shop-address");

  if (!nameInput || nameInput.value.trim() === "") {
    Swal.fire({
      title: "Missing Name",
      text: "Vui lòng nhập tên cửa hàng.",
      icon: "error",
    });
    return;
  }
  if (!addressInput || addressInput.value.trim() === "") {
    Swal.fire({
      title: "Missing Address",
      text: "Vui lòng nhập địa chỉ cửa hàng.",
      icon: "error",
    });
    return;
  }
  data.name = nameInput.value.trim();
  data.address = addressInput.value.trim();

  if (phoneInput && phoneInput.value.trim() !== "") {
    const phoneValue = phoneInput.value.trim();
    if (!/^\d{10}$/.test(phoneValue)) {
      Swal.fire({
        title: "Invalid Phone Number",
        text: "Số điện thoại không hợp lệ.",
        icon: "error",
      });
      return;
    }
    data.phone = phoneValue;
  }

  const res = await updateBranchSetting(branchId, data);
  if (res) {
    Swal.fire({
      title: "Success!",
      text: "Cập Nhật Thành Công",
      icon: "success",
    }).then(() => {
      location.reload();
    });
  }
}

function updateSettingsCard(branchId) {
  const branch = cacheBranches && cacheBranches[branchId];
  if (!branch) return;

  document.getElementById("shop-name").value = branch.name || "";
  document.getElementById("shop-phone").value = branch.phone || "";
  document.getElementById("shop-address").value = branch.address || "";

  const logoPreview = document.querySelector(".logo-preview");
  if (logoPreview) {
    logoPreview.style.backgroundImage = branch.logo
      ? `url('${branch.logo}')`
      : "";
  }
}

function setSaveButtonState() {
  const select = document.getElementById("branch-settings-select");
  const nameInput = document.getElementById("shop-name");
  const phoneInput = document.getElementById("shop-phone");
  const addressInput = document.getElementById("shop-address");
  const saveBtn = document.querySelector(".btn-save");
  if (!select || !saveBtn || !cacheBranches) return;
  const branch = cacheBranches[select.value];
  if (!branch) {
    saveBtn.disabled = true;
    return;
  }
  const changed =
    nameInput.value !== (branch.name || "") ||
    phoneInput.value !== (branch.phone || "") ||
    addressInput.value !== (branch.address || "");
  saveBtn.disabled = !changed;
}

function addSettingsChangeListeners() {
  ["shop-name", "shop-phone", "shop-address"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", setSaveButtonState);
    }
  });
  const select = document.getElementById("branch-settings-select");
  if (select) {
    select.addEventListener("change", setSaveButtonState);
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  await populateBranchesFromAPI();
  addSettingsChangeListeners();
  const select = document.getElementById("branch-settings-select");
  select.addEventListener("change", function (e) {
    updateSettingsCard(e.target.value);
    setSaveButtonState();
  });
  if (select && select.value) {
    updateSettingsCard(select.value);
    setSaveButtonState();
  }
  const saveBtn = document.querySelector(".btn-save");
  if (saveBtn) {
    saveBtn.addEventListener("click", handlerSaveButton);
  }
});

async function populateBranchesFromAPI() {
  const branches = await getBranchList();
  if (branches) {
    populateBranchSelect(
      branches.map((branch) => ({
        value: branch._id,
        label: branch.name,
      }))
    );
  }
}
