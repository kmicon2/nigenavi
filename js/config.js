/**
 * ==========================================================
 * Nige Navi
 * config.js
 * アプリ共通設定
 * ==========================================================
 */

/**
 * アプリ全体設定
 */
export const APP_CONFIG = {

    appName: "Nige Navi",

    version: "0.1.0",

    /**
     * 検索距離（km）
     */
    searchRangeKm: {

        walk: 3,

        bike: 7,

        car: 15

    },

    /**
     * 平均移動速度（km/h）
     */
    movementSpeedKmh: {

        walk: 4,

        bike: 15,

        car: 40

    },

    /**
     * 標高安全マージン（m）
     */
    safetyMarginMeters: 5,

    /**
     * 最大表示件数
     */
    maxCandidates: 3,

    /**
     * Google Maps URL
     */
    googleMapsBaseUrl:
        "https://www.google.com/maps/dir/?api=1&destination=",

    /**
     * GPS取得設定
     */
    locationOptions: {

        enableHighAccuracy: true,

        timeout: 10000,

        maximumAge: 0

    }

};

/**
 * 移動手段
 */
export const TRANSPORT_MODE = Object.freeze({

    WALK: "walk",

    BIKE: "bike",

    CAR: "car"

});

/**
 * UI表示文言
 */
export const UI_TEXT = Object.freeze({

    locationLoading:
        "位置情報取得中...",

    locationError:
        "位置情報の取得に失敗しました",

    noTransportSelected:
        "移動手段を選択してください。",

    noCandidate:
        "安全な避難候補が見つかりませんでした。直ちに周囲の高台や頑丈な建物へ避難してください。",

    selectDestination:
        "避難先を選択してください。"

});