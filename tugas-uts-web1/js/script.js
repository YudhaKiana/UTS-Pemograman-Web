/* ===== Helper umum ===== */
const $ = (s) => document.querySelector(s);
const rupiah = (n) => "Rp " + Number(n).toLocaleString("id-ID");
const STATUS = ["Dipesan", "Dikemas", "Dikirim", "Dalam Perjalanan", "Diterima"];
const store = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v))
};
const getUsers = () => [...dataPengguna, ...store.get("users", [])];
// Ubah "Rp 180.000" -> 180000
const hargaNum = (s) => typeof s === "number" ? s : parseInt(String(s).replace(/\D/g, "")) || 0;
// Samakan struktur data.js (kodeBarang, namaBarang, dst) dengan struktur internal aplikasi
const normBuku = (b) => ({ kode: b.kodeBarang, judul: b.namaBarang, kategori: b.jenisBarang,
  edisi: b.edisi, harga: hargaNum(b.harga), stok: b.stok, gambar: b.cover });
const normDO = (d) => ({ no: d.nomorDO, nama: d.nama, ekspedisi: d.ekspedisi, tanggal: d.tanggalKirim,
  paket: d.paket, total: hargaNum(d.total), metode: "-", status: Math.max(0, STATUS.indexOf(d.status)),
  perjalanan: d.perjalanan });
const getKatalog = () => store.get("katalog", dataKatalogBuku.map(normBuku));
const getOrders = () => [...store.get("orders", []), ...Object.values(dataTracking).map(normDO)];

function showAlert(msg, title = "Informasi", cb) {
  $("#alert-title").textContent = title;
  $("#alert-msg").textContent = msg;
  const m = $("#modal-alert");
  m.hidden = false;
  m._cb = cb;
}
const openModal = (id) => { $("#" + id).hidden = false; };
const closeModal = (m) => { m.hidden = true; if (m._cb) { m._cb(); m._cb = null; } };

document.addEventListener("click", (e) => {
  const o = e.target.closest("[data-open]");
  if (o) openModal(o.dataset.open);
  if (e.target.closest("[data-close]") || e.target.classList.contains("modal"))
    closeModal(e.target.closest(".modal"));
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") document.querySelectorAll(".modal:not([hidden])").forEach(closeModal);
});

const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const page = document.body.dataset.page;

/* ===== Proteksi halaman ===== */
if (page !== "login" && !sessionStorage.getItem("user")) location.href = "index.html";
const logout = $("#btn-logout");
if (logout) logout.addEventListener("click", () => { sessionStorage.removeItem("user"); location.href = "index.html"; });
document.querySelectorAll(".topbar nav a").forEach((a) => {
  if (a.getAttribute("href") === location.pathname.split("/").pop()) a.classList.add("active");
});

/* ===== LOGIN ===== */
if (page === "login") {
  $("#form-login").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#email").value.trim(), pass = $("#password").value;
    const err = $("#login-error"); err.textContent = "";
    if (!email || !pass) { err.textContent = "Email dan password wajib diisi."; return; }
    if (!validEmail(email)) { err.textContent = "Format email tidak valid."; return; }
    const user = getUsers().find((u) => u.email === email && u.password === pass);
    if (!user) { showAlert("Email/password yang anda masukkan salah", "Login Gagal"); return; }
    sessionStorage.setItem("user", JSON.stringify(user));
    location.href = "dashboard.html";
  });

  $("#form-lupa").addEventListener("submit", (e) => {
    e.preventDefault();
    const em = $("#lupa-email").value.trim(), err = $("#lupa-error");
    if (!validEmail(em)) { err.textContent = "Masukkan email yang valid."; return; }
    if (!getUsers().some((u) => u.email === em)) { err.textContent = "Email tidak terdaftar."; return; }
    err.textContent = ""; closeModal($("#modal-lupa"));
    showAlert("Link reset password telah dikirim ke " + em, "Berhasil");
  });

  $("#form-daftar").addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = $("#reg-nama").value.trim(), em = $("#reg-email").value.trim(), pw = $("#reg-pass").value;
    const err = $("#reg-error");
    if (!nama || !em || !pw) { err.textContent = "Semua field wajib diisi."; return; }
    if (!validEmail(em)) { err.textContent = "Format email tidak valid."; return; }
    if (pw.length < 5) { err.textContent = "Password minimal 5 karakter."; return; }
    if (getUsers().some((u) => u.email === em)) { err.textContent = "Email sudah terdaftar."; return; }
    const users = store.get("users", []); users.push({ nama, email: em, password: pw });
    store.set("users", users);
    err.textContent = ""; e.target.reset(); closeModal($("#modal-daftar"));
    showAlert("Akun berhasil dibuat. Silakan login.", "Berhasil");
  });
}

