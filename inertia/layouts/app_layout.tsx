import { Head, Link, usePage } from '@inertiajs/react'
import type { PropsWithChildren } from 'react'
import { Button } from '../components/ui/button'

interface User {
  id: string
  email: string
  username: string
  profileImageUrl: string | null
  accountTier: 'free' | 'premium'
}

interface SharedProps {
  user?: User
}

export default function AppLayout({ children }: PropsWithChildren) {
  const { user } = usePage<SharedProps>().props

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="min-h-screen bg-background">
        <nav className="border-b">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              Skypy
            </Link>

            {user && (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/links">
                  <Button variant="ghost">Links</Button>
                </Link>
                <Link href="/analytics">
                  <Button variant="ghost">Analytics</Button>
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {user.username}
                  </span>
                  {user.accountTier === 'premium' && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      Premium
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>
        <main>{children}</main>
      </div>
    </>
  )
}
