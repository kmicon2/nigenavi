/**
 * ==========================================================
 * Nige Navi
 * location.js
 * 現在地取得モジュール
 * ==========================================================
 */

import { APP_CONFIG, UI_TEXT } from "./config.js";

let currentLocation = {
    latitude: null,
    longitude: null,
    city: null
};

/**
 * 現在地情報取得
 */
export function getCurrentLocation() {
    return currentLocation;
}

/**
 * GPS取得
 * @returns {Promise<Object>}
 */
export function initializeLocation() {

    const statusElement = document.getElementById("locationStatus");
    const detailElement = document.getElementById("locationDetail");
    const cityElement = document.getElementById("cityName");
    const latitudeElement = document.getElementById("latitude");
    const longitudeElement = document.getElementById("longitude");

    statusElement.textContent = UI_TEXT.locationLoading;

    return new Promise((resolve, reject) => {

        if (!navigator.geolocation) {

            statusElement.textContent = UI_TEXT.locationError;

            reject(new Error("Geolocation is not supported."));

            return;
        }

        navigator.geolocation.getCurrentPosition(

            async (position) => {

                currentLocation.latitude = position.coords.latitude;
                currentLocation.longitude = position.coords.longitude;

                latitudeElement.textContent =
                    currentLocation.latitude.toFixed(6);

                longitudeElement.textContent =
                    currentLocation.longitude.toFixed(6);

                try {

                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${currentLocation.latitude}&lon=${currentLocation.longitude}`,
                        {
                            headers: {
                                "Accept": "application/json"
                            }
                        }
                    );

                    if (!response.ok) {
                        throw new Error("Reverse geocoding failed.");
                    }

                    const data = await response.json();

                    const address = data.address || {};

                    currentLocation.city =
                        address.city ||
                        address.town ||
                        address.village ||
                        address.municipality ||
                        address.county ||
                        address.state ||
                        "取得できませんでした";

                } catch (error) {

                    console.error(error);

                    currentLocation.city = "取得できませんでした";

                }

                cityElement.textContent = currentLocation.city;

                statusElement.textContent = "";

                detailElement.classList.remove("hidden");

                resolve(currentLocation);

            },

            (error) => {

                console.error(error);

                statusElement.textContent = UI_TEXT.locationError;

                reject(error);

            },

            APP_CONFIG.locationOptions

        );

    });

}