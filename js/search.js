//////////////////////////////
// NigeNavi - search.js
// データ前処理・フィルタ層
//////////////////////////////

const SearchService = (() => {

  // =========================
  // メインフィルタ
  // =========================
  function filterSafePoints(points, userPos, mode) {

    if (!points || !userPos) return [];

    return points
      .map(p => enrich(p, userPos, mode))
      .filter(p => p !== null);
  }

  // =========================
  // データ整形
  // =========================
  function enrich(point, userPos, mode) {

    if (!point.lat || !point.lng) return null;

    return {
      ...point,
      mode: mode || "walk",
      elevation: point.elevation ?? 0,
      inundation: point.inundation ?? false,
      tsunamiTime: point.tsunamiTime ?? 999
    };
  }

  // =========================
  // 半径フィルタ（将来用）
  // =========================
  function filterByRadius(points, userPos, radiusKm) {

    const result = [];

    for (const p of points) {

      const d = LocationService.calcDistance(
        userPos.lat,
        userPos.lng,
        p.lat,
        p.lng
      );

      if (d <= radiusKm) {
        result.push({
          ...p,
          distanceKm: d
        });
      }
    }

    return result;
  }

  // =========================
  // 浸水除外（将来拡張）
  // =========================
  function excludeInundation(points) {
    return points.filter(p => !p.inundation);
  }

  // =========================
  // 距離ソート
  // =========================
  function sortByDistance(points) {
    return [...points].sort((a, b) => {
      return (a.distanceKm || 0) - (b.distanceKm || 0);
    });
  }

  // =========================
  // 公開API
  // =========================
  return {
    filterSafePoints,
    filterByRadius,
    excludeInundation,
    sortByDistance
  };

})();

window.SearchService = SearchService;