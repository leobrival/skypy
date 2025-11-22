import { Head, Link, useForm } from '@inertiajs/react'
import {
  type FormEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
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

/**
 * @fileoverview Create Short Link Form with UTM Presets and Custom Parameters
 *
 * @description
 * This form implements advanced UTM tracking features with bidirectional synchronization
 * between form fields and destination URL.
 *
 * ## Form Specifications
 *
 * ### UTM Preset Behavior
 *
 * 1. **Preset Selection without Destination URL**
 *    - When a preset is selected and Destination URL is empty, UTM values are stored in form fields
 *    - A preview of UTM parameters is shown: "?utm_source=xxx&utm_medium=yyy..."
 *    - When user enters a Destination URL, UTM params are automatically appended
 *
 * 2. **Auto-detection of Matching Preset**
 *    - When UTM values in form fields match exactly with a preset, that preset is auto-selected
 *    - Matching is done on: utmSource, utmMedium, utmCampaign, utmTerm, utmContent
 *    - If no preset matches, dropdown shows "Select preset..."
 *
 * 3. **Preset Reset on URL Clear**
 *    - When Destination URL is cleared and a preset was selected:
 *      - Preset dropdown resets to "Select preset..."
 *      - All UTM fields are cleared
 *    - This ensures a clean state for the next link creation
 *
 * 4. **Default Preset on Mount**
 *    - On component mount, if a preset has `isDefault: true`, it's auto-applied
 *    - UTM fields are populated but Destination URL remains empty
 *
 * ### Bidirectional UTM Sync
 *
 * - **URL → Fields**: When pasting a URL with UTM params, fields are populated
 * - **Fields → URL**: When editing UTM fields, URL is updated in real-time
 * - **Multi-value Support**: Use commas to add multiple values (e.g., "facebook, twitter")
 *
 * ### Custom Parameters
 *
 * - Add unlimited key-value pairs beyond standard UTM tags
 * - Empty params are filtered out on submit
 * - Stored as JSONB in database, appended to redirect URL
 *
 * @example
 * // Preset with default applied on mount
 * { name: "Facebook Ads", utmSource: "facebook", utmMedium: "cpc", isDefault: true }
 *
 * // Custom params example
 * [{ key: "ref", value: "partner123" }, { key: "affiliate_id", value: "abc" }]
 */

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

export default function LinksCreate({
  presets = [],
}: {
  user: User
  presets?: UtmPreset[]
}) {
  const { data, setData, post, processing, errors } = useForm<{
    title: string
    destinationUrl: string
    shortCode: string
    utmSource: string
    utmMedium: string
    utmCampaign: string
    utmTerm: string
    utmContent: string
    customParams: CustomParam[]
  }>({
    title: '',
    destinationUrl: '',
    shortCode: '',
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmTerm: '',
    utmContent: '',
    customParams: [],
  })

  // Track selected preset ID for controlled select
  const [selectedPresetId, setSelectedPresetId] = useState<string>('')

  // Track if we had a URL before (to detect clearing)
  const previousUrlRef = useRef<string>('')

  /**
   * Build URL with UTM parameters
   * Supports multiple values separated by comma
   */
  const buildUrlWithUtm = useCallback(
    (baseUrl: string, utmParams: Record<string, string>) => {
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
            // biome-ignore lint/suspicious/useIterableCallbackReturn: append returns void but forEach is fine here
            values.forEach((v) => url.searchParams.append(key, v))
          }
        })

        return url.toString()
      } catch (_e) {
        return baseUrl
      }
    },
    [],
  )

  /**
   * Check if destination URL is valid
   */
  const isValidUrl = useCallback((url: string): boolean => {
    if (!url || url.trim() === '') return false
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }, [])

  /**
   * Build UTM query string preview (without base URL)
   * Shows what will be appended when URL is entered
   */
  const buildUtmPreview = () => {
    const params = new URLSearchParams()
    if (data.utmSource) params.append('utm_source', data.utmSource)
    if (data.utmMedium) params.append('utm_medium', data.utmMedium)
    if (data.utmCampaign) params.append('utm_campaign', data.utmCampaign)
    if (data.utmTerm) params.append('utm_term', data.utmTerm)
    if (data.utmContent) params.append('utm_content', data.utmContent)
    const str = params.toString()
    return str ? `?${str}` : ''
  }

  // Check if current destination URL is valid
  const hasValidUrl = isValidUrl(data.destinationUrl)

  /**
   * Check if current UTM values match a preset exactly
   * Returns the matching preset ID or empty string
   */
  const findMatchingPreset = useCallback((): string => {
    const match = presets.find(
      (p) =>
        (p.utmSource || '') === data.utmSource &&
        (p.utmMedium || '') === data.utmMedium &&
        (p.utmCampaign || '') === data.utmCampaign &&
        (p.utmTerm || '') === data.utmTerm &&
        (p.utmContent || '') === data.utmContent,
    )
    return match?.id || ''
  }, [
    presets,
    data.utmSource,
    data.utmMedium,
    data.utmCampaign,
    data.utmTerm,
    data.utmContent,
  ])

  /**
   * Apply default preset on mount
   */
  useEffect(() => {
    const defaultPreset = presets.find((p) => p.isDefault)
    if (defaultPreset) {
      setSelectedPresetId(defaultPreset.id)
      setData((prev) => ({
        ...prev,
        utmSource: defaultPreset.utmSource || '',
        utmMedium: defaultPreset.utmMedium || '',
        utmCampaign: defaultPreset.utmCampaign || '',
        utmTerm: defaultPreset.utmTerm || '',
        utmContent: defaultPreset.utmContent || '',
      }))
    }
  }, [presets.find, setData])

  /**
   * Handle Destination URL changes:
   * - Parse UTM from URL if present
   * - Apply preset UTM to URL if URL has no UTM
   * - Reset preset and UTM fields when URL is cleared
   */
  useEffect(() => {
    const hadUrl = previousUrlRef.current !== ''
    const hasUrl = data.destinationUrl !== ''

    // URL was cleared - reset preset and UTM fields
    if (hadUrl && !hasUrl) {
      setSelectedPresetId('')
      setData((prev) => ({
        ...prev,
        utmSource: '',
        utmMedium: '',
        utmCampaign: '',
        utmTerm: '',
        utmContent: '',
      }))
      previousUrlRef.current = ''
      return
    }

    // URL is present
    if (hasUrl) {
      try {
        const url = new URL(data.destinationUrl)

        // Get all values for each UTM parameter
        const utmSources = url.searchParams.getAll('utm_source')
        const utmMediums = url.searchParams.getAll('utm_medium')
        const utmCampaigns = url.searchParams.getAll('utm_campaign')
        const utmTerms = url.searchParams.getAll('utm_term')
        const utmContents = url.searchParams.getAll('utm_content')

        // If URL has UTM parameters, extract them to form fields
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
        } else {
          // URL has no UTM params - apply existing form UTM fields to URL (from preset)
          const hasExistingUtm =
            data.utmSource ||
            data.utmMedium ||
            data.utmCampaign ||
            data.utmTerm ||
            data.utmContent
          if (hasExistingUtm) {
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
        }
      } catch (_e) {
        // Invalid URL, ignore
      }
    }

    previousUrlRef.current = data.destinationUrl
  }, [
    data.destinationUrl,
    buildUrlWithUtm,
    data.utmCampaign,
    data.utmContent,
    data.utmMedium,
    data.utmSource,
    data.utmTerm,
    setData,
  ])

  /**
   * Auto-detect matching preset when UTM fields change
   */
  useEffect(() => {
    const matchingPresetId = findMatchingPreset()
    if (matchingPresetId !== selectedPresetId) {
      setSelectedPresetId(matchingPresetId)
    }
  }, [findMatchingPreset, selectedPresetId])

  /**
   * Update destination URL when UTM parameters change (if URL exists)
   */
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
    buildUrlWithUtm,
    data.destinationUrl,
    setData,
  ])

  /**
   * Apply a preset to form fields
   */
  const applyPreset = (presetId: string) => {
    setSelectedPresetId(presetId)

    if (!presetId) {
      // Reset UTM fields when "Select preset..." is chosen
      setData((prev) => ({
        ...prev,
        utmSource: '',
        utmMedium: '',
        utmCampaign: '',
        utmTerm: '',
        utmContent: '',
      }))
      return
    }

    const preset = presets.find((p) => p.id === presetId)
    if (preset) {
      setData((prev) => ({
        ...prev,
        utmSource: preset.utmSource || '',
        utmMedium: preset.utmMedium || '',
        utmCampaign: preset.utmCampaign || '',
        utmTerm: preset.utmTerm || '',
        utmContent: preset.utmContent || '',
      }))
    }
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
    post('/links', { data: filteredData })
  }

  // Check if we have UTM values but no URL (show preview)
  const hasUtmWithoutUrl =
    !data.destinationUrl &&
    (data.utmSource ||
      data.utmMedium ||
      data.utmCampaign ||
      data.utmTerm ||
      data.utmContent)

  return (
    <AppLayout>
      <Head title="Create Short Link" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/links"
            className="text-primary hover:underline mb-4 inline-block"
          >
            ← Back to Links
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create Short Link</h1>
          <p className="text-muted-foreground">Create a new shortened URL</p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Link Details</CardTitle>
            <CardDescription>
              Enter the details for your shortened link
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
                  placeholder="https://example.com"
                  required
                />
                {errors.destinationUrl && (
                  <p className="text-sm text-destructive">
                    {errors.destinationUrl}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  L'URL complète avec le protocole (https://, http://, etc.)
                </p>
                {/* UTM Preview when URL is empty but UTM values exist */}
                {hasUtmWithoutUrl && (
                  <div className="mt-2 p-2 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">
                      UTM parameters will be appended:
                    </p>
                    <code className="text-xs font-mono break-all">
                      {buildUtmPreview()}
                    </code>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortCode">Custom Short Code (optional)</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    skypy.dev/
                  </span>
                  <Input
                    id="shortCode"
                    type="text"
                    value={data.shortCode}
                    onChange={(e) => setData('shortCode', e.target.value)}
                    placeholder="my-link"
                    pattern="[a-zA-Z0-9_-]+"
                    className="flex-1"
                  />
                </div>
                {errors.shortCode && (
                  <p className="text-sm text-destructive">{errors.shortCode}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Leave empty to generate a random code. Only letters, numbers,
                  dashes and underscores allowed.
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
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedPresetId}
                        onChange={(e) => applyPreset(e.target.value)}
                        disabled={!hasValidUrl}
                        title={
                          !hasValidUrl
                            ? "Veuillez d'abord entrer une URL de destination valide"
                            : ''
                        }
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
                    disabled={!hasValidUrl}
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
                    disabled={!hasValidUrl}
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
                    disabled={!hasValidUrl}
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
                    disabled={!hasValidUrl}
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
                    disabled={!hasValidUrl}
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
                    disabled={!hasValidUrl}
                    title={
                      !hasValidUrl
                        ? "Veuillez d'abord entrer une URL de destination valide"
                        : ''
                    }
                  >
                    + Add Parameter
                  </Button>
                </div>

                {data.customParams.map((param, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: Custom params don't have stable IDs, index is acceptable here
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <Input
                        type="text"
                        value={param.key}
                        onChange={(e) =>
                          updateCustomParam(index, 'key', e.target.value)
                        }
                        placeholder="Parameter name (e.g., ref)"
                        disabled={!hasValidUrl}
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
                        disabled={!hasValidUrl}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomParam(index)}
                      className="text-destructive hover:text-destructive"
                      disabled={!hasValidUrl}
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
                  {processing ? 'Creating...' : 'Create Short Link'}
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