/* ===== DASHBOARD ===== */
if (page === "dashboard") {
  const jam = new Date().getHours();
  const salam = jam < 11 ? "Selamat Pagi" : jam < 15 ? "Selamat Siang" : jam < 18 ? "Selamat Sore" : "Selamat Malam";
  $("#greeting").textContent = `${salam}, ${JSON.parse(sessionStorage.getItem("user")).nama}! 👋`;
  $("#tanggal-sekarang").textContent = new Date().toLocaleDateString("id-ID", { dateStyle: "full" });
}

/* ===== STOK ===== */
if (page === "stok") {
  let katalog = getKatalog();
  const tbody = $("#tabel-stok tbody");

  function renderStok(filter = "") {
    tbody.innerHTML = "";
    katalog.filter((b) => (b.judul + b.kategori).toLowerCase().includes(filter.toLowerCase()))
      .forEach((b) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><img class="cover" src="${b.gambar || ""}" alt="Cover ${b.judul}" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'📕'}))"></td>
          <td>${b.kode}</td><td>${b.judul} <small class="muted">(Edisi ${b.edisi || "-"})</small></td><td>${b.kategori}</td>
          <td>${rupiah(b.harga)}</td>
          <td><span class="badge ${b.stok < 10 ? "warn" : "ok"}">${b.stok}</span></td>
          <td><button class="btn btn-small btn-danger" data-hapus="${b.kode}">Hapus</button></td>`;
        tbody.appendChild(tr);
      });
    if (!tbody.children.length) tbody.innerHTML = '<tr><td colspan="7" class="muted">Data tidak ditemukan.</td></tr>';
  }

  $("#form-stok").addEventListener("submit", (e) => {
    e.preventDefault();
    const kode = $("#s-kode").value.trim(), judul = $("#s-judul").value.trim(),
      kategori = $("#s-kategori").value.trim(), harga = +$("#s-harga").value, stok = +$("#s-stok").value;
    const err = $("#stok-error");
    if (!kode || !judul || !kategori || $("#s-harga").value === "" || $("#s-stok").value === "") { err.textContent = "Semua field wajib diisi."; return; }
    if (harga < 0 || stok < 0) { err.textContent = "Harga dan stok tidak boleh negatif."; return; }
    if (katalog.some((b) => b.kode === kode)) { err.textContent = "Kode buku sudah ada."; return; }
    err.textContent = "";
    katalog.push({ kode, judul, kategori, edisi: $("#s-edisi").value.trim() || "1", harga, stok, gambar: "" });
    store.set("katalog", katalog); renderStok(); e.target.reset();
    showAlert(`Buku "${judul}" berhasil ditambahkan.`, "Berhasil");
  });

  tbody.addEventListener("click", (e) => {
    const k = e.target.dataset.hapus;
    if (k && confirm("Hapus buku " + k + "?")) {
      katalog = katalog.filter((b) => b.kode !== k); store.set("katalog", katalog); renderStok($("#cari-buku").value);
    }
  });
  $("#cari-buku").addEventListener("input", (e) => renderStok(e.target.value));
  renderStok();
}

/* ===== CHECKOUT ===== */
if (page === "checkout") {
  const katalog = getKatalog();
  let cart = [];
  const sel = $("#pilih-buku"), tb = $("#tabel-cart tbody");
  sel.innerHTML = katalog.map((b) => `<option value="${b.kode}">${b.judul} – ${rupiah(b.harga)} (stok ${b.stok})</option>`).join("");
  $("#o-nama").value = JSON.parse(sessionStorage.getItem("user")).nama;
  $("#o-email").value = JSON.parse(sessionStorage.getItem("user")).email;
  const find = (k) => katalog.find((b) => b.kode === k);

  function renderCart() {
    tb.innerHTML = "";
    cart.forEach((c, i) => {
      const b = find(c.kode);
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${b.judul}</td><td>${rupiah(b.harga)}</td>
        <td><input type="number" class="qty" min="1" max="${b.stok}" value="${c.qty}" data-i="${i}"></td>
        <td>${rupiah(b.harga * c.qty)}</td>
        <td><button class="btn btn-small btn-danger" data-del="${i}">Hapus</button></td>`;
      tb.appendChild(tr);
    });
    if (!cart.length) tb.innerHTML = '<tr><td colspan="5" class="muted">Belum ada buku dipilih.</td></tr>';
    $("#total-cart").textContent = rupiah(cart.reduce((s, c) => s + find(c.kode).harga * c.qty, 0));
  }

  $("#btn-tambah").addEventListener("click", () => {
    const kode = sel.value, qty = parseInt($("#pilih-qty").value);
    if (!kode || !(qty > 0)) { showAlert("Pilih buku dan isi jumlah minimal 1.", "Peringatan"); return; }
    const b = find(kode), ada = cart.find((c) => c.kode === kode);
    const total = (ada ? ada.qty : 0) + qty;
    if (total > b.stok) { showAlert(`Stok "${b.judul}" hanya ${b.stok}.`, "Stok Tidak Cukup"); return; }
    ada ? (ada.qty = total) : cart.push({ kode, qty });
    renderCart();
  });
  tb.addEventListener("click", (e) => {
    if (e.target.dataset.del !== undefined) { cart.splice(+e.target.dataset.del, 1); renderCart(); }
  });
  tb.addEventListener("change", (e) => {
    if (e.target.classList.contains("qty")) {
      const c = cart[+e.target.dataset.i], b = find(c.kode);
      let q = parseInt(e.target.value);
      if (!(q > 0)) q = 1;
      if (q > b.stok) { q = b.stok; showAlert(`Stok maksimal ${b.stok}.`, "Stok Tidak Cukup"); }
      c.qty = q; renderCart();
    }
  });

  $("#form-order").addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = $("#o-nama").value.trim(), email = $("#o-email").value.trim(),
      telp = $("#o-telp").value.trim(), alamat = $("#o-alamat").value.trim();
    const err = $("#order-error");
    if (!cart.length) { err.textContent = "Pesanan masih kosong."; return; }
    if (!nama || !email || !telp || !alamat) { err.textContent = "Semua data pemesan wajib diisi."; return; }
    if (!validEmail(email)) { err.textContent = "Format email tidak valid."; return; }
    if (!/^(\+62|0)8\d{7,12}$/.test(telp)) { err.textContent = "Nomor telepon tidak valid (contoh 081234567890)."; return; }
    err.textContent = "";
    const orders = store.get("orders", []);
    const no = "DO" + new Date().getFullYear() + String(orders.length + 100).padStart(3, "0") + Math.floor(Math.random() * 90 + 10);
    const total = cart.reduce((s, c) => s + find(c.kode).harga * c.qty, 0);
    orders.unshift({
      no, nama, email, telp, alamat, ekspedisi: $("#o-ekspedisi").value, paket: $("#o-paket").value,
      metode: document.querySelector('input[name="metode"]:checked').value, total, status: 0,
      tanggal: new Date().toISOString().slice(0, 10),
      perjalanan: [{ waktu: new Date().toLocaleString("id-ID"), keterangan: "Pesanan dibuat dan menunggu pengemasan" }],
      items: cart.map((c) => ({ judul: find(c.kode).judul, qty: c.qty }))
    });
    store.set("orders", orders);
    cart = []; renderCart(); e.target.reset();
    showAlert(`Pesanan berhasil! Nomor Delivery Order Anda: ${no}`, "Pesanan Dibuat");
  });
  renderCart();
}

