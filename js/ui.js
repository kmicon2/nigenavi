//////////////////////////////
// NigeNavi - ui.js
// UI制御・状態管理
//////////////////////////////

const UI = (() => {

  // =========================
  // 初期化
  // =========================
  function init() {
    setEmptyState();
  }

  // =========================
  // 空状態
  // =========================
  function setEmptyState() {

    const el = document.getElementById("resultContainer");
    if (!el) return;

    el.innerHTML = `
      <div class="empty-card">
        検索すると避難候補が表示されます
      </div>
    `;
  }

  // =========================
  // ローディング
  // =========================
  function setLoadingState() {

    const el = document.getElementById("resultContainer");
    if (!el) return;

    el.innerHTML = `
      <div class="empty-card">
        検索中...
      </div>
    `;
  }

  // =========================
  // エラー表示
  // =========================
  function setErrorState(message) {

    const el = document.getElementById("resultContainer");
    if (!el) return;

    el.innerHTML = `
      <div class="empty-card" style="color:#ff3b30;">
        ${message || "エラーが発生しました"}
      </div>
    `;
  }

  // =========================
  // GPS表示更新
  // =========================
  function updateLocationStatus(text, loading = false) {

    const el = document.getElementById("locationStatus");
    if (!el) return;

    el.textContent = text;

    if (loading) {
      el.classList.add("loading");
    } else {
      el.classList.remove("loading");
    }
  }

  // =========================
  // 移動手段UI
  // =========================
  function updateTransportUI(mode) {

    document.querySelectorAll(".transport-button")
      .forEach(btn => {
        btn.classList.toggle("active", btn.dataset.mode === mode);
      });
  }

  // =========================
  // ボタン制御
  // =========================
  function setSearchButton(enabled) {

    const btn = document.getElementById("searchButton");
    if (!btn) return;

    btn.disabled = !enabled;
  }

  // =========================
  // 結果描画
  // =========================
  function renderResults(results) {

    const container = document.getElementById("resultContainer");
    if (!container) return;

    container.innerHTML = "";

    if (!results.length) {
      setEmptyState();
      return;
    }

    results.forEach(r => {

      const card = document.createElement("div");
      card.className = "card";

      const color =
        r.riskLevel === "green" ? "#34c759" :
        r.riskLevel === "yellow" ? "#ffcc00" :
        r.riskLevel === "red" ? "#ff3b30" : "#ccc";

      card.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:6px; height:40px; background:${color}; border-radius:3px;"></div>

          <div style="flex:1;">
            <div style="font-weight:600;">${r.name}</div>

            <div style="font-size:12px; color:#666;">
              🏃 ${r.travelTime}分 / 🌊 ${r.tsunamiTime}分
            </div>

            <div style="font-size:12px; color:#666;">
              距離 ${r.distanceKm}km / 標高差 ${r.elevationMargin}m
            </div>

            <div style="font-size:12px; font-weight:600;">
              余裕 ${r.marginMinutes}分
            </div>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  // =========================
  // 公開API
  // =========================
  return {
    init,
    setEmptyState,
    setLoadingState,
    setErrorState,
    updateLocationStatus,
    updateTransportUI,
    setSearchButton,
    renderResults
  };

})();

window.UI = UI;