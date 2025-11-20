import { Head, useForm } from '@inertiajs/react'
import AppLayout from '../../layouts/app_layout'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { FormEventHandler } from 'react'

export default function CreatePage() {
  const { data, setData, post, processing, errors } = useForm({
    slug: '',
    profileName: '',
    bio: '',
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post('/pages')
  }

  return (
    <AppLayout>
      <Head title="Create Page" />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Page</h1>
          <p className="text-muted-foreground">
            Set up your new link-in-bio page
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Page Details</CardTitle>
            <CardDescription>
              Choose a unique slug and profile name for your page
            </CardDescription>
          </CardHeader>
          <form onSubmit={submit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="slug">Page Slug *</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">skypy.dev/</span>
                  <Input
                    id="slug"
                    type="text"
                    value={data.slug}
                    onChange={(e) => setData('slug', e.target.value)}
                    placeholder="yourname"
                    required
                    autoFocus
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Only letters, numbers, hyphens, and underscores
                </p>
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileName">Profile Name *</Label>
                <Input
                  id="profileName"
                  type="text"
                  value={data.profileName}
                  onChange={(e) => setData('profileName', e.target.value)}
                  placeholder="John Doe"
                  required
                />
                {errors.profileName && (
                  <p className="text-sm text-destructive">{errors.profileName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio (optional)</Label>
                <textarea
                  id="bio"
                  value={data.bio}
                  onChange={(e) => setData('bio', e.target.value)}
                  placeholder="Tell people about yourself..."
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                {errors.bio && (
                  <p className="text-sm text-destructive">{errors.bio}</p>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={processing} className="flex-1">
                  {processing ? 'Creating...' : 'Create Page'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </AppLayout>
  )
}
