document.addEventListener("DOMContentLoaded", () => {
  console.log("NigeNavi initialized");

  const searchButton = document.getElementById("searchButton");
  const routeButton = document.getElementById("routeButton");

  let selectedMode = "walk";
  let currentResults = [];

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
  // 検索
  // -------------------------
  searchButton.addEventListener("click", async () => {
    console.log("=== SEARCH START ===");

    try {
      // UI即時反映（固まってない確認用）
      document.getElementById("locationStatus").innerText = "📡 GPS取得中...";

      console.log("GPS request start");

      // -------------------------
      // GPS（安全タイムアウト付き）
      // -------------------------
      const position = await Promise.race([
        LocationService.getCurrentPosition(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("GPS TIMEOUT")), 12000)
        )
      ]);

      console.log("GPS OK:", position);

      UI.updateLocation(position);

      // -------------------------
      // データ取得
      // -------------------------
      const response = await fetch("data/dummy_safepoints.json");
      const data = await response.json();

      console.log("DATA LOADED");

      // -------------------------
      // 検索
      // -------------------------
      let results = SearchService.search(data, position, selectedMode);

      if (!Array.isArray(results)) {
        console.warn("results invalid:", results);
        results = [];
      }

      currentResults = results;

      console.log("RESULTS:", results);

      // -------------------------
      // 0件処理（確実に通す）
      // -------------------------
      if (results.length === 0) {
        console.log("NO RESULTS → EMERGENCY MODE");
        UI.showEmergencyFallback();
        return;
      }

      // -------------------------
      // 通常表示
      // -------------------------
      UI.renderResults(results.slice(0, 3));

    } catch (error) {
      console.error("SEARCH ERROR:", error);

      // どんな失敗でも必ず表示
      UI.showEmergencyFallback();
    }
  });

  // -------------------------
  // ルート
  // -------------------------
  routeButton.addEventListener("click", () => {
    if (!currentResults || currentResults.length === 0) {
      console.log("NO ROUTE TARGET");
      return;
    }

    const target = currentResults[0];

    if (!target.lat || !target.lng) {
      console.warn("invalid target", target);
      return;
    }

    const url = `https://www.google.com/maps?q=${target.lat},${target.lng}`;
    window.open(url, "_blank");
  });
});