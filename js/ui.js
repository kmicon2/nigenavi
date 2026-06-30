/**
 * ==========================================================
 * Nige Navi
 * ui.js
 * Part 1 / 4
 * UI描画モジュール
 * ==========================================================
 */

import { UI_TEXT } from "./config.js";
import {
    setSelectedDestination,
    clearSelectedDestination
} from "./maps.js";

let selectedCard = null;

/**
 * 検索結果を描画
 * @param {Array} candidates
 */
export function renderSearchResults(candidates) {

    const messageArea =
        document.getElementById("resultMessage");

    const listArea =
        document.getElementById("resultList");

    messageArea.innerHTML = "";
    listArea.innerHTML = "";

    clearSelectedDestination();

    selectedCard = null;

    if (!Array.isArray(candidates) || candidates.length === 0) {

        showMessage(
            UI_TEXT.noCandidate,
            "error"
        );

        return;
    }

    candidates.forEach(candidate => {

        const card =
            createResultCard(candidate);

        listArea.appendChild(card);

    });

}

/**
 * メッセージ表示
 */
export function showMessage(
    message,
    type = "success"
) {

    const messageArea =
        document.getElementById("resultMessage");

    messageArea.innerHTML = "";

    const card =
        document.createElement("div");

    card.className =
        `message-card ${type}`;

    const text =
        document.createElement("p");

    text.className =
        "message-text";

    text.textContent =
        message;

    card.appendChild(text);

    messageArea.appendChild(card);

}
/**
 * ==========================================================
 * Nige Navi
 * ui.js
 * Part 2 / 4
 * ==========================================================
 */

/**
 * 候補カード生成
 * @param {Object} candidate
 * @returns {HTMLElement}
 */
function createResultCard(candidate) {

    const card =
        document.createElement("div");

    card.className =
        `result-card ${candidate.safetyLevel}`;

    card.dataset.id = candidate.id;

    card.tabIndex = 0;

    // タイトル
    const title =
        document.createElement("div");

    title.className = "result-title";
    title.textContent = candidate.name;

    // アイコン
    const icons =
        document.createElement("div");

    icons.className = "result-icons";
    icons.textContent = "🏃　🌊";

    // 情報
    const info =
        document.createElement("div");

    info.className = "result-info";

    info.appendChild(
        createInfoItem(
            `標高 ${candidate.elevation.toFixed(1)} m`
        )
    );

    info.appendChild(
        createInfoItem(
            `距離 ${candidate.distanceKm.toFixed(2)} km`
        )
    );

    info.appendChild(
        createInfoItem(
            `移動 ${candidate.travelMinutes.toFixed(1)} 分`
        )
    );

    info.appendChild(
        createInfoItem(
            `余裕 ${candidate.remainingMinutes.toFixed(1)} 分`
        )
    );

    card.appendChild(title);
    card.appendChild(icons);
    card.appendChild(info);

    card.addEventListener("click", () => {

        selectCard(card, candidate);

    });

    card.addEventListener("keydown", event => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            selectCard(card, candidate);

        }

    });

    return card;

}

/**
 * 情報表示項目
 */
function createInfoItem(text) {

    const item =
        document.createElement("span");

    item.textContent = text;

    return item;

}
/**
 * ==========================================================
 * Nige Navi
 * ui.js
 * Part 3 / 4
 * ==========================================================
 */

/**
 * 候補選択
 * @param {HTMLElement} card
 * @param {Object} candidate
 */
function selectCard(card, candidate) {

    // 前回選択解除
    if (selectedCard) {

        selectedCard.classList.remove(
            "selected"
        );

    }

    // 新しいカード選択
    selectedCard = card;

    selectedCard.classList.add(
        "selected"
    );

    // Google Mapsモジュールへ通知
    setSelectedDestination(candidate);

}

/**
 * 検索結果クリア
 */
export function clearSearchResults() {

    const messageArea =
        document.getElementById(
            "resultMessage"
        );

    const listArea =
        document.getElementById(
            "resultList"
        );

    messageArea.innerHTML = "";

    listArea.innerHTML = "";

    clearSelectedDestination();

    selectedCard = null;

}

/**
 * 読み込み表示
 */
export function showLoading() {

    showMessage(
        "検索中...",
        "success"
    );

}

/**
 * エラー表示
 */
export function showError(message) {

    showMessage(
        message,
        "error"
    );

}
/**
 * ==========================================================
 * Nige Navi
 * ui.js
 * Part 4 / 4
 * ==========================================================
 */

/**
 * 検索結果件数表示
 * @param {number} count
 */
export function showResultCount(count) {

    if (count <= 0) {
        return;
    }

    showMessage(
        `${count}件の避難候補が見つかりました。`,
        "success"
    );

}

/**
 * 選択中のカード取得
 * @returns {HTMLElement|null}
 */
export function getSelectedCard() {

    return selectedCard;

}

/**
 * 候補カード有無
 * @returns {boolean}
 */
export function hasSearchResults() {

    const listArea =
        document.getElementById("resultList");

    return listArea.children.length > 0;

}

/**
 * UI初期化
 */
export function initializeUI() {

    clearSearchResults();

}

/**
 * リセット
 */
export function resetUI() {

    clearSearchResults();

}

/**
 * ==========================================================
 * End of File
 * ==========================================================
 */