/* ===== TRACKING ===== */
if (page === "tracking") {
  $("#form-track").addEventListener("submit", (e) => {
    e.preventDefault();
    const no = $("#no-do").value.trim().toUpperCase(), err = $("#track-error"), box = $("#hasil-track");
    box.hidden = true;
    if (!no) { err.textContent = "Nomor Delivery Order wajib diisi."; return; }
    const d = getOrders().find((o) => o.no === no);
    if (!d) { err.textContent = "Nomor DO tidak ditemukan."; showAlert("Data dengan nomor " + no + " tidak ditemukan.", "Tidak Ditemukan"); return; }
    err.textContent = "";
    $("#t-no").textContent = d.no; $("#t-nama").textContent = d.nama;
    $("#t-ekspedisi").textContent = d.ekspedisi;
    const tgl = new Date(d.tanggal);
    $("#t-tanggal").textContent = isNaN(tgl) ? d.tanggal : tgl.toLocaleDateString("id-ID", { dateStyle: "long" });
    $("#t-paket").textContent = d.paket; $("#t-total").textContent = rupiah(d.total);
    $("#t-bar").style.width = ((d.status + 1) / STATUS.length) * 100 + "%";
    $("#t-bar").className = d.status === 4 ? "done" : "";
    $("#t-steps").innerHTML = STATUS.map((s, i) =>
      `<li class="${i < d.status ? "done" : i === d.status ? "current" : ""}">${s}</li>`).join("");
    $("#t-timeline").innerHTML = (d.perjalanan || []).slice().reverse()
      .map((p) => `<li><time>${p.waktu}</time><span>${p.keterangan}</span></li>`).join("");
    box.hidden = false;
  });
}

/* ===== RIWAYAT ===== */
if (page === "riwayat") {
  const tb = $("#tabel-riwayat tbody");
  tb.innerHTML = getOrders().map((o) => `<tr><td>${o.no}</td>
    <td>${isNaN(new Date(o.tanggal)) ? o.tanggal : new Date(o.tanggal).toLocaleDateString("id-ID")}</td><td>${o.nama}</td>
    <td>${o.metode || "-"}</td><td>${rupiah(o.total)}</td>
    <td><span class="badge ${o.status === 4 ? "ok" : "warn"}">${STATUS[o.status]}</span></td></tr>`).join("");
}
