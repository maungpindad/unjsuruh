/* ==========================================================
   main.js
   Fungsi ini memuat Navbar & Footer dari file terpisah
   (partials/navbar.html dan partials/footer.html) lalu
   menempelkannya ke setiap halaman, dan mengatur semua
   interaksi kecil (dropdown, modal, chat sidebar, dll).

   PENTING: fetch() tidak bisa jalan kalau file HTML dibuka
   langsung (double click, url file:///...). Harus dibuka lewat
   server lokal, contoh: extension "Live Server" di VS Code.
   ========================================================== */

async function loadPartial(targetSelector, filePath) {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Gagal memuat ${filePath}: ${response.status}`);
    }
    const html = await response.text();
    target.innerHTML = html;
  } catch (error) {
    console.error(error);
    target.innerHTML = `<p style="padding:16px;color:red;">
      Gagal memuat ${filePath}. Pastikan kamu membuka halaman ini
      lewat Live Server, bukan dengan membuka file secara langsung.
    </p>`;
  }
}

function closeAllDropdowns() {
  document.querySelectorAll(".dropdown-panel.open").forEach((el) => el.classList.remove("open"));
}

function setupNavbarInteractions() {
  const notifToggle = document.querySelector("#notifToggle");
  const notifPanel = document.querySelector("#notifPanel");
  const profileToggle = document.querySelector("#profileMenuToggle");
  const profilePanel = document.querySelector("#profilePanel");

  if (notifToggle && notifPanel) {
    notifToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !notifPanel.classList.contains("open");
      closeAllDropdowns();
      if (willOpen) notifPanel.classList.add("open");
    });
  }

  if (profileToggle && profilePanel) {
    profileToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !profilePanel.classList.contains("open");
      closeAllDropdowns();
      if (willOpen) profilePanel.classList.add("open");
    });
  }

  document.addEventListener("click", () => closeAllDropdowns());

  // Logout modal
  const logoutTrigger = document.querySelector("#logoutTrigger");
  const logoutModal = document.querySelector("#logoutModal");
  const logoutCancel = document.querySelector("#logoutCancel");
  if (logoutTrigger && logoutModal) {
    logoutTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllDropdowns();
      logoutModal.classList.add("open");
    });
  }
  if (logoutCancel && logoutModal) {
    logoutCancel.addEventListener("click", () => logoutModal.classList.remove("open"));
  }
  if (logoutModal) {
    logoutModal.addEventListener("click", (e) => {
      if (e.target === logoutModal) logoutModal.classList.remove("open");
    });
  }

  // Chat sidebar: tombol apa pun dengan [data-open-chat] akan membukanya
  const chatSidebar = document.querySelector("#chatSidebar");
  const chatBackdrop = document.querySelector("#chatBackdrop");
  const chatClose = document.querySelector("#chatClose");
  function openChat() {
    if (chatSidebar) chatSidebar.classList.add("open");
    if (chatBackdrop) chatBackdrop.classList.add("open");
  }
  function closeChat() {
    if (chatSidebar) chatSidebar.classList.remove("open");
    if (chatBackdrop) chatBackdrop.classList.remove("open");
  }
  document.querySelectorAll("[data-open-chat]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openChat();
    });
  });
  if (chatClose) chatClose.addEventListener("click", closeChat);
  if (chatBackdrop) chatBackdrop.addEventListener("click", closeChat);

  // Loading overlay: tombol dengan [data-loading-title] & [data-loading-desc]
  // akan menampilkan overlay loading sebelum pindah halaman (simulasi proses).
  const loadingOverlay = document.querySelector("#loadingOverlay");
  const loadingTitle = document.querySelector("#loadingTitle");
  const loadingDesc = document.querySelector("#loadingDesc");
  document.querySelectorAll("[data-loading-title]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const href = btn.getAttribute("href");
      if (!href || href === "#") return;
      e.preventDefault();
      if (loadingOverlay) {
        loadingTitle.textContent = btn.dataset.loadingTitle || "Memproses...";
        loadingDesc.textContent = btn.dataset.loadingDesc || "Mohon tunggu sebentar.";
        loadingOverlay.classList.add("open");
        setTimeout(() => {
          window.location.href = href;
        }, 900);
      } else {
        window.location.href = href;
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Setiap halaman bisa menentukan navbar mana yang dipakai lewat
  // atribut data-navbar="guest" (belum login) atau dibiarkan kosong
  // untuk navbar versi sudah login (default).
  const navbarTarget = document.querySelector("#navbar-placeholder");
  const navbarVariant = navbarTarget && navbarTarget.dataset.navbar === "guest"
    ? "partials/navbar-guest.html"
    : "partials/navbar.html";

  loadPartial("#navbar-placeholder", navbarVariant).then(() => {
    setupNavbarInteractions();
  });
  loadPartial("#footer-placeholder", "partials/footer.html");
});
