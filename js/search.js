/**
 * ==========================================================
 * Nige Navi
 * search.js
 * 避難先検索モジュール
 * ==========================================================
 */

import { APP_CONFIG } from "./config.js";
import { getCurrentLocation } from "./location.js";

let safePoints = [];

/**
 * ダミー避難所データ読込
 */
export async function loadSafePoints() {

    try {

        const response = await fetch("./data/dummy_safepoints.json");

        if (!response.ok) {
            throw new Error("避難所データの読込に失敗しました。");
        }

        safePoints = await response.json();

    } catch (error) {

        console.error(error);

        safePoints = [];

    }

}

/**
 * 避難先検索
 * @param {string} transportMode
 * @returns {Array}
 */
export function searchSafePoints(transportMode) {

    const location = getCurrentLocation();

    if (
        location.latitude === null ||
        location.longitude === null
    ) {
        return [];
    }

    const searchRange =
        APP_CONFIG.searchRangeKm[transportMode];

    const speed =
        APP_CONFIG.movementSpeedKmh[transportMode];

    const candidates = [];

    for (const point of safePoints) {

        // 浸水区域は除外
        if (point.inundation === true) {
            continue;
        }

        // 標高判定
        if (
            point.elevation <
            point.requiredElevation +
                APP_CONFIG.safetyMarginMeters
        ) {
            continue;
        }

        const distance = calculateDistanceKm(
            location.latitude,
            location.longitude,
            point.latitude,
            point.longitude
        );

        if (distance > searchRange) {
            continue;
        }

        const travelMinutes =
            (distance / speed) * 60;

        const remainingMinutes =
            point.tsunamiArrivalMinutes -
            travelMinutes;

        if (remainingMinutes <= 0) {
            continue;
        }

        candidates.push({

            id: point.id,

            name: point.name,

            latitude: point.latitude,

            longitude: point.longitude,

            elevation: point.elevation,

            distanceKm: distance,

            travelMinutes,

            remainingMinutes,

            safetyLevel:
                getSafetyLevel(remainingMinutes)

        });

    }

    candidates.sort((a, b) => {

        if (
            b.remainingMinutes !==
            a.remainingMinutes
        ) {

            return (
                b.remainingMinutes -
                a.remainingMinutes
            );

        }

        return (
            a.distanceKm -
            b.distanceKm
        );

    });

    return candidates.slice(
        0,
        APP_CONFIG.maxCandidates
    );

}

/**
 * 安全レベル判定
 */
function getSafetyLevel(remainingMinutes) {

    if (remainingMinutes >= 10) {
        return "safe";
    }

    if (remainingMinutes >= 5) {
        return "warning";
    }

    return "danger";

}

/**
 * 直線距離(km)
 */
function calculateDistanceKm(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R = 6371;

    const dLat =
        toRadians(lat2 - lat1);

    const dLon =
        toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) *
            Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;

}

function toRadians(value) {

    return (
        value *
        Math.PI /
        180
    );

}