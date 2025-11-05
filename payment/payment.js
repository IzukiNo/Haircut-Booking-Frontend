const params = new URLSearchParams(window.location.search);
const appointmentId = params.get("id");
const paymentType = params.get("type");
const cashierId = params.get("cashier");

let cacheTransaction = null;

if (appointmentId && paymentType) {
  console.log(
    `Lịch hẹn: ${appointmentId} | Hình thức: ${paymentType} | Nhân viên thu ngân: ${cashierId}`
  );
} else {
  console.log("Thiếu thông tin thanh toán.");
}

const qrImages = {
  bank_transfer:
    "https:/http://157.66.100.145:4000/api.qrserver.com/v1/create-qr-code/?data=bank_transfer_demo&size=160x160",
  momo: "https:/http://157.66.100.145:4000/api.qrserver.com/v1/create-qr-code/?data=momo_demo&size=160x160",
  zalo_pay:
    "https:/http://157.66.100.145:4000/api.qrserver.com/v1/create-qr-code/?data=zalo_pay_demo&size=160x160",
};
const reviewExamples = [
  "Dịch vụ rất tốt!",
  "Thợ cắt tóc chuyên nghiệp",
  "Không gian sạch sẽ",
  "Sẽ quay lại lần sau",
  "Nhân viên thân thiện",
];

// Xác nhận thanh toán
const confirmBtn = document.getElementById("confirm-btn");

confirmBtn.onclick = async function () {
  if (["bank_transfer", "momo", "zalo_pay"].includes(paymentType)) {
    showQrPopup(qrImages[paymentType] || qrImages["bank_transfer"]);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await submitPayment(cacheTransaction._id).then(() => {
      document.getElementById("payment-step1").style.display = "none";
      document.getElementById("payment-step2").style.display = "flex";
      const qrModal = document.getElementById("qr-modal");
      if (qrModal) qrModal.style.display = "none";
      renderReview();
    });
  } else {
    await submitPayment(cacheTransaction._id).then(() => {
      document.getElementById("payment-step1").style.display = "none";
      document.getElementById("payment-step2").style.display = "flex";
      renderReview();
    });
  }
};

// QR popup logic
function showQrPopup(qrSrc) {
  const qrModal = document.getElementById("qr-modal");
  const qrImg = document.getElementById("qr-img-popup");
  if (!qrModal || !qrImg) return;
  qrImg.src = qrSrc || "";
  qrModal.style.display = "flex";
}

// Đóng popup khi click ra ngoài
const qrModal = document.getElementById("qr-modal");
if (qrModal) {
  qrModal.addEventListener("click", function (e) {
    if (e.target === qrModal) {
      qrModal.style.display = "none";
      document.getElementById("qr-img-popup").src = "";
    }
  });
}

// Đóng popup
const cancelBtn = document.getElementById("cancel-btn");
if (cancelBtn) {
  cancelBtn.onclick = function () {
    window.close();
  };
}

// Review UI
function renderReview() {
  // Stars
  const starsDiv = document.getElementById("review-stars");
  starsDiv.innerHTML = "";
  let selectedStar = 0;
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.className = "review-star";
    star.innerHTML = "&#9733;";
    star.onclick = function () {
      selectedStar = i;
      Array.from(starsDiv.children).forEach((s, idx) => {
        s.classList.toggle("selected", idx < i);
      });
    };
    starsDiv.appendChild(star);
  }
  // Comment examples
  const examplesDiv = document.getElementById("review-examples");
  examplesDiv.innerHTML = "";
  let commentBox = document.getElementById("review-comment");
  reviewExamples.forEach((ex) => {
    const exBtn = document.createElement("span");
    exBtn.className = "review-example";
    exBtn.textContent = ex;
    exBtn.onclick = function () {
      commentBox.value = ex;
      Array.from(examplesDiv.children).forEach((b) =>
        b.classList.remove("selected")
      );
      exBtn.classList.add("selected");
    };
    examplesDiv.appendChild(exBtn);
  });
  // Submit review
  document.getElementById("submit-review").onclick = async function () {
    if (selectedStar < 1 || selectedStar > 5) {
      await Swal.fire(
        "Lưu ý",
        "Vui lòng chọn số sao từ 1 đến 5 để đánh giá!",
        "warning"
      );
      return;
    }
    await submitReview(selectedStar, commentBox.value, appointmentId).then(
      () => {
        document.getElementById("payment-step2").style.display = "none";
        document.getElementById("payment-thankyou").style.display = "flex";
      }
    );
  };
}

async function createTransaction(appointmentId, cashierId, paymentMethod) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(
      "http://localhost:3000http://157.66.100.145:4000/api/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ appointmentId, cashierId, paymentMethod }),
      }
    );
    const data = await res.json();

    if (res.ok) {
      console.log("Transaction created successfully:", data);
      populateTransactionForm(data.data);
      cacheTransaction = data.data;
      return data.data;
    } else {
      if (data.status === 409) {
        populateTransactionForm(data.data);
        cacheTransaction = data.data;
        return data.data;
      }
      console.error("Error creating transaction:", data);
      return null;
    }
  } catch (error) {
    console.error("Error creating transaction:", error);
  }
}

function populateTransactionForm(transaction) {
  const userDiv = document.getElementById("payment-user");
  userDiv.textContent =
    "Khách hàng: " + (transaction.details.customerName || "");

  const servicesDiv = document.getElementById("payment-services");
  servicesDiv.innerHTML = (transaction.details.services || [])
    .map(
      (s) =>
        `<div class="payment-service-item"><span>${
          s.name
        }</span><span>${s.price.toLocaleString()}đ</span></div>`
    )
    .join("");

  document.getElementById("payment-total").textContent =
    (transaction.amount || 0).toLocaleString() + " đ";

  const titleDiv = document.getElementById("payment-modal-title");
  if (titleDiv) {
    const methodMap = {
      cash: "Tiền mặt",
      bank_transfer: "Chuyển khoản",
      momo: "Ví MoMo",
      zalo_pay: "ZaloPay",
    };
    const methodText =
      methodMap[transaction.paymentMethod] || transaction.paymentMethod;
    titleDiv.textContent = `Thanh Toán (Phương thức: ${methodText})`;
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  if (appointmentId && paymentType && cashierId) {
    const transaction = await createTransaction(
      appointmentId,
      cashierId,
      paymentType
    );
  }
});

async function submitReview(rating, comment, appointmentId) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(
      "http://localhost:3000http://157.66.100.145:4000/api/reviews/" +
        appointmentId,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ rating, comment }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      console.log("Review submitted successfully:", data);
      await Swal.fire("Thành công!", "Cảm ơn bạn đã gửi đánh giá.", "success");
    } else {
      console.error("Error submitting review:", data);
      await Swal.fire(
        "Thất bại!",
        "Có lỗi xảy ra trong quá trình gửi đánh giá.",
        "error"
      );
    }
  } catch (error) {
    console.error("Error submitting review:", error);
  }
}

async function submitPayment(appointmentId) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(
      "http://localhost:3000http://157.66.100.145:4000/api/transactions/" +
        appointmentId,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ status: "confirmed" }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      console.log("Payment submitted successfully:", data);
      await Swal.fire("Thành công!", "Thanh toán đã được xác nhận.", "success");
      return data.data;
    } else {
      console.error("Error submitting payment:", data);
      await Swal.fire(
        "Thất bại!",
        "Có lỗi xảy ra trong quá trình thanh toán.",
        "error"
      );
      return null;
    }
  } catch (error) {
    console.error("Error submitting payment:", error);
  }
}
