import { Head, Link } from '@inertiajs/react'
import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
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
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '../../components/ui/chart'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs'
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

interface CountryStat {
  country: string
  countryCode: string
  count: number
}

interface CityStat {
  city: string
  country: string
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
  countryStats: CountryStat[]
  cityStats: CityStat[]
}

// Chart configurations
const clicksChartConfig = {
  clicks: {
    label: 'Clicks',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

const deviceChartConfig = {
  mobile: { label: 'Mobile', color: 'hsl(var(--chart-1))' },
  desktop: { label: 'Desktop', color: 'hsl(var(--chart-2))' },
  tablet: { label: 'Tablet', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig

const browserChartConfig = {
  Chrome: { label: 'Chrome', color: 'hsl(var(--chart-1))' },
  Firefox: { label: 'Firefox', color: 'hsl(var(--chart-2))' },
  Safari: { label: 'Safari', color: 'hsl(var(--chart-3))' },
  Edge: { label: 'Edge', color: 'hsl(var(--chart-4))' },
  Opera: { label: 'Opera', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig

function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍'
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

export default function AnalyticsIndex({
  analytics,
}: {
  analytics: Analytics
  user: User
}) {
  const [period] = useState('30d')

  return (
    <AppLayout>
      <Head title="Analytics" />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Track your link performance and visitor insights
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Clicks</CardDescription>
              <CardTitle className="text-4xl">
                {analytics.totalClicks}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Views</CardDescription>
              <CardTitle className="text-4xl">{analytics.totalViews}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Links</CardDescription>
              <CardTitle className="text-4xl">{analytics.totalLinks}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="geographic">Geographic</TabsTrigger>
            <TabsTrigger value="devices">Devices & Browsers</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Clicks Over Time - Bar Chart like Vercel */}
            {analytics.clicksPerDay.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        Visitor Analytics
                      </CardTitle>
                      <CardDescription className="text-sm mt-1">
                        Showing total visitors for the last {period}
                      </CardDescription>
                    </div>
                    <div className="flex gap-8">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">
                          Desktop
                        </div>
                        <div className="text-3xl font-bold">
                          {analytics.deviceStats.find(
                            (d) => d.type === 'desktop',
                          )?.count || 0}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">
                          Mobile
                        </div>
                        <div className="text-3xl font-bold">
                          {analytics.deviceStats.find(
                            (d) => d.type === 'mobile',
                          )?.count || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={clicksChartConfig}
                    className="h-[300px]"
                  >
                    <BarChart
                      data={analytics.clicksPerDay}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="0"
                        vertical={false}
                        stroke="hsl(var(--border))"
                        strokeOpacity={0.3}
                      />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => {
                          const date = new Date(value)
                          const monthNames = [
                            'Jan',
                            'Feb',
                            'Mar',
                            'Apr',
                            'May',
                            'Jun',
                            'Jul',
                            'Aug',
                            'Sep',
                            'Oct',
                            'Nov',
                            'Dec',
                          ]
                          return `${monthNames[date.getMonth()]} ${date.getDate()}`
                        }}
                      />
                      <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="clicks"
                        fill="hsl(var(--chart-1))"
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            )}

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
                          <p className="text-xs text-muted-foreground">
                            clicks
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Clicks</CardTitle>
                <CardDescription>
                  Latest link clicks with detailed information
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
                            Country
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
                              <div className="font-medium">
                                {click.linkTitle}
                              </div>
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
                            <td className="py-3 px-2 text-sm">
                              {click.os || '-'}
                            </td>
                            <td className="py-3 px-2 text-sm">
                              {click.country || '-'}
                            </td>
                            <td className="py-3 px-2 text-sm text-muted-foreground">
                              {new Date(click.clickedAt).toLocaleString(
                                'fr-FR',
                                {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                },
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Geographic Tab */}
          <TabsContent value="geographic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Country Stats */}
              {analytics.countryStats && analytics.countryStats.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Top Countries</CardTitle>
                    <CardDescription>
                      Geographic distribution of your visitors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.countryStats.slice(0, 10).map((stat) => (
                        <div
                          key={stat.countryCode}
                          className="flex justify-between items-center border-b pb-2 last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">
                              {getFlagEmoji(stat.countryCode)}
                            </span>
                            <span className="font-medium">{stat.country}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">
                              {stat.count}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              clicks
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* City Stats */}
              {analytics.cityStats && analytics.cityStats.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Top Cities</CardTitle>
                    <CardDescription>
                      City-level visitor breakdown
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.cityStats.slice(0, 10).map((stat, index) => (
                        <div
                          key={`${stat.city}-${stat.country}-${index}`}
                          className="flex justify-between items-center border-b pb-2 last:border-0"
                        >
                          <div>
                            <div className="font-medium">{stat.city}</div>
                            <div className="text-xs text-muted-foreground">
                              {stat.country}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">
                              {stat.count}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              clicks
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Devices & Browsers Tab */}
          <TabsContent value="devices" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device Breakdown */}
              {analytics.deviceStats.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Device Breakdown</CardTitle>
                    <CardDescription>Clicks by device type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={deviceChartConfig}
                      className="h-[300px]"
                    >
                      <PieChart>
                        <ChartTooltip
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                          data={analytics.deviceStats}
                          dataKey="count"
                          nameKey="type"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ type, count }) => `${type}: ${count}`}
                        >
                          {analytics.deviceStats.map((entry, index) => (
                            <Cell
                              key={entry.type}
                              fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                            />
                          ))}
                        </Pie>
                        <ChartLegend content={<ChartLegendContent />} />
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              )}

              {/* Browser Usage */}
              {analytics.browserStats.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Browser Usage</CardTitle>
                    <CardDescription>
                      Top 5 browsers used by your visitors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={browserChartConfig}
                      className="h-[300px]"
                    >
                      <BarChart data={analytics.browserStats}>
                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="count"
                          fill="hsl(var(--chart-1))"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
