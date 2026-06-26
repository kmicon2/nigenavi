console.log("[NigeNavi] script loaded");

// グローバル参照チェック
window.addEventListener("load", () => {
  console.log("[NigeNavi] window load");

  const searchButton = document.getElementById("searchButton");
  const routeButton = document.getElementById("routeButton");
  const status = document.getElementById("locationStatus");
  const transportButtons = document.querySelectorAll(".transport-button");

  // -------------------------
  // DOMチェック（ここで止まらない）
  // -------------------------
  if (!searchButton || !routeButton) {
    console.error("❌ buttons not found", {
      searchButton,
      routeButton
    });
    return;
  }

  // -------------------------
  // 移動手段
  // -------------------------
  let selectedMode = "walk";

  transportButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      transportButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedMode = btn.dataset.mode;
    });
  });

  // -------------------------
  // GPS（安全呼び出し）
  // -------------------------
  let currentPosition = null;

  function startGPS() {
    if (!navigator.geolocation) {
      console.warn("GPS not supported");
      if (status) status.innerText = "位置情報非対応";
      return;
    }

    if (status) status.innerText = "位置情報取得中";

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        currentPosition = {
          coords: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }
        };

        console.log("[GPS OK]", currentPosition);

        if (status) status.innerText = "位置情報取得完了";
      },
      (err) => {
        console.error("[GPS ERROR]", err);

        if (status) status.innerText = "位置情報取得失敗";
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  }

  startGPS();

  // -------------------------
  // 検索
  // -------------------------
  searchButton.addEventListener("click", async () => {
    console.log("[SEARCH CLICK]");

    try {
      const res = await fetch("data/dummy_safepoints.json");
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("data invalid");
        return;
      }

      if (!currentPosition) {
        console.warn("no gps yet");
        UI?.showEmergencyFallback?.();
        return;
      }

      if (typeof SearchService === "undefined") {
        console.error("SearchService missing");
        return;
      }

      const results = SearchService.search(
        data,
        currentPosition,
        selectedMode
      );

      console.log("[RESULTS]", results);

      if (!results || results.length === 0) {
        UI?.showEmergencyFallback?.();
        return;
      }

      UI?.renderResults?.(results.slice(0, 3));

    } catch (e) {
      console.error("[SEARCH ERROR]", e);
      UI?.showEmergencyFallback?.();
    }
  });

  // -------------------------
  // ルート
  // -------------------------
  routeButton.addEventListener("click", () => {
    console.log("[ROUTE CLICK]");

    if (!window.__lastResults || !window.__lastResults.length) return;

    const t = window.__lastResults[0];

    if (!t?.lat || !t?.lng) return;

    window.open(
      `https://www.google.com/maps?q=${t.lat},${t.lng}`,
      "_blank"
    );
  });

  // results保持（UI依存切り離し）
  const originalRender = UI?.renderResults;
  if (originalRender) {
    UI.renderResults = function(results) {
      window.__lastResults = results;
      return originalRender.call(this, results);
    };
  }
});