export interface Coords {
  lat: number
  lng: number
}

export type GeolocationError =
  | { type: 'permission_denied' }
  | { type: 'unavailable' }
  | { type: 'timeout' }
  | { type: 'unsupported' }

export function getCurrentPosition(): Promise<Coords> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({ type: 'unsupported' } satisfies GeolocationError)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        switch (err.code) {
          case GeolocationPositionError.PERMISSION_DENIED:
            reject({ type: 'permission_denied' } satisfies GeolocationError)
            break
          case GeolocationPositionError.POSITION_UNAVAILABLE:
            reject({ type: 'unavailable' } satisfies GeolocationError)
            break
          case GeolocationPositionError.TIMEOUT:
            reject({ type: 'timeout' } satisfies GeolocationError)
            break
          default:
            reject({ type: 'unavailable' } satisfies GeolocationError)
        }
      },
      { timeout: 10_000, maximumAge: 5 * 60 * 1000 },
    )
  })
}
