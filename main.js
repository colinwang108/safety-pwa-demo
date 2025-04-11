let db;
const request = indexedDB.open("SafetyDB", 2);
request.onupgradeneeded = (event) => {
  db = event.target.result;
  if (!db.objectStoreNames.contains("forms")) {
    db.createObjectStore("forms", { autoIncrement: true });
  }
};
request.onsuccess = (event) => {
  db = event.target.result;
  document.getElementById("status").innerText = "📦 本機資料庫已啟用";
};

let photoData = null;

document.getElementById("photoInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    photoData = evt.target.result;
    const preview = document.getElementById("preview");
    preview.src = photoData;
    preview.style.display = "block";
  };
  reader.readAsDataURL(file);
});

document.getElementById("inspectionForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    location: e.target.location.value,
    item: e.target.item.value,
    notes: e.target.notes.value,
    photo: photoData,
    timestamp: new Date()
  };
  const tx = db.transaction("forms", "readwrite");
  tx.objectStore("forms").add(data);
  alert("📸 表單與照片已儲存至本機（離線）");
  e.target.reset();
  document.getElementById("preview").style.display = "none";
  photoData = null;
});

document.getElementById("syncBtn").addEventListener("click", () => {
  const tx = db.transaction("forms", "readonly");
  const store = tx.objectStore("forms");
  const req = store.getAll();
  req.onsuccess = () => {
    console.log("🟢 同步以下資料到伺服器：", req.result);
    alert(`已模擬上傳 ${req.result.length} 筆資料（含照片 base64）`);
  };
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log("✅ Service Worker 註冊成功"))
    .catch(err => console.error("❌ Service Worker 註冊失敗", err));
}