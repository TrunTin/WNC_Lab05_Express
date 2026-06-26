(function () {
  const loader = document.createElement("div");
  loader.className = "page-loader";
  loader.id = "page-loader";
  document.body.prepend(loader);

  window.addEventListener("load", () => {
    loader.style.width = "100%";
    setTimeout(() => { loader.style.opacity = "0"; }, 300);
  });

  let progress = 0;
  const tick = setInterval(() => {
    progress = Math.min(progress + Math.random() * 15, 85);
    loader.style.width = progress + "%";
    if (progress >= 85) clearInterval(tick);
  }, 200);
})();

const Toast = (() => {
  let container = null;

  function getContainer() {
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }
    return container;
  }

  function show(message, type = "success", duration = 3500) {
    const c = getContainer();
    const toast = document.createElement("div");
    toast.className = `toast${type === "error" ? " toast--error" : ""}`;

    const icon = type === "error" ? "✕" : "✓";
    toast.innerHTML = `
      <span class="toast__icon">${icon}</span>
      <span>${message}</span>
      <button class="toast__close" aria-label="Đóng">×</button>
    `;

    const close = () => {
      toast.classList.add("hide");
      setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector(".toast__close").addEventListener("click", close);
    c.appendChild(toast);
    setTimeout(close, duration);
    return toast;
  }

  return { show, error: (m) => show(m, "error"), success: (m) => show(m, "success") };
})();


const Modal = (() => {
  function open(opts = {}) {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <div class="modal__header">
          <h2 class="modal__title">${opts.title || ""}</h2>
          <button class="modal__close" aria-label="Đóng">×</button>
        </div>
        <div class="modal__body">${opts.body || ""}</div>
        ${opts.footer ? `<div class="modal__footer">${opts.footer}</div>` : ""}
      </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("open"));

    const close = () => {
      overlay.classList.remove("open");
      setTimeout(() => overlay.remove(), 220);
    };

    overlay.querySelector(".modal__close").addEventListener("click", close);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    document.addEventListener("keydown", function esc(e) {
      if (e.key === "Escape") { close(); document.removeEventListener("keydown", esc); }
    });

    return { close };
  }

  function confirm(opts = {}) {
    return new Promise((resolve) => {
      const footer = `
        <button class="btn btn--ghost btn--sm" id="modal-cancel">${opts.cancelText || "Hủy"}</button>
        <button class="btn btn--danger btn--sm" id="modal-confirm">${opts.confirmText || "Xác nhận"}</button>
      `;
      const m = open({ ...opts, footer });
      document.getElementById("modal-cancel").addEventListener("click", () => { m.close(); resolve(false); });
      document.getElementById("modal-confirm").addEventListener("click", () => { m.close(); resolve(true); });
    });
  }

  return { open, confirm };
})();


function updateCartBadge(count) {
  const badge = document.querySelector(".cart-badge");
  if (badge) {
    badge.textContent = count;
    badge.classList.remove("bump");
    requestAnimationFrame(() => badge.classList.add("bump"));
    badge.addEventListener("animationend", () => badge.classList.remove("bump"), { once: true });
  }
}

document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-add-to-cart]");
  if (!btn) return;

  const productId = btn.dataset.addToCart;
  const qty = btn.dataset.qty || 1;

  const original = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span style="opacity:.6">Đang thêm…</span>`;

  try {
    const res = await fetch("/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: parseInt(qty) }),
    });
    const data = await res.json();

    if (data.success) {
      updateCartBadge(data.cartCount);
      Toast.success("Đã thêm vào giỏ hàng");
    } else {
      Toast.error(data.message || "Không thể thêm vào giỏ hàng");
    }
  } catch {
    Toast.error("Lỗi kết nối, thử lại sau");
  } finally {
    btn.innerHTML = original;
    btn.disabled = false;
  }
});


document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-qty-change]");
  if (!btn) return;

  const target = document.querySelector(btn.dataset.qtyTarget || "#qty-input");
  if (!target) return;

  const delta = parseInt(btn.dataset.qtyChange);
  const min = parseInt(target.min) || 1;
  const max = parseInt(target.max) || 999;
  target.value = Math.max(min, Math.min(max, parseInt(target.value || 1) + delta));
});


(function () {
  const searchInput = document.querySelector("[data-search-input]");
  if (!searchInput) return;

  let timer;
  searchInput.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const url = new URL(window.location);
      if (searchInput.value.trim()) {
        url.searchParams.set("search", searchInput.value.trim());
      } else {
        url.searchParams.delete("search");
      }
      url.searchParams.delete("page");
      window.location.href = url.toString();
    }, 450);
  });
})();


(function () {
  const cards = document.querySelectorAll(".product-card");
  cards.forEach((card, i) => {
    card.style.animationDelay = `${i * 60}ms`;
  });
})();
