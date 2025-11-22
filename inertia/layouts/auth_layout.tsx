import { Head } from '@inertiajs/react'
import type { PropsWithChildren } from 'react'

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Skypy</h1>
            <p className="text-muted-foreground mt-2">
              Your link-in-bio platform
            </p>
          </div>
          {children}
        </div>
      </div>
    </>
  )
}
