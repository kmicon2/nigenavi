const LocationService = {
  /**
   * 現在地取得（安定版・単純構造）
   */
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          });
        },
        (error) => {
          console.error("GPS ERROR:", error);

          let message = "位置情報取得に失敗";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = "位置情報の許可が拒否されています";
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
          timeout: 15000,
          maximumAge: 0
        }
      );
    });
  }
};

window.LocationService = LocationService;