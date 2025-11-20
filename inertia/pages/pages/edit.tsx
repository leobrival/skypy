import { Head, useForm, router } from '@inertiajs/react'
import AppLayout from '../../layouts/app_layout'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { FormEventHandler, useState } from 'react'

interface Link {
  id: string
  title: string
  description: string | null
  destinationUrl: string
  shortCode: string
  position: number
  isActive: boolean
  clickCount: number
}

interface ThemeConfig {
  backgroundColor?: string
  textColor?: string
  buttonStyle?: 'rounded' | 'square' | 'pill'
  fontFamily?: string
}

interface Page {
  id: string
  slug: string
  profileName: string
  bio: string | null
  themeConfig: ThemeConfig | null
  visibility: 'public' | 'private'
  viewCount: number
  links: Link[]
}

export default function EditPage({ page }: { page: Page }) {
  const [showAddLink, setShowAddLink] = useState(false)

  const { data: pageData, setData: setPageData, put, processing, errors } = useForm({
    profileName: page.profileName,
    bio: page.bio || '',
    themeConfig: page.themeConfig || {},
    visibility: page.visibility,
  })

  const { data: linkData, setData: setLinkData, post, reset } = useForm({
    title: '',
    description: '',
    destinationUrl: '',
  })

  const updatePage: FormEventHandler = (e) => {
    e.preventDefault()
    put(`/pages/${page.id}`)
  }

  const addLink: FormEventHandler = (e) => {
    e.preventDefault()
    post(`/pages/${page.id}/links`, {
      onSuccess: () => {
        reset()
        setShowAddLink(false)
      },
    })
  }

  const deleteLink = (linkId: string) => {
    if (confirm('Delete this link?')) {
      router.delete(`/pages/${page.id}/links/${linkId}`)
    }
  }

  return (
    <AppLayout>
      <Head title={`Edit ${page.profileName}`} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Edit Page</h1>
            <p className="text-muted-foreground">/{page.slug}</p>
          </div>
          <div className="flex gap-2">
            <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">View Public Page</Button>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Editor */}
          <div className="space-y-6">
            {/* Page Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Page Settings</CardTitle>
                <CardDescription>Update your page information</CardDescription>
              </CardHeader>
              <form onSubmit={updatePage}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profileName">Profile Name</Label>
                    <Input
                      id="profileName"
                      value={pageData.profileName}
                      onChange={(e) => setPageData('profileName', e.target.value)}
                    />
                    {errors.profileName && (
                      <p className="text-sm text-destructive">{errors.profileName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      value={pageData.bio}
                      onChange={(e) => setPageData('bio', e.target.value)}
                      rows={3}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>

                  <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </form>
            </Card>

            {/* Links */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Links</CardTitle>
                    <CardDescription>Manage your page links</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setShowAddLink(!showAddLink)}>
                    {showAddLink ? 'Cancel' : 'Add Link'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {showAddLink && (
                  <form onSubmit={addLink} className="space-y-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={linkData.title}
                        onChange={(e) => setLinkData('title', e.target.value)}
                        placeholder="My Website"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>URL</Label>
                      <Input
                        type="url"
                        value={linkData.destinationUrl}
                        onChange={(e) => setLinkData('destinationUrl', e.target.value)}
                        placeholder="https://example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description (optional)</Label>
                      <Input
                        value={linkData.description}
                        onChange={(e) => setLinkData('description', e.target.value)}
                        placeholder="Short description"
                      />
                    </div>
                    <Button type="submit">Add Link</Button>
                  </form>
                )}

                {page.links.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No links yet. Add your first link above.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {page.links.map((link) => (
                      <div
                        key={link.id}
                        className="p-4 border rounded-lg flex justify-between items-start"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{link.title}</h4>
                          <p className="text-sm text-muted-foreground truncate">
                            {link.destinationUrl}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {link.clickCount} clicks
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteLink(link.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Preview */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>See how your page looks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6 bg-muted/20">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold">{pageData.profileName}</h2>
                    {pageData.bio && (
                      <p className="text-muted-foreground mt-2">{pageData.bio}</p>
                    )}
                  </div>
                  <div className="space-y-3">
                    {page.links.map((link) => (
                      <div
                        key={link.id}
                        className="p-4 bg-background border rounded-lg text-center hover:bg-accent transition-colors"
                      >
                        <p className="font-medium">{link.title}</p>
                        {link.description && (
                          <p className="text-sm text-muted-foreground">
                            {link.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
