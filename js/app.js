console.log("NigeNavi app.js loaded");

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM ready");

  const searchButton = document.getElementById("searchButton");
  const routeButton = document.getElementById("routeButton");
  const status = document.getElementById("locationStatus");

  let selectedMode = "walk";
  let currentResults = [];
  let currentPosition = null;

  // -------------------------
  // DOMチェック（ここ重要）
  // -------------------------
  if (!searchButton || !routeButton) {
    console.error("BUTTON NOT FOUND", {
      searchButton,
      routeButton
    });
    return;
  }

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
  // GPS取得
  // -------------------------
  async function initGPS() {
    try {
      if (status) status.innerText = "位置情報取得中";

      const position = await LocationService.getCurrentPosition();

      currentPosition = position;

      if (status) status.innerText = "位置情報取得完了";

      console.log("GPS OK");

    } catch (err) {
      console.error("GPS ERROR", err);

      if (status) status.innerText = "位置情報取得失敗";

      currentPosition = null;
    }
  }

  await initGPS();

  // -------------------------
  // 検索ボタン（ここが本体）
  // -------------------------
  searchButton.addEventListener("click", async () => {
    console.log("SEARCH CLICKED");

    try {
      const res = await fetch("data/dummy_safepoints.json");
      const data = await res.json();

      if (!currentPosition) {
        console.warn("NO GPS");
        UI.showEmergencyFallback();
        return;
      }

      let results = SearchService.search(
        data,
        currentPosition,
        selectedMode
      );

      console.log("RESULTS:", results);

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
      console.error("SEARCH ERROR", err);
      UI.showEmergencyFallback();
    }
  });

  // -------------------------
  // ルート表示
  // -------------------------
  routeButton.addEventListener("click", () => {
    console.log("ROUTE CLICKED");

    if (!currentResults.length) return;

    const t = currentResults[0];

    if (!t?.lat || !t?.lng) return;

    window.open(
      `https://www.google.com/maps?q=${t.lat},${t.lng}`,
      "_blank"
    );
  });
});