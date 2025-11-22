import { Head, router, useForm } from '@inertiajs/react'
import { type FormEventHandler, useState } from 'react'
import { Button } from '../../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import AppLayout from '../../layouts/app_layout'

interface User {
  id: string
  username: string
}

interface UtmPreset {
  id: string
  name: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  isDefault: boolean
  createdAt: string
}

export default function UtmPresetsIndex({
  presets,
}: {
  presets: UtmPreset[]
  user: User
}) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: '',
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmTerm: '',
    utmContent: '',
    isDefault: false,
  })

  const handleCreate: FormEventHandler = (e) => {
    e.preventDefault()
    post('/utm-presets', {
      onSuccess: () => reset(),
    })
  }

  const handleUpdate: FormEventHandler = (e) => {
    e.preventDefault()
    if (editingId) {
      put(`/utm-presets/${editingId}`, {
        onSuccess: () => {
          setEditingId(null)
          reset()
        },
      })
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this preset?')) {
      router.delete(`/utm-presets/${id}`)
    }
  }

  const startEdit = (preset: UtmPreset) => {
    setEditingId(preset.id)
    setData({
      name: preset.name,
      utmSource: preset.utmSource || '',
      utmMedium: preset.utmMedium || '',
      utmCampaign: preset.utmCampaign || '',
      utmTerm: preset.utmTerm || '',
      utmContent: preset.utmContent || '',
      isDefault: preset.isDefault,
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    reset()
  }

  return (
    <AppLayout>
      <Head title="UTM Presets" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">UTM Presets</h1>
          <p className="text-muted-foreground">
            Save your most-used UTM parameter combinations for quick reuse
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create/Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {editingId ? 'Edit Preset' : 'Create New Preset'}
              </CardTitle>
              <CardDescription>
                {editingId
                  ? 'Update your UTM preset'
                  : 'Create a reusable UTM parameter template'}
              </CardDescription>
            </CardHeader>
            <form onSubmit={editingId ? handleUpdate : handleCreate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Preset Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="e.g., Facebook Ads, Newsletter, Google CPC"
                    required
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utmSource">UTM Source</Label>
                  <Input
                    id="utmSource"
                    type="text"
                    value={data.utmSource}
                    onChange={(e) => setData('utmSource', e.target.value)}
                    placeholder="facebook, google, newsletter"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utmMedium">UTM Medium</Label>
                  <Input
                    id="utmMedium"
                    type="text"
                    value={data.utmMedium}
                    onChange={(e) => setData('utmMedium', e.target.value)}
                    placeholder="cpc, email, social"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utmCampaign">UTM Campaign</Label>
                  <Input
                    id="utmCampaign"
                    type="text"
                    value={data.utmCampaign}
                    onChange={(e) => setData('utmCampaign', e.target.value)}
                    placeholder="summer_sale, product_launch"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utmTerm">UTM Term</Label>
                  <Input
                    id="utmTerm"
                    type="text"
                    value={data.utmTerm}
                    onChange={(e) => setData('utmTerm', e.target.value)}
                    placeholder="running+shoes"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utmContent">UTM Content</Label>
                  <Input
                    id="utmContent"
                    type="text"
                    value={data.utmContent}
                    onChange={(e) => setData('utmContent', e.target.value)}
                    placeholder="logolink, textlink"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="isDefault"
                    className="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={data.isDefault}
                      onChange={(e) => setData('isDefault', e.target.checked)}
                      className="h-4 w-4"
                    />
                    Set as default preset
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    The default preset will be pre-selected when creating new
                    links
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={processing}
                    className="flex-1"
                  >
                    {processing
                      ? editingId
                        ? 'Updating...'
                        : 'Creating...'
                      : editingId
                        ? 'Update Preset'
                        : 'Create Preset'}
                  </Button>
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </form>
          </Card>

          {/* Presets List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Presets</h2>
            {presets.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    No presets yet. Create your first one!
                  </p>
                </CardContent>
              </Card>
            ) : (
              presets.map((preset) => (
                <Card
                  key={preset.id}
                  className={preset.isDefault ? 'border-primary' : ''}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {preset.name}
                          {preset.isDefault && (
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription>
                          Created {preset.createdAt}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(preset)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(preset.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {preset.utmSource && (
                        <div>
                          <span className="text-muted-foreground">
                            Source:{' '}
                          </span>
                          <span className="font-mono">{preset.utmSource}</span>
                        </div>
                      )}
                      {preset.utmMedium && (
                        <div>
                          <span className="text-muted-foreground">
                            Medium:{' '}
                          </span>
                          <span className="font-mono">{preset.utmMedium}</span>
                        </div>
                      )}
                      {preset.utmCampaign && (
                        <div>
                          <span className="text-muted-foreground">
                            Campaign:{' '}
                          </span>
                          <span className="font-mono">
                            {preset.utmCampaign}
                          </span>
                        </div>
                      )}
                      {preset.utmTerm && (
                        <div>
                          <span className="text-muted-foreground">Term: </span>
                          <span className="font-mono">{preset.utmTerm}</span>
                        </div>
                      )}
                      {preset.utmContent && (
                        <div>
                          <span className="text-muted-foreground">
                            Content:{' '}
                          </span>
                          <span className="font-mono">{preset.utmContent}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
