const LocationService = {
  /**
   * 現在地取得（Promise化・タイムアウト付き・安全版）
   */
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        console.error("Geolocation not supported");
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("GPS success:", position);

          resolve({
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            }
          });
        },
        (error) => {
          console.error("GPS error:", error);

          let message = "GPS取得に失敗しました";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = "位置情報の許可が拒否されました";
              break;
            case error.POSITION_UNAVAILABLE:
              message = "位置情報が取得できません";
              break;
            case error.TIMEOUT:
              message = "位置情報取得がタイムアウトしました";
              break;
          }

          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,      // 12秒で強制終了
          maximumAge: 0        // キャッシュ使わない
        }
      );
    });
  }
};

window.LocationService = LocationService;