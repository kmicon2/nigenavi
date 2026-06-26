document.addEventListener("DOMContentLoaded", () => {
  console.log("NigeNavi initialized");

  const searchButton = document.getElementById("searchButton");

  let selectedMode = "walk";
  let currentResults = [];

  // 移動手段選択
  document.querySelectorAll(".transport-button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".transport-button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedMode = btn.dataset.mode;
    });
  });

  // 検索実行
  searchButton.addEventListener("click", async () => {
    console.log("search start");

    try {
      // GPS取得
      const position = await LocationService.getCurrentPosition();
      UI.updateLocation(position);

      // データ取得
      const data = await fetch("data/dummy_safepoints.json").then(r => r.json());

      // 検索・スコアリング
      const results = SearchService.search(data, position, selectedMode);

      currentResults = results;

      // =========================
      // 🔥 ここが今回の修正ポイント
      // =========================

      if (!results || results.length === 0) {
        UI.showEmergencyFallback();
        return;
      }

      // 通常表示（上位3件）
      UI.renderResults(results.slice(0, 3));

    } catch (error) {
      console.error("search error:", error);
      UI.showEmergencyFallback();
    }
  });

  // ルートボタン（Phase1は仮）
  const routeButton = document.getElementById("routeButton");
  routeButton.addEventListener("click", () => {
    if (!currentResults.length) return;

    const target = currentResults[0];

    const url = `https://www.google.com/maps?q=${target.lat},${target.lng}`;
    window.open(url, "_blank");
  });
});