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

interface LandingPage {
  id: string
  slug: string
  profileName: string
  bio: string | null
  visibility: 'public' | 'private'
  viewCount: number
  createdAt: string
  links: Array<{ id: string; title: string }>
}

export default function PagesIndex({ pages }: { pages: LandingPage[] }) {
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      router.delete(`/pages/${id}`)
    }
  }

  return (
    <AppLayout>
      <Head title="My Pages" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Pages</h1>
            <p className="text-muted-foreground">
              Manage your link-in-bio pages
            </p>
          </div>
          <Link href="/pages/create">
            <Button>Create New Page</Button>
          </Link>
        </div>

        {pages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="text-lg font-semibold mb-2">No pages yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first landing page to get started
              </p>
              <Link href="/pages/create">
                <Button>Create Your First Page</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <Card key={page.id}>
                <CardHeader>
                  <CardTitle>{page.profileName}</CardTitle>
                  <CardDescription>/{page.slug}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Links:</span>
                      <span>{page.links.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Views:</span>
                      <span>{page.viewCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span
                        className={
                          page.visibility === 'public'
                            ? 'text-green-600'
                            : 'text-yellow-600'
                        }
                      >
                        {page.visibility}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/pages/${page.id}/edit`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Edit
                      </Button>
                    </Link>
                    <Link
                      href={`/${page.slug}`}
                      target="_blank"
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full">
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(page.id)}
                    >
                      ×
                    </Button>
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
