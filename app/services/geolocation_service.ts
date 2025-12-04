/**
 * Geolocation Service
 *
 * Provides IP geolocation using ip-api.com (free tier: 45 requests/minute)
 * Gracefully handles failures and returns partial data
 */

interface GeolocationData {
  country: string | null
  countryCode: string | null
  city: string | null
  region: string | null
  timezone: string | null
  lat: number | null
  lon: number | null
}

export default class GeolocationService {
  private static readonly API_URL = 'http://ip-api.com/json'
  private static readonly TIMEOUT_MS = 2000 // 2 seconds timeout

  /**
   * Get geolocation data from IP address
   * Returns null values on failure to avoid blocking the request
   */
  async getLocationFromIP(ipAddress: string): Promise<GeolocationData> {
    // Skip for localhost/private IPs
    if (this.isPrivateIP(ipAddress)) {
      return this.getEmptyLocation()
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(
        () => controller.abort(),
        GeolocationService.TIMEOUT_MS,
      )

      const response = await fetch(
        `${GeolocationService.API_URL}/${ipAddress}?fields=status,country,countryCode,city,regionName,timezone,lat,lon`,
        {
          signal: controller.signal,
        },
      )

      clearTimeout(timeoutId)

      if (!response.ok) {
        return this.getEmptyLocation()
      }

      const data = (await response.json()) as {
        status: string
        country?: string
        countryCode?: string
        city?: string
        regionName?: string
        timezone?: string
        lat?: number
        lon?: number
      }

      if (data.status !== 'success') {
        return this.getEmptyLocation()
      }

      return {
        country: data.country || null,
        countryCode: data.countryCode || null,
        city: data.city || null,
        region: data.regionName || null,
        timezone: data.timezone || null,
        lat: data.lat || null,
        lon: data.lon || null,
      }
    } catch (error) {
      // Silent fail - don't block the main request
      console.error('Geolocation API error:', error)
      return this.getEmptyLocation()
    }
  }

  /**
   * Check if IP is private/localhost
   */
  private isPrivateIP(ip: string): boolean {
    if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') {
      return true
    }

    // Check for private IP ranges
    const parts = ip.split('.')
    if (parts.length !== 4) return false

    const first = Number.parseInt(parts[0], 10)
    const second = Number.parseInt(parts[1], 10)

    // 10.0.0.0 – 10.255.255.255
    if (first === 10) return true

    // 172.16.0.0 – 172.31.255.255
    if (first === 172 && second >= 16 && second <= 31) return true

    // 192.168.0.0 – 192.168.255.255
    if (first === 192 && second === 168) return true

    return false
  }

  /**
   * Return empty location data
   */
  private getEmptyLocation(): GeolocationData {
    return {
      country: null,
      countryCode: null,
      city: null,
      region: null,
      timezone: null,
      lat: null,
      lon: null,
    }
  }
}
