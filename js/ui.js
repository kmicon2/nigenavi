class UI {
  constructor() {
    this.locationStatus = document.getElementById("locationStatus");
    this.resultList = document.getElementById("resultList");
  }

  // -------------------------
  // 現在地表示（市区町村化）
  // -------------------------
  async updateLocation(position) {
    if (!this.locationStatus) return;

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    try {
      // 逆ジオコーディング（Nominatim）
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

      this.locationStatus.innerHTML = `
        📍 ${city}
      `;
    } catch (e) {
      console.warn("reverse geocode failed", e);

      this.locationStatus.innerHTML = `
        📍 現在地取得完了
      `;
    }
  }

  // -------------------------
  // 結果表示
  // -------------------------
  renderResults(results) {
    if (!this.resultList) return;

    this.resultList.innerHTML = results
      .map(
        (r) => `
        <div class="result-card">
          <h3>${r.name}</h3>
          <p>🏔 標高: ${r.elevation}m</p>
          <p>⏱ 到達時間: ${r.travelTime ?? "-"}分</p>
          <p>🌊 津波到達: ${r.tsunamiTime ?? "-"}分</p>
          <p>📏 距離: ${r.distance?.toFixed(2) ?? "-"}km</p>
        </div>
      `
      )
      .join("");
  }

  // -------------------------
  // 緊急表示
  // -------------------------
  showEmergencyFallback() {
    if (!this.resultList) return;

    this.resultList.innerHTML = `
      <div class="emergency">
        ⚠️ 安全な避難先が検出できませんでした<br><br>

        <b>推奨行動：</b><br>
        ・その場から直ちに高台方向へ移動してください<br>
        ・海岸・河川から離れてください<br>
        ・可能であれば標高の高い建物へ避難してください
      </div>
    `;
  }
}

window.UI = new UI();