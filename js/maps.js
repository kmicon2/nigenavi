/**
 * ==========================================================
 * Nige Navi
 * maps.js
 * Google Maps 案内モジュール
 * ==========================================================
 */

import { APP_CONFIG, UI_TEXT } from "./config.js";

let selectedDestination = null;

/**
 * 選択中の避難先を設定
 * @param {Object} destination
 */
export function setSelectedDestination(destination) {

    selectedDestination = destination;

    const guideButton =
        document.getElementById("guideButton");

    if (guideButton) {

        guideButton.disabled = false;

    }

}

/**
 * 選択中の避難先取得
 */
export function getSelectedDestination() {

    return selectedDestination;

}

/**
 * 選択解除
 */
export function clearSelectedDestination() {

    selectedDestination = null;

    const guideButton =
        document.getElementById("guideButton");

    if (guideButton) {

        guideButton.disabled = true;

    }

}

/**
 * Google Maps起動
 */
export async function startNavigation() {

    if (!selectedDestination) {

        const ui = await import("./ui.js");

        ui.showError(
            UI_TEXT.selectDestination
        );

        return;

    }

    if (
        selectedDestination.latitude == null ||
        selectedDestination.longitude == null
    ) {

        const ui = await import("./ui.js");

        ui.showError(
            "目的地情報が不正です。"
        );

        return;

    }

    const destination =
        `${selectedDestination.latitude},${selectedDestination.longitude}`;

    const url =
        APP_CONFIG.googleMapsBaseUrl +
        encodeURIComponent(destination);

    window.location.href = url;

}

/**
 * 案内開始ボタン初期化
 */
export function initializeNavigationButton() {

    const guideButton =
        document.getElementById("guideButton");

    if (!guideButton) {

        return;

    }

    guideButton.disabled = true;

    guideButton.addEventListener(
        "click",
        () => {

            startNavigation();

        }
    );

}