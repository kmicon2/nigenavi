document.addEventListener("DOMContentLoaded", () => {
  console.log("NigeNavi initialized");

  const searchButton = document.getElementById("searchButton");
  const routeButton = document.getElementById("routeButton");

  let selectedMode = "walk";
  let currentResults = [];

  // -------------------------
  // 移動手段選択
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
  // 検索処理
  // -------------------------
  searchButton.addEventListener("click", async () => {
    console.log("search start");

    try {
      // GPS取得
      const position = await LocationService.getCurrentPosition();
      UI.updateLocation(position);

      // データ取得
      const response = await fetch("data/dummy_safepoints.json");
      const data = await response.json();

      // 検索処理
      let results = SearchService.search(data, position, selectedMode);

      // -------------------------
      // 🧠 防御的変換（ここ重要）
      // -------------------------
      if (!Array.isArray(results)) {
        console.warn("results is not array:", results);
        results = [];
      }

      currentResults = results;

      console.log("RESULTS:", results);
      console.log("LENGTH:", results.length);

      // -------------------------
      // 🔥 0件分岐（今回の本体）
      // -------------------------
      if (results.length === 0) {
        UI.showEmergencyFallback();
        return;
      }

      // -------------------------
      // 通常表示（最大3件）
      // -------------------------
      UI.renderResults(results.slice(0, 3));

    } catch (error) {
      console.error("search error:", error);

      // エラー時も緊急表示
      UI.showEmergencyFallback();
    }
  });

  // -------------------------
  // ルート表示（Phase1仮）
  // -------------------------
  routeButton.addEventListener("click", () => {
    if (!currentResults || currentResults.length === 0) return;

    const target = currentResults[0];

    if (!target.lat || !target.lng) {
      console.warn("invalid target:", target);
      return;
    }

    const url = `https://www.google.com/maps?q=${target.lat},${target.lng}`;
    window.open(url, "_blank");
  });
});