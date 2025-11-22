import { Head } from '@inertiajs/react'
import PublicLayout from '../../layouts/public_layout'

interface Link {
  id: string
  title: string
  description: string | null
  destinationUrl: string
  shortCode: string
}

interface ThemeConfig {
  backgroundColor?: string
  textColor?: string
  buttonStyle?: 'rounded' | 'square' | 'pill'
  fontFamily?: string
}

interface Page {
  slug: string
  profileName: string
  bio: string | null
  themeConfig: ThemeConfig
  links: Link[]
}

export default function LandingPage({ page }: { page: Page }) {
  const theme = page.themeConfig || {}
  const bgColor = theme.backgroundColor || '#ffffff'
  const textColor = theme.textColor || '#000000'
  const buttonStyle = theme.buttonStyle || 'rounded'

  const buttonClass = {
    rounded: 'rounded-lg',
    square: 'rounded-none',
    pill: 'rounded-full',
  }[buttonStyle]

  return (
    <PublicLayout>
      <Head title={page.profileName}>
        <meta
          name="description"
          content={page.bio || `Visit ${page.profileName}'s page`}
        />
      </Head>

      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <div className="w-full max-w-2xl">
          {/* Profile Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">{page.profileName}</h1>
            {page.bio && (
              <p className="text-lg opacity-80 max-w-md mx-auto">{page.bio}</p>
            )}
          </div>

          {/* Links Section */}
          <div className="space-y-4 mb-8">
            {page.links.length === 0 ? (
              <div className="text-center py-12 opacity-60">
                <p>No links yet</p>
              </div>
            ) : (
              page.links.map((link) => (
                <a
                  key={link.id}
                  href={link.destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full p-6 border-2 transition-all hover:scale-105 hover:shadow-lg ${buttonClass}`}
                  style={{
                    borderColor: textColor,
                    backgroundColor: 'transparent',
                  }}
                >
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-1">{link.title}</h3>
                    {link.description && (
                      <p className="text-sm opacity-70">{link.description}</p>
                    )}
                  </div>
                </a>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-sm opacity-50">
            <p>
              Powered by{' '}
              <a
                href="/"
                className="underline hover:opacity-100"
                style={{ color: textColor }}
              >
                Skypy
              </a>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
