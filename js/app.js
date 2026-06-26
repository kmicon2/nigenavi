document.addEventListener("DOMContentLoaded", async () => {
  console.log("NigeNavi start");

  const searchButton = document.getElementById("searchButton");
  const routeButton = document.getElementById("routeButton");
  const status = document.getElementById("locationStatus");

  let selectedMode = "walk";
  let currentResults = [];
  let currentPosition = null;

  // -------------------------
  // 移動手段（横3択）
  // -------------------------
  document.querySelectorAll(".transport-button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".transport-button").forEach(b => {
        b.classList.remove("active");
      });

      btn.classList.add("active");
      selectedMode = btn.dataset.mode;
    });
  });

  // -------------------------
  // GPS初期取得（必ず完結）
  // -------------------------
  async function initGPS() {
    try {
      if (status) status.innerText = "位置情報取得中";

      const position = await LocationService.getCurrentPosition();

      currentPosition = position;

      if (status) status.innerText = "位置情報取得完了";

      console.log("GPS OK", position);

    } catch (err) {
      console.error("GPS ERROR", err);

      if (status) status.innerText = "位置情報取得失敗";

      currentPosition = null;
    }
  }

  await initGPS();

  // -------------------------
  // 検索処理
  // -------------------------
  searchButton.addEventListener("click", async () => {
    console.log("search start");

    try {
      const res = await fetch("data/dummy_safepoints.json");
      const data = await res.json();

      if (!currentPosition) {
        console.warn("no gps");
        UI.showEmergencyFallback();
        return;
      }

      let results = SearchService.search(
        data,
        currentPosition,
        selectedMode
      );

      if (!Array.isArray(results)) {
        results = [];
      }

      currentResults = results;

      if (results.length === 0) {
        UI.showEmergencyFallback();
        return;
      }

      UI.renderResults(results.slice(0, 3));

    } catch (err) {
      console.error("search error", err);
      UI.showEmergencyFallback();
    }
  });

  // -------------------------
  // ルート表示
  // -------------------------
  routeButton.addEventListener("click", () => {
    if (!currentResults.length) return;

    const t = currentResults[0];

    if (!t.lat || !t.lng) return;

    const url = `https://www.google.com/maps?q=${t.lat},${t.lng}`;
    window.open(url, "_blank");
  });
});