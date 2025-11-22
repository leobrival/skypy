import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import LandingPage from '#models/landing_page'
import Link from '#models/link'
import LinkClick from '#models/link_click'

export default class AnalyticsController {
  async index({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail()

    // Get total counts
    const totalLinks = await Link.query()
      .where('user_id', user.id)
      .count('* as total')
    const totalClicks = await LinkClick.query()
      .whereIn('link_id', Link.query().where('user_id', user.id).select('id'))
      .count('* as total')

    const totalViews = await LandingPage.query()
      .where('user_id', user.id)
      .sum('view_count as total')

    // Get recent clicks with link details
    const recentClicks = await LinkClick.query()
      .whereIn('link_id', Link.query().where('user_id', user.id).select('id'))
      .preload('link')
      .orderBy('clicked_at', 'desc')
      .limit(10)

    // Get clicks per day for the last 30 days
    const thirtyDaysAgo = DateTime.now().minus({ days: 30 }).toSQL()
    const clicksPerDay = await db
      .from('link_clicks')
      .select(db.raw('DATE(clicked_at) as date, COUNT(*) as clicks'))
      .whereIn('link_id', Link.query().where('user_id', user.id).select('id'))
      .where('clicked_at', '>=', thirtyDaysAgo)
      .groupByRaw('DATE(clicked_at)')
      .orderBy('date', 'asc')

    // Get top 5 most clicked links
    const topLinks = await Link.query()
      .where('user_id', user.id)
      .orderBy('click_count', 'desc')
      .limit(5)

    // Get device type breakdown
    const deviceStats = await db
      .from('link_clicks')
      .select('device_type', db.raw('COUNT(*) as count'))
      .whereIn('link_id', Link.query().where('user_id', user.id).select('id'))
      .whereNotNull('device_type')
      .groupBy('device_type')

    // Get browser breakdown
    const browserStats = await db
      .from('link_clicks')
      .select('browser', db.raw('COUNT(*) as count'))
      .whereIn('link_id', Link.query().where('user_id', user.id).select('id'))
      .whereNotNull('browser')
      .groupBy('browser')
      .orderBy('count', 'desc')
      .limit(5)

    const analytics = {
      totalClicks: Number(totalClicks[0].$extras.total) || 0,
      totalViews: Number(totalViews[0].$extras.total) || 0,
      totalLinks: Number(totalLinks[0].$extras.total) || 0,
      recentClicks: recentClicks.map((click) => ({
        id: click.id,
        linkTitle: click.link.title,
        linkShortCode: click.link.shortCode,
        clickedAt: click.clickedAt.toISO(),
        deviceType: click.deviceType,
        browser: click.browser,
        os: click.os,
        country: click.country,
        referrer: click.referrer,
      })),
      clicksPerDay: clicksPerDay.map((row) => ({
        date: row.date,
        clicks: Number(row.clicks),
      })),
      topLinks: topLinks.map((link) => ({
        id: link.id,
        title: link.title,
        shortCode: link.shortCode,
        clickCount: link.clickCount,
        destinationUrl: link.destinationUrl,
      })),
      deviceStats: deviceStats.map((row) => ({
        type: row.device_type,
        count: Number(row.count),
      })),
      browserStats: browserStats.map((row) => ({
        name: row.browser,
        count: Number(row.count),
      })),
    }

    return inertia.render('analytics/index', {
      analytics,
      user: {
        id: user.id,
        username: user.username,
      },
    })
  }
}
