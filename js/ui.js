class UI {
  constructor() {
    this.resultList = document.getElementById("resultList");
    this.locationStatus = document.getElementById("locationStatus");
  }

  // -------------------------
  // 現在地表示（市区町村 or フォールバック）
  // -------------------------
  async updateLocation(position) {
    if (!this.locationStatus) return;

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );

      const data = await res.json();

      const city =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.county ||
        "現在地";

      this.locationStatus.innerText = city;

    } catch (e) {
      console.warn("reverse geocode failed", e);
      this.locationStatus.innerText = "現在地取得完了";
    }
  }

  // -------------------------
  // 結果表示（必ず描画保証）
  // -------------------------
  renderResults(results) {
    if (!this.resultList) {
      console.error("resultList not found");
      return;
    }

    if (!Array.isArray(results) || results.length === 0) {
      this.showEmergencyFallback();
      return;
    }

    this.resultList.innerHTML = "";

    results.forEach((r) => {
      const div = document.createElement("div");
      div.className = "result-card";

      div.innerHTML = `
        <div>${r.name ?? "不明"}</div>
        <div>標高: ${r.elevation ?? "-"} m</div>
        <div>距離: ${r.distance?.toFixed?.(2) ?? "-"} km</div>
        <div>到達時間: ${r.travelTime ?? "-"} 分</div>
      `;

      this.resultList.appendChild(div);
    });
  }

  // -------------------------
  // 緊急表示（必ず出る）
  // -------------------------
  showEmergencyFallback() {
    if (!this.resultList) return;

    this.resultList.innerHTML = `
      <div class="emergency">
        ⚠️ 安全な避難先が検出できませんでした<br><br>

        推奨行動：<br>
        ・その場から直ちに高台方向へ移動してください<br>
        ・海岸・河川から離れてください<br>
        ・可能であれば標高の高い建物へ避難してください
      </div>
    `;
  }
}

window.UI = new UI();