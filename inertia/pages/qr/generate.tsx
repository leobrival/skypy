import { Head, useForm } from '@inertiajs/react'
import type { FormEventHandler } from 'react'
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

export default function QrGenerate({ user }: { user: User }) {
  const { data, setData, post, processing } = useForm({
    url: '',
    size: '256',
    format: 'png',
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    // TODO: Implement QR code generation
    alert('QR code generation will be implemented in Phase 5')
  }

  return (
    <AppLayout>
      <Head title="Generate QR Code" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Generate QR Code</h1>
          <p className="text-muted-foreground">
            Create custom QR codes for your links and landing pages
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Settings</CardTitle>
              <CardDescription>
                Configure your QR code parameters
              </CardDescription>
            </CardHeader>
            <form onSubmit={submit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">URL or Text</Label>
                  <Input
                    id="url"
                    type="text"
                    value={data.url}
                    onChange={(e) => setData('url', e.target.value)}
                    placeholder="https://example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Size (px)</Label>
                  <Input
                    id="size"
                    type="number"
                    value={data.size}
                    onChange={(e) => setData('size', e.target.value)}
                    min="128"
                    max="1024"
                    step="64"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="format">Format</Label>
                  <select
                    id="format"
                    value={data.format}
                    onChange={(e) => setData('format', e.target.value)}
                    className="w-full border rounded-md p-2"
                  >
                    <option value="png">PNG</option>
                    <option value="svg">SVG</option>
                    <option value="jpg">JPG</option>
                  </select>
                </div>

                <Button type="submit" className="w-full" disabled={processing}>
                  {processing ? 'Generating...' : 'Generate QR Code'}
                </Button>
              </CardContent>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Your QR code will appear here</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[300px]">
              <div className="text-center text-muted-foreground">
                <p>Enter a URL to generate your QR code</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
