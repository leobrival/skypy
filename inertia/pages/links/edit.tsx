import { Head, Link, useForm } from '@inertiajs/react'
import { type FormEventHandler, useEffect } from 'react'
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
}

interface CustomParam {
  key: string
  value: string
}

interface LinkData {
  id: string
  title: string
  destinationUrl: string
  shortCode: string
  isActive: boolean
  clickCount: number
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  customParams?: CustomParam[]
}

export default function LinksEdit({
  link,
  presets = [],
}: {
  link: LinkData
  presets?: UtmPreset[]
  user: User
}) {
  const { data, setData, put, processing, errors } = useForm<{
    title: string
    destinationUrl: string
    isActive: boolean
    utmSource: string
    utmMedium: string
    utmCampaign: string
    utmTerm: string
    utmContent: string
    customParams: CustomParam[]
  }>({
    title: link.title,
    destinationUrl: link.destinationUrl,
    isActive: link.isActive,
    utmSource: link.utmSource || '',
    utmMedium: link.utmMedium || '',
    utmCampaign: link.utmCampaign || '',
    utmTerm: link.utmTerm || '',
    utmContent: link.utmContent || '',
    customParams: link.customParams || [],
  })

  // Parse UTM parameters from destination URL when it changes, or clear them when URL is emptied
  useEffect(() => {
    if (data.destinationUrl) {
      try {
        const url = new URL(data.destinationUrl)

        // Get all values for each UTM parameter (supports multiple values)
        const utmSources = url.searchParams.getAll('utm_source')
        const utmMediums = url.searchParams.getAll('utm_medium')
        const utmCampaigns = url.searchParams.getAll('utm_campaign')
        const utmTerms = url.searchParams.getAll('utm_term')
        const utmContents = url.searchParams.getAll('utm_content')

        // Only update if we found UTM parameters
        if (
          utmSources.length ||
          utmMediums.length ||
          utmCampaigns.length ||
          utmTerms.length ||
          utmContents.length
        ) {
          setData((prev) => ({
            ...prev,
            utmSource: utmSources.join(', '),
            utmMedium: utmMediums.join(', '),
            utmCampaign: utmCampaigns.join(', '),
            utmTerm: utmTerms.join(', '),
            utmContent: utmContents.join(', '),
          }))
        }
      } catch (e) {
        // Invalid URL, ignore
      }
    } else {
      // Clear UTM fields when destination URL is emptied (only if they have values)
      setData((prev) => {
        if (
          prev.utmSource ||
          prev.utmMedium ||
          prev.utmCampaign ||
          prev.utmTerm ||
          prev.utmContent
        ) {
          return {
            ...prev,
            utmSource: '',
            utmMedium: '',
            utmCampaign: '',
            utmTerm: '',
            utmContent: '',
          }
        }
        return prev
      })
    }
  }, [data.destinationUrl])

  // Build URL preview with UTM parameters
  const buildUrlWithUtm = (
    baseUrl: string,
    utmParams: Record<string, string>,
  ) => {
    try {
      const url = new URL(baseUrl)

      // Remove all existing UTM parameters
      url.searchParams.delete('utm_source')
      url.searchParams.delete('utm_medium')
      url.searchParams.delete('utm_campaign')
      url.searchParams.delete('utm_term')
      url.searchParams.delete('utm_content')

      // Add current UTM parameters (supports multiple values separated by comma)
      Object.entries(utmParams).forEach(([key, value]) => {
        if (value) {
          const values = value
            .split(',')
            .map((v) => v.trim())
            .filter((v) => v)
          values.forEach((v) => url.searchParams.append(key, v))
        }
      })

      return url.toString()
    } catch (e) {
      return baseUrl
    }
  }

  // Update destination URL when UTM parameters change
  useEffect(() => {
    if (data.destinationUrl) {
      const newUrl = buildUrlWithUtm(data.destinationUrl, {
        utm_source: data.utmSource,
        utm_medium: data.utmMedium,
        utm_campaign: data.utmCampaign,
        utm_term: data.utmTerm,
        utm_content: data.utmContent,
      })

      if (newUrl !== data.destinationUrl) {
        setData('destinationUrl', newUrl)
      }
    }
  }, [
    data.utmSource,
    data.utmMedium,
    data.utmCampaign,
    data.utmTerm,
    data.utmContent,
  ])

  const applyPreset = (preset: UtmPreset) => {
    setData((prev) => ({
      ...prev,
      utmSource: preset.utmSource || '',
      utmMedium: preset.utmMedium || '',
      utmCampaign: preset.utmCampaign || '',
      utmTerm: preset.utmTerm || '',
      utmContent: preset.utmContent || '',
    }))
  }

  const addCustomParam = () => {
    setData('customParams', [...data.customParams, { key: '', value: '' }])
  }

  const updateCustomParam = (
    index: number,
    field: 'key' | 'value',
    value: string,
  ) => {
    const newParams = [...data.customParams]
    newParams[index][field] = value
    setData('customParams', newParams)
  }

  const removeCustomParam = (index: number) => {
    setData(
      'customParams',
      data.customParams.filter((_, i) => i !== index),
    )
  }

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    // Filter out empty custom params before submitting
    const filteredData = {
      ...data,
      customParams: data.customParams.filter((p) => p.key && p.value),
    }
    put(`/links/${link.id}`, { data: filteredData })
  }

  return (
    <AppLayout>
      <Head title="Edit Short Link" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/links"
            className="text-primary hover:underline mb-4 inline-block"
          >
            ← Back to Links
          </Link>
          <h1 className="text-3xl font-bold mb-2">Edit Short Link</h1>
          <p className="text-muted-foreground">
            Update your shortened URL details
          </p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Link Details</CardTitle>
            <CardDescription>
              Short Code:{' '}
              <span className="font-mono text-primary">{link.shortCode}</span> •
              Clicks: {link.clickCount}
            </CardDescription>
          </CardHeader>
          <form onSubmit={submit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  type="text"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  placeholder="My awesome link"
                  required
                  autoFocus
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="destinationUrl">Destination URL *</Label>
                <Input
                  id="destinationUrl"
                  type="url"
                  value={data.destinationUrl}
                  onChange={(e) => setData('destinationUrl', e.target.value)}
                  placeholder="https://example.com/very/long/url"
                  required
                />
                {errors.destinationUrl && (
                  <p className="text-sm text-destructive">
                    {errors.destinationUrl}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  The full URL where users will be redirected (UTM parameters
                  will be added automatically)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="isActive" className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={data.isActive}
                    onChange={(e) => setData('isActive', e.target.checked)}
                    className="h-4 w-4"
                  />
                  Active
                </Label>
                <p className="text-sm text-muted-foreground">
                  Inactive links will not redirect users
                </p>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      UTM Parameters (optional)
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Track your link performance by adding UTM parameters for
                      analytics
                    </p>
                  </div>
                  {presets.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="preset"
                        className="text-sm whitespace-nowrap"
                      >
                        Apply Preset:
                      </Label>
                      <select
                        id="preset"
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                        onChange={(e) => {
                          const preset = presets.find(
                            (p) => p.id === e.target.value,
                          )
                          if (preset) applyPreset(preset)
                        }}
                        defaultValue=""
                      >
                        <option value="">Select preset...</option>
                        {presets.map((preset) => (
                          <option key={preset.id} value={preset.id}>
                            {preset.name} {preset.isDefault && '(Default)'}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utmSource">UTM Source</Label>
                  <Input
                    id="utmSource"
                    type="text"
                    value={data.utmSource}
                    onChange={(e) => setData('utmSource', e.target.value)}
                    placeholder="facebook, newsletter, google"
                  />
                  {errors.utmSource && (
                    <p className="text-sm text-destructive">
                      {errors.utmSource}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Identifies which site sent the traffic. Use commas to add
                    multiple values (e.g., facebook, newsletter)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utmMedium">UTM Medium</Label>
                  <Input
                    id="utmMedium"
                    type="text"
                    value={data.utmMedium}
                    onChange={(e) => setData('utmMedium', e.target.value)}
                    placeholder="social, email, cpc"
                  />
                  {errors.utmMedium && (
                    <p className="text-sm text-destructive">
                      {errors.utmMedium}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Identifies the advertising or marketing medium. Use commas
                    for multiple values (e.g., social, email)
                  </p>
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
                  {errors.utmCampaign && (
                    <p className="text-sm text-destructive">
                      {errors.utmCampaign}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Identifies the specific campaign or promotion. Use commas
                    for multiple values (e.g., summer_sale, winter_promo)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utmTerm">UTM Term</Label>
                  <Input
                    id="utmTerm"
                    type="text"
                    value={data.utmTerm}
                    onChange={(e) => setData('utmTerm', e.target.value)}
                    placeholder="running+shoes, fitness"
                  />
                  {errors.utmTerm && (
                    <p className="text-sm text-destructive">{errors.utmTerm}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Identifies paid search keywords. Use commas for multiple
                    values (mainly for paid ads)
                  </p>
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
                  {errors.utmContent && (
                    <p className="text-sm text-destructive">
                      {errors.utmContent}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Differentiates similar content or links. Use commas for
                    multiple values (e.g., logolink, banner)
                  </p>
                </div>
              </div>

              {/* Custom Parameters Section */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Custom Parameters (optional)
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Add custom URL parameters beyond standard UTM tags (e.g.,
                      ref, affiliate_id)
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCustomParam}
                  >
                    + Add Parameter
                  </Button>
                </div>

                {data.customParams.map((param, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <Input
                        type="text"
                        value={param.key}
                        onChange={(e) =>
                          updateCustomParam(index, 'key', e.target.value)
                        }
                        placeholder="Parameter name (e.g., ref)"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        type="text"
                        value={param.value}
                        onChange={(e) =>
                          updateCustomParam(index, 'value', e.target.value)
                        }
                        placeholder="Value (e.g., partner123)"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomParam(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                {data.customParams.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    No custom parameters added. Click "Add Parameter" to add
                    one.
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={processing} className="flex-1">
                  {processing ? 'Updating...' : 'Update Short Link'}
                </Button>
                <Link href="/links">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </AppLayout>
  )
}
