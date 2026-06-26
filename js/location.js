//////////////////////////////
// NigeNavi - location.js
// GPS取得・位置情報管理
//////////////////////////////

const LocationService = (() => {

  // =========================
  // 現在地取得
  // =========================
  function getCurrentPosition() {

    return new Promise((resolve, reject) => {

      if (!navigator.geolocation) {
        reject(new Error("Geolocation未対応"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {

          const { latitude, longitude, accuracy } = pos.coords;

          resolve({
            lat: latitude,
            lng: longitude,
            accuracy: accuracy || 0,
            elevation: 0 // Phase2で実装
          });
        },

        (err) => {
          reject(err);
        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  // =========================
  // 距離計算（Haversine）
  // =========================
  function calcDistance(lat1, lng1, lat2, lng2) {

    const R = 6371; // 地球半径 km

    const dLat = deg2rad(lat2 - lat1);
    const dLng = deg2rad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // =========================
  // 度→ラジアン
  // =========================
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // =========================
  // 公開API
  // =========================
  return {
    getCurrentPosition,
    calcDistance
  };

})();

window.LocationService = LocationService;