
function formatPrice(n) {
  return new Intl.NumberFormat("vi-VN").format(n) + "₫";
}

function refreshCartUI(cart, total) {
  cart.forEach((item) => {
    const row = document.querySelector(`[data-cart-item="${item._id}"]`);
    if (row) {
      const sub = row.querySelector(".cart-item__subtotal");
      if (sub) sub.textContent = formatPrice(item.price * item.quantity);
    }
  });
  const totalEl = document.querySelector("#cart-total-amount");
  if (totalEl) totalEl.textContent = formatPrice(total);
  const itemsEl = document.querySelector("#cart-items-count");
  const itemsCount = cart.reduce((s, i) => s + i.quantity, 0);
  if (itemsEl) itemsEl.textContent = `${itemsCount} sản phẩm`;
  updateCartBadge(itemsCount);
}

document.addEventListener("change", async (e) => {
  const input = e.target.closest("[data-cart-qty]");
  if (!input) return;

  const productId = input.dataset.cartQty;
  const quantity = parseInt(input.value);

  try {
    const res = await fetch("/cart/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });
    const data = await res.json();
    if (data.success) refreshCartUI(data.cart, data.total);
  } catch {
    Toast.error("Không thể cập nhật số lượng");
  }
});

document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-cart-remove]");
  if (!btn) return;

  const productId = btn.dataset.cartRemove;
  const confirmed = await Modal.confirm({
    title: "Xóa sản phẩm",
    body: "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?",
    confirmText: "Xóa",
    cancelText: "Giữ lại",
  });

  if (!confirmed) return;

  const row = document.querySelector(`[data-cart-item="${productId}"]`);
  if (row) row.classList.add("removing");

  try {
    const res = await fetch("/cart/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    const data = await res.json();

    if (data.success) {
      setTimeout(() => {
        if (row) row.remove();
        refreshCartUI(data.cart, data.total);

        if (data.cart.length === 0) {
          document.querySelector(".cart-items-list")?.remove();
          document.querySelector(".cart-summary")?.remove();
          document.getElementById("cart-main")?.insertAdjacentHTML("beforeend", `
            <div class="empty-state">
              <div class="empty-state__icon">🛒</div>
              <p class="empty-state__title">Giỏ hàng trống</p>
              <p class="empty-state__desc">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
              <a href="/" class="btn btn--primary">Tiếp tục mua sắm</a>
            </div>
          `);
        }
      }, 300);
      Toast.success("Đã xóa sản phẩm");
    }
  } catch {
    if (row) row.classList.remove("removing");
    Toast.error("Không thể xóa sản phẩm");
  }
});
