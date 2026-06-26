//////////////////////////////
// NigeNavi - maps.js
// Phase1 仮ルート（Phase3でGoogle Maps化）
//////////////////////////////

const MapsService = (() => {

  let currentRoute = null;

  // =========================
  // 初期化
  // =========================
  function init() {
    bindEvents();
  }

  // =========================
  // イベント
  // =========================
  function bindEvents() {

    const btn = document.getElementById("routeButton");
    if (!btn) return;

    btn.addEventListener("click", openRoute);
  }

  // =========================
  // ルート設定
  // =========================
  function setRoute(userPos, destination) {

    if (!userPos || !destination) return;

    currentRoute = {
      from: userPos,
      to: destination,
      timestamp: Date.now()
    };

    enableRouteButton(true);
  }

  // =========================
  // Google Maps起動（仮）
  // =========================
  function openRoute() {

    if (!currentRoute) {
      alert("ルートがありません");
      return;
    }

    const { to } = currentRoute;

    // Phase1：目的地だけ表示（シンプル）
    const url =
      `https://www.google.com/maps?q=${to.lat},${to.lng}`;

    window.open(url, "_blank");
  }

  // =========================
  // ボタン制御
  // =========================
  function enableRouteButton(enabled) {

    const btn = document.getElementById("routeButton");
    if (!btn) return;

    btn.disabled = !enabled;
  }

  // =========================
  // 距離ベースルート（将来用）
  // =========================
  function generateRoute(userPos, dest) {

    const d = LocationService.calcDistance(
      userPos.lat,
      userPos.lng,
      dest.lat,
      dest.lng
    );

    return {
      distanceKm: d,
      mode: "direct"
    };
  }

  // =========================
  // 公開API
  // =========================
  return {
    init,
    setRoute,
    openRoute,
    enableRouteButton,
    generateRoute
  };

})();

window.MapsService = MapsService;