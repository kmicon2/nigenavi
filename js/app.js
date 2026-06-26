//////////////////////////////
// NigeNavi - app.js
// 全体制御・起動エンジン
//////////////////////////////

const App = (() => {

  let userPosition = null;
  let selectedMode = "walk";

  // =========================
  // 初期化
  // =========================
  function init() {
    bindEvents();
    initLocation();
    UI.init();
  }

  // =========================
  // イベント登録
  // =========================
  function bindEvents() {

    document.querySelectorAll(".transport-button")
      .forEach(btn => {
        btn.addEventListener("click", () => {
          setMode(btn.dataset.mode);
        });
      });

    const searchBtn = document.getElementById("searchButton");

    if (searchBtn) {
      searchBtn.addEventListener("click", handleSearch);
    }
  }

  // =========================
  // GPS取得
  // =========================
  async function initLocation() {

    UI.updateLocationStatus("GPS取得中...", true);

    try {

      const pos = await LocationService.getCurrentPosition();

      userPosition = pos;

      UI.updateLocationStatus(
        `取得完了（精度 ${Math.round(pos.accuracy)}m）`
      );

    } catch (e) {

      console.error(e);

      UI.updateLocationStatus("GPS取得に失敗しました");
    }
  }

  // =========================
  // 移動手段
  // =========================
  function setMode(mode) {

    selectedMode = mode;

    UI.updateTransportUI(mode);
  }

  // =========================
  // 検索処理
  // =========================
  async function handleSearch() {

    if (!userPosition) {
      UI.setErrorState("現在地が取得できていません");
      return;
    }

    UI.setLoadingState();

    try {

      const res = await fetch("data/dummy_safepoints.json");
      const points = await res.json();

      // データ整形
      const enriched = SearchService.filterSafePoints(
        points,
        userPosition,
        selectedMode
      );

      // スコアリング
      const results =
        ScoringService.evaluateCandidates(userPosition, enriched);

      UI.renderResults(results);

    } catch (e) {

      console.error(e);

      UI.setErrorState("検索に失敗しました");
    }
  }

  // =========================
  // 公開API
  // =========================
  return {
    init
  };

})();

// =========================
// 起動
// =========================
window.addEventListener("DOMContentLoaded", () => {
  App.init();
});