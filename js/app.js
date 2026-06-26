document.addEventListener("DOMContentLoaded", async () => {
  console.log("NigeNavi initialized");

  const searchButton = document.getElementById("searchButton");
  const routeButton = document.getElementById("routeButton");

  let selectedMode = "walk";
  let currentResults = [];
  let currentPosition = null;

  // -------------------------
  // 移動手段
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
  // 🔥 起動時GPS取得
  // -------------------------
  async function initGPS() {
    try {
      document.getElementById("locationStatus").innerText = "📡 位置情報取得中...";

      const position = await LocationService.getCurrentPosition();

      currentPosition = position;

      UI.updateLocation(position);

      console.log("GPS READY");
    } catch (e) {
      console.error("GPS INIT ERROR:", e);

      document.getElementById("locationStatus").innerText =
        "⚠️ 位置情報取得に失敗しました";
    }
  }

  // 起動直後に実行
  await initGPS();

  // -------------------------
  // 検索（GPS再取得なし）
  // -------------------------
  searchButton.addEventListener("click", async () => {
    console.log("SEARCH START");

    try {
      const response = await fetch("data/dummy_safepoints.json");
      const data = await response.json();

      let results = SearchService.search(
        data,
        currentPosition,
        selectedMode
      );

      if (!Array.isArray(results)) results = [];

      currentResults = results;

      if (results.length === 0) {
        UI.showEmergencyFallback();
        return;
      }

      UI.renderResults(results.slice(0, 3));

    } catch (error) {
      console.error(error);
      UI.showEmergencyFallback();
    }
  });

  // -------------------------
  // ルート
  // -------------------------
  routeButton.addEventListener("click", () => {
    if (!currentResults.length) return;

    const target = currentResults[0];

    const url = `https://www.google.com/maps?q=${target.lat},${target.lng}`;
    window.open(url, "_blank");
  });
});