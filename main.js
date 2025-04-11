let db;
const request = indexedDB.open("SafetyDB", 1);
request.onupgradeneeded = (event) => {
  db = event.target.result;
  db.createObjectStore("forms", { autoIncrement: true });
};
request.onsuccess = (event) => {
  db = event.target.result;
  document.getElementById("status").innerText = "📦 本機資料庫已啟用";
};

document.getElementById("inspectionForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    location: e.target.location.value,
    item: e.target.item.value,
    notes: e.target.notes.value,
    timestamp: new Date()
  };
  const tx = db.transaction("forms", "readwrite");
  tx.objectStore("forms").add(data);
  alert("已儲存至本機（離線）");
  e.target.reset();
});

document.getElementById("syncBtn").addEventListener("click", () => {
  const tx = db.transaction("forms", "readonly");
  const store = tx.objectStore("forms");
  const req = store.getAll();
  req.onsuccess = () => {
    console.log("🟢 同步以下資料到伺服器：", req.result);
    alert(`已模擬上傳 ${req.result.length} 筆資料`);
  };
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log("✅ Service Worker 註冊成功"))
    .catch(err => console.error("❌ Service Worker 註冊失敗", err));
}