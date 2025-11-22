import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import LandingPage from '#models/landing_page'
import Link from '#models/link'
import LinkClick from '#models/link_click'

export default class PublicPagesController {
  /**
   * Detect device type from user agent
   */
  private detectDeviceType(userAgent: string): string {
    if (/mobile/i.test(userAgent)) return 'mobile'
    if (/tablet|ipad/i.test(userAgent)) return 'tablet'
    return 'desktop'
  }

  /**
   * Detect browser from user agent
   */
  private detectBrowser(userAgent: string): string {
    if (/edg/i.test(userAgent)) return 'Edge'
    if (/chrome/i.test(userAgent)) return 'Chrome'
    if (/firefox/i.test(userAgent)) return 'Firefox'
    if (/safari/i.test(userAgent)) return 'Safari'
    if (/opera|opr/i.test(userAgent)) return 'Opera'
    return 'Other'
  }

  /**
   * Detect operating system from user agent
   */
  private detectOS(userAgent: string): string {
    if (/windows/i.test(userAgent)) return 'Windows'
    if (/mac os/i.test(userAgent)) return 'macOS'
    if (/linux/i.test(userAgent)) return 'Linux'
    if (/android/i.test(userAgent)) return 'Android'
    if (/ios|iphone|ipad/i.test(userAgent)) return 'iOS'
    return 'Other'
  }

  /**
   * Show public landing page by slug or redirect short link
   */
  async show({ params, inertia, response, request, auth }: HttpContext) {
    // First, check if this is a short link
    const shortLink = await Link.query()
      .where('short_code', params.slug)
      .whereNull('landing_page_id')
      .where('is_active', true)
      .first()

    if (shortLink) {
      // Increment click count and record detailed analytics (fire and forget)
      shortLink.clickCount += 1
      shortLink.save().catch(() => {})

      // Parse user agent to extract device, browser, OS info
      const userAgent = request.header('user-agent') || ''
      const deviceType = this.detectDeviceType(userAgent)
      const browser = this.detectBrowser(userAgent)
      const os = this.detectOS(userAgent)

      // Record detailed click analytics
      LinkClick.create({
        linkId: shortLink.id,
        userId: auth.user?.id || null,
        ipAddress: request.ip(),
        userAgent,
        referrer: request.header('referer') || null,
        deviceType,
        browser,
        os,
        clickedAt: DateTime.now(),
      }).catch(() => {})

      // Build destination URL with UTM parameters
      const destinationUrl = new URL(shortLink.destinationUrl)
      const utmParams: Record<string, string> = {}

      if (shortLink.utmSource) utmParams.utm_source = shortLink.utmSource
      if (shortLink.utmMedium) utmParams.utm_medium = shortLink.utmMedium
      if (shortLink.utmCampaign) utmParams.utm_campaign = shortLink.utmCampaign
      if (shortLink.utmTerm) utmParams.utm_term = shortLink.utmTerm
      if (shortLink.utmContent) utmParams.utm_content = shortLink.utmContent

      // Add UTM parameters to destination URL
      Object.entries(utmParams).forEach(([key, value]) => {
        destinationUrl.searchParams.set(key, value)
      })

      // Add custom parameters
      if (shortLink.customParams && Array.isArray(shortLink.customParams)) {
        shortLink.customParams.forEach(({ key, value }) => {
          if (key && value) {
            destinationUrl.searchParams.set(key, value)
          }
        })
      }

      return response.redirect(destinationUrl.toString())
    }

    // If not a short link, check for landing page
    const page = await LandingPage.query()
      .where('slug', params.slug)
      .where('visibility', 'public')
      .preload('links', (query) => {
        query.where('isActive', true).orderBy('position', 'asc')
      })
      .first()

    if (!page) {
      return response.notFound('Page not found')
    }

    // Increment view count (fire and forget)
    page.viewCount += 1
    page.save().catch(() => {})

    return inertia.render('public/landing_page', {
      page: {
        slug: page.slug,
        profileName: page.profileName,
        bio: page.bio,
        themeConfig: page.themeConfig || {},
        links: page.links.map((link) => ({
          id: link.id,
          title: link.title,
          description: link.description,
          destinationUrl: link.destinationUrl,
          shortCode: link.shortCode,
        })),
      },
    })
  }
}
