import { Head, Link, router } from '@inertiajs/react'
import { Button } from '../../components/ui/button'
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

interface ShortLink {
  id: string
  shortCode: string
  destinationUrl: string
  title: string
  clickCount: number
  isActive: boolean
  createdAt: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
}

export default function LinksIndex({
  links,
  user,
}: {
  links: ShortLink[]
  user: User
}) {
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this link?')) {
      router.delete(`/links/${id}`)
    }
  }

  const handleCopy = (shortCode: string) => {
    const url = `${window.location.origin}/${shortCode}`
    navigator.clipboard.writeText(url)
    alert('Link copied to clipboard!')
  }

  return (
    <AppLayout>
      <Head title="Shortened Links" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Shortened Links</h1>
            <p className="text-muted-foreground">
              Create and manage your shortened URLs
            </p>
          </div>
          <Link href="/links/create">
            <Button>Create Short Link</Button>
          </Link>
        </div>

        {links.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="text-lg font-semibold mb-2">
                No shortened links yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Create your first short link to start tracking clicks
              </p>
              <Link href="/links/create">
                <Button>Create Your First Link</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {links.map((link) => (
              <Card key={link.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{link.title}</CardTitle>
                      <CardDescription>
                        <a
                          href={`/${link.shortCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {window.location.origin}/{link.shortCode}
                        </a>
                      </CardDescription>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        link.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {link.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          Destination:{' '}
                        </span>
                        <span className="break-all">{link.destinationUrl}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Clicks: </span>
                        <span className="font-semibold">{link.clickCount}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Created: {link.createdAt}
                      </div>
                    </div>

                    {(link.utmSource ||
                      link.utmMedium ||
                      link.utmCampaign ||
                      link.utmTerm ||
                      link.utmContent) && (
                      <div className="mt-3 pt-3 border-t space-y-1">
                        <p className="text-sm font-semibold text-muted-foreground mb-1">
                          UTM Parameters:
                        </p>
                        {link.utmSource && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              Source:{' '}
                            </span>
                            <span className="font-mono">{link.utmSource}</span>
                          </div>
                        )}
                        {link.utmMedium && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              Medium:{' '}
                            </span>
                            <span className="font-mono">{link.utmMedium}</span>
                          </div>
                        )}
                        {link.utmCampaign && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              Campaign:{' '}
                            </span>
                            <span className="font-mono">
                              {link.utmCampaign}
                            </span>
                          </div>
                        )}
                        {link.utmTerm && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              Term:{' '}
                            </span>
                            <span className="font-mono">{link.utmTerm}</span>
                          </div>
                        )}
                        {link.utmContent && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              Content:{' '}
                            </span>
                            <span className="font-mono">{link.utmContent}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(link.shortCode)}
                        className="flex-1"
                      >
                        Copy Link
                      </Button>
                      <Link href={`/links/${link.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(link.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
