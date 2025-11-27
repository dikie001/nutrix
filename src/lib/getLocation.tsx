export interface UserLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export async function getUserLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        if (!res.ok) throw new Error("Failed to fetch address");
        const data = await res.json();
        resolve({
          latitude,
          longitude,
          address: data.display_name,
        });
      } catch (err) {
        reject(err);
      }
    }, reject);
  });
}
