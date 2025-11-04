function handleDeleteButton(serviceId) {
  if (!serviceId) return;
  const token = localStorage.getItem("token");
  Swal.fire({
    icon: "warning",
    title: "Xác nhận xóa dịch vụ?",
    text: "Bạn có chắc muốn xóa dịch vụ này? Hành động này không thể hoàn tác.",
    showCancelButton: true,
    confirmButtonText: "Xóa dịch vụ",
    cancelButtonText: "Đóng",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#888",
  }).then(async (result) => {
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/services/${serviceId}`,
        {
          method: "DELETE",
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
          title: "Đã xóa dịch vụ thành công!",
        });
        const pageInfo = document.getElementById("page-info");
        const page = pageInfo ? pageInfo.getAttribute("page") || 1 : 1;
        populateServicesTable(page, 6, "all");
      } else {
        Swal.fire({
          icon: "error",
          title: "Xóa dịch vụ thất bại",
          text: data.message || "Đã xảy ra lỗi khi xóa dịch vụ.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Xóa dịch vụ thất bại",
        text: "Đã xảy ra lỗi khi xóa dịch vụ.",
      });
    }
  });
}

document.body.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-delete")) {
    e.preventDefault();
    const tr = e.target.closest("tr[data-id]");
    if (tr) {
      const appointmentId = tr.getAttribute("data-id");
      handleDeleteButton(appointmentId);
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const addServiceBtn = document.querySelector(".btn-add-new");
  const addServiceModal = document.getElementById("add-service-modal");
  const cancelAddServiceBtn = document.getElementById("cancel-add-service");

  if (addServiceBtn && addServiceModal && cancelAddServiceBtn) {
    addServiceBtn.addEventListener("click", function () {
      addServiceModal.style.display = "flex";
    });
    cancelAddServiceBtn.addEventListener("click", function () {
      addServiceModal.style.display = "none";
    });
    addServiceModal.addEventListener("click", function (e) {
      if (e.target === addServiceModal) addServiceModal.style.display = "none";
    });
  }

  const addServiceForm = document.getElementById("add-service-form");
  if (addServiceForm) {
    addServiceForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const name = document.getElementById("service-name").value.trim();
      const price = document.getElementById("service-price").value.trim();
      const desc = document.getElementById("service-desc").value.trim();
      if (!name || !price) {
        Swal.fire({
          icon: "warning",
          title: "Vui lòng nhập đầy đủ tên và giá dịch vụ!",
        });
        return;
      }
      if (!/^\d+(\.\d{1,2})?$/.test(price) || Number(price) <= 0) {
        Swal.fire({
          icon: "warning",
          title: "Giá dịch vụ phải là số lớn hơn 0, có thể nhập số thập phân!",
        });
        return;
      }
      const priceValue = Math.round(Number(price) * 1000);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:3000/api/services", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ name, price: priceValue, description: desc }),
        });
        const data = await res.json();
        if (res.ok) {
          Swal.fire({
            icon: "success",
            title: "Thêm dịch vụ thành công!",
          });
          addServiceModal.style.display = "none";
          addServiceForm.reset();
          // Reload table (if function exists)
          if (typeof populateServicesTable === "function") {
            populateServicesTable(1, 6);
          }
        } else {
          addServiceModal.style.display = "none";
          Swal.fire({
            icon: "error",
            title: "Thêm dịch vụ thất bại",
            text: data.message || "Đã xảy ra lỗi khi thêm dịch vụ.",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        addServiceModal.style.display = "none";
        Swal.fire({
          icon: "error",
          title: "Thêm dịch vụ thất bại",
          text: "Đã xảy ra lỗi khi thêm dịch vụ.",
        });
      }
    });
  }
  // Edit service popup logic
  const editServiceModal = document.getElementById("edit-service-modal");
  const cancelEditServiceBtn = document.getElementById("cancel-edit-service");
  if (editServiceModal && cancelEditServiceBtn) {
    cancelEditServiceBtn.addEventListener("click", function () {
      editServiceModal.style.display = "none";
    });
    editServiceModal.addEventListener("click", function (e) {
      if (e.target === editServiceModal)
        editServiceModal.style.display = "none";
    });
  }

  const editServiceForm = document.getElementById("edit-service-form");
  if (editServiceForm) {
    editServiceForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const serviceId = editServiceModal.getAttribute("data-id");
      const name = document.getElementById("edit-service-name").value.trim();
      const price = document.getElementById("edit-service-price").value.trim();
      const desc = document.getElementById("edit-service-desc").value.trim();
      const status =
        document.getElementById("edit-service-status").value === "active";
      if (!name || !price) {
        Swal.fire({
          icon: "warning",
          title: "Vui lòng nhập đầy đủ tên và giá dịch vụ!",
        });
        return;
      }
      if (!/^\d+(\.\d{1,2})?$/.test(price) || Number(price) <= 0) {
        Swal.fire({
          icon: "warning",
          title: "Giá dịch vụ phải là số lớn hơn 0, có thể nhập số thập phân!",
        });
        return;
      }
      const priceValue = Math.round(Number(price) * 1000);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `http://localhost:3000/api/services/${serviceId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
              name,
              price: priceValue,
              description: desc,
              status,
            }),
          }
        );
        const data = await res.json();
        if (res.ok) {
          Swal.fire({
            icon: "success",
            title: "Cập nhật dịch vụ thành công!",
          });
          editServiceModal.style.display = "none";
          editServiceForm.reset();
          if (typeof populateServicesTable === "function") {
            populateServicesTable(1, 6);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Cập nhật dịch vụ thất bại",
            text: data.message || "Đã xảy ra lỗi khi cập nhật dịch vụ.",
          });
          editServiceModal.style.display = "none";
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Cập nhật dịch vụ thất bại",
          text: "Đã xảy ra lỗi khi cập nhật dịch vụ.",
        });
        editServiceModal.style.display = "none";
      }
    });
  }

  document.body.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("btn-action") &&
      !e.target.classList.contains("btn-delete")
    ) {
      e.preventDefault();
      const tr = e.target.closest("tr[data-id]");
      if (tr) {
        const serviceId = tr.getAttribute("data-id");
        const serviceData =
          cacheServices && cacheServices[serviceId]
            ? cacheServices[serviceId]
            : null;
        if (serviceData) {
          document.getElementById("edit-service-name").value =
            serviceData.name || "";
          document.getElementById("edit-service-price").value =
            serviceData.price ? Number(serviceData.price) / 1000 : "";
          document.getElementById("edit-service-desc").value =
            serviceData.description || "";
          document.getElementById("edit-service-status").value =
            serviceData.status === true || serviceData.status === "active"
              ? "active"
              : "inactive";
        } else {
          // fallback lấy từ bảng nếu cache không có
          const name = tr.children[0].textContent.trim();
          const price = tr.children[1].textContent
            .replace(/[^\d.]/g, "")
            .trim();
          const desc = tr.children[2].textContent.trim();
          const status = tr.children[3].classList.contains("status--active")
            ? "active"
            : "inactive";
          document.getElementById("edit-service-name").value = name;
          document.getElementById("edit-service-price").value = price
            ? Number(price) / 1000
            : "";
          document.getElementById("edit-service-desc").value = desc;
          document.getElementById("edit-service-status").value = status;
        }
        editServiceModal.setAttribute("data-id", serviceId);
        editServiceModal.style.display = "flex";
      }
    }
  });
});
