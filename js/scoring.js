//////////////////////////////
// NigeNavi - scoring.js
// 避難安全スコアリング
//////////////////////////////

const ScoringService = (() => {

  // =========================
  // メイン評価
  // =========================
  function evaluateCandidates(userPos, candidates) {

    if (!userPos || !candidates) return [];

    const results = [];

    for (const c of candidates) {

      const evaluated = evaluateSingle(userPos, c);

      if (evaluated.isValid) {
        results.push({
          ...c,
          ...evaluated
        });
      }
    }

    // 余裕時間順でソート
    results.sort((a, b) => b.marginMinutes - a.marginMinutes);

    // 上位3件
    return results.slice(0, CONFIG.UI.MAX_RESULTS);
  }

  // =========================
  // 単体評価
  // =========================
  function evaluateSingle(userPos, c) {

    const distanceKm = LocationService.calcDistance(
      userPos.lat,
      userPos.lng,
      c.lat,
      c.lng
    );

    const speed = CONFIG.SPEED[c.mode || "walk"] || 5;

    const travelTime = (distanceKm / speed) * 60;

    const tsunamiTime = c.tsunamiTime ?? 999;

    const elevationMargin =
      (c.elevation ?? 0) - (userPos.elevation ?? 0);

    // =========================
    // 除外条件
    // =========================

    // 浸水エリア
    if (CONFIG.SAFETY.EXCLUDE_IF_INUNDATION && c.inundation) {
      return { isValid: false };
    }

    // 標高不足
    if (elevationMargin < CONFIG.SAFETY.MIN_ELEVATION_MARGIN) {
      return { isValid: false };
    }

    // 津波時間に間に合わない
    if (CONFIG.SAFETY.REQUIRE_TSUNAMI_TIME_CHECK) {
      if (travelTime >= tsunamiTime) {
        return { isValid: false };
      }
    }

    // =========================
    // 余裕時間
    // =========================
    const marginMinutes = tsunamiTime - travelTime;

    return {
      isValid: true,
      distanceKm: round(distanceKm),
      travelTime: round(travelTime),
      tsunamiTime,
      elevationMargin: round(elevationMargin),
      marginMinutes: round(marginMinutes),
      riskLevel: getRiskLevel(marginMinutes)
    };
  }

  // =========================
  // リスク判定
  // =========================
  function getRiskLevel(min) {

    if (min >= CONFIG.UI.RISK_LEVELS.GREEN) return "green";
    if (min >= CONFIG.UI.RISK_LEVELS.YELLOW) return "yellow";
    if (min >= CONFIG.UI.RISK_LEVELS.RED) return "red";

    return "invalid";
  }

  // =========================
  // 丸め
  // =========================
  function round(v) {
    return Math.round(v * 10) / 10;
  }

  // =========================
  // 公開API
  // =========================
  return {
    evaluateCandidates
  };

})();

window.ScoringService = ScoringService;