const UI = {
  init() {
    this.cacheElements();
    this.bindEvents();
  },

  cacheElements() {
    this.locationStatus = document.getElementById("locationStatus");
    this.resultContainer = document.getElementById("resultContainer");
    this.searchButton = document.getElementById("searchButton");
  },

  bindEvents() {
    // 追加UIイベントがあればここ
  },

  updateLocation(position) {
    if (!this.locationStatus) return;

    const { latitude, longitude, accuracy } = position.coords;

    this.locationStatus.innerHTML = `
      📍 現在地取得完了<br>
      緯度: ${latitude.toFixed(5)}<br>
      経度: ${longitude.toFixed(5)}<br>
      精度: 約${Math.round(accuracy)}m
    `;
  },

  renderResults(results) {
    if (!this.resultContainer) return;

    this.resultContainer.innerHTML = results.map(r => {
      const riskColor =
        r.margin >= 10 ? "🟢" :
        r.margin >= 5 ? "🟡" :
        "🔴";

      return `
        <div class="card">
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="width:6px;height:40px;background:${
              r.margin >= 10 ? "#34c759" :
              r.margin >= 5 ? "#ffcc00" :
              "#ff3b30"
            };border-radius:3px;"></div>

            <div>
              <div style="font-weight:bold;font-size:16px;">
                ${riskColor} ${r.name}
              </div>

              <div style="font-size:14px;color:#555;">
                🏃 ${r.travelTime}分 / 🌊 ${r.tsunamiTime}分
              </div>

              <div style="font-size:12px;color:#888;">
                距離: ${r.distance.toFixed(2)}km | 標高差: ${r.elevation}m
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");
  },

  showEmergencyFallback() {
    if (!this.resultContainer) return;

    this.resultContainer.innerHTML = `
      <div class="card" style="border-left:6px solid #d60000;">
        <div style="color:#d60000;font-weight:bold;font-size:16px;">
          ⚠️ 安全な避難先が検出できませんでした
        </div>

        <div style="margin-top:10px;font-size:14px;line-height:1.6;">
          推奨行動：<br>
          ・その場から直ちに高台方向へ移動してください<br>
          ・海岸・河川から離れてください<br>
          ・可能であれば標高の高い建物へ避難してください
        </div>
      </div>
    `;
  }
};

// グローバル公開
window.UI = UI;

// 初期化
document.addEventListener("DOMContentLoaded", () => {
  UI.init();
});