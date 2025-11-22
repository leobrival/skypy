import { Head, Link } from '@inertiajs/react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import AppLayout from '../../layouts/app_layout'

interface User {
  id: string
  username: string
}

interface RecentClick {
  id: string
  linkTitle: string
  linkShortCode: string
  clickedAt: string
  deviceType: string | null
  browser: string | null
  os: string | null
  country: string | null
  referrer: string | null
}

interface ClickPerDay {
  date: string
  clicks: number
}

interface TopLink {
  id: string
  title: string
  shortCode: string
  clickCount: number
  destinationUrl: string
}

interface DeviceStat {
  type: string
  count: number
}

interface BrowserStat {
  name: string
  count: number
}

interface Analytics {
  totalClicks: number
  totalViews: number
  totalLinks: number
  recentClicks: RecentClick[]
  clicksPerDay: ClickPerDay[]
  topLinks: TopLink[]
  deviceStats: DeviceStat[]
  browserStats: BrowserStat[]
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

export default function AnalyticsIndex({
  analytics,
}: {
  analytics: Analytics
  user: User
}) {
  return (
    <AppLayout>
      <Head title="Analytics" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">
            View your click analytics and insights
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Clicks</CardTitle>
              <CardDescription>All-time click count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{analytics.totalClicks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Views</CardTitle>
              <CardDescription>Page view count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{analytics.totalViews}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Links</CardTitle>
              <CardDescription>Number of active links</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{analytics.totalLinks}</div>
            </CardContent>
          </Card>
        </div>

        {/* Clicks Over Time Chart */}
        {analytics.clicksPerDay.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Clicks Over Time</CardTitle>
              <CardDescription>
                Click activity for the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.clicksPerDay}>
                  <defs>
                    <linearGradient
                      id="colorClicks"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return `${date.getMonth() + 1}/${date.getDate()}`
                    }}
                  />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorClicks)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Top Links and Device/Browser Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Links */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Links</CardTitle>
              <CardDescription>Your most clicked links</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.topLinks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No links yet. Create your first link to get started!
                </p>
              ) : (
                <div className="space-y-4">
                  {analytics.topLinks.map((link) => (
                    <div
                      key={link.id}
                      className="flex justify-between items-center border-b pb-3 last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/links/${link.id}/edit`}
                          className="font-medium hover:text-primary truncate block"
                        >
                          {link.title}
                        </Link>
                        <p className="text-sm text-muted-foreground truncate">
                          /{link.shortCode}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold">
                          {link.clickCount}
                        </div>
                        <p className="text-xs text-muted-foreground">clicks</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Device Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
              <CardDescription>Clicks by device type</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.deviceStats.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No device data yet
                </p>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.deviceStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.type}: ${entry.count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analytics.deviceStats.map((entry, index) => (
                          <Cell
                            key={entry.type}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Browser Stats */}
        {analytics.browserStats.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Browser Usage</CardTitle>
              <CardDescription>
                Top 5 browsers used by your visitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics.browserStats}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Clicks</CardTitle>
            <CardDescription>
              Your latest link clicks with detailed information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.recentClicks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No activity yet. Start sharing your links to see analytics!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium text-sm">
                        Link
                      </th>
                      <th className="text-left py-3 px-2 font-medium text-sm">
                        Device
                      </th>
                      <th className="text-left py-3 px-2 font-medium text-sm">
                        Browser
                      </th>
                      <th className="text-left py-3 px-2 font-medium text-sm">
                        OS
                      </th>
                      <th className="text-left py-3 px-2 font-medium text-sm">
                        Referrer
                      </th>
                      <th className="text-left py-3 px-2 font-medium text-sm">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.recentClicks.map((click) => (
                      <tr
                        key={click.id}
                        className="border-b last:border-0 hover:bg-muted/50"
                      >
                        <td className="py-3 px-2">
                          <div className="font-medium">{click.linkTitle}</div>
                          <div className="text-xs text-muted-foreground">
                            /{click.linkShortCode}
                          </div>
                        </td>
                        <td className="py-3 px-2 text-sm">
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {click.deviceType || 'Unknown'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-sm">
                          {click.browser || '-'}
                        </td>
                        <td className="py-3 px-2 text-sm">{click.os || '-'}</td>
                        <td className="py-3 px-2 text-sm max-w-[200px] truncate">
                          {click.referrer ? (
                            <a
                              href={click.referrer}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {new URL(click.referrer).hostname}
                            </a>
                          ) : (
                            <span className="text-muted-foreground">
                              Direct
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-sm text-muted-foreground">
                          {new Date(click.clickedAt).toLocaleString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
