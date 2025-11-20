import { Head, Link } from '@inertiajs/react'
import AppLayout from '../../layouts/app_layout'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'

interface User {
  id: string
  email: string
  username: string
  accountTier: 'free' | 'premium'
}

export default function Dashboard({ user }: { user: User }) {
  return (
    <AppLayout>
      <Head title="Dashboard" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.username}!</h1>
          <p className="text-muted-foreground">
            Manage your links, pages, and analytics from here
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Landing Pages</CardTitle>
              <CardDescription>
                Create and manage your link-in-bio pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/pages">
                <Button className="w-full">Manage Pages</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shortened Links</CardTitle>
              <CardDescription>
                Create and track shortened URLs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/links">
                <Button className="w-full">Manage Links</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                View your click analytics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/analytics">
                <Button className="w-full">View Analytics</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>QR Codes</CardTitle>
              <CardDescription>
                Generate custom QR codes for your links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/qr/generate">
                <Button className="w-full">Generate QR Code</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Marketplace</CardTitle>
              <CardDescription>
                Browse and purchase virtual card products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/shop">
                <Button className="w-full">Browse Shop</Button>
              </Link>
            </CardContent>
          </Card>

          {user.accountTier === 'free' && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Upgrade to Premium</CardTitle>
                <CardDescription>
                  Unlock advanced features and unlimited analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="default" className="w-full">
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
