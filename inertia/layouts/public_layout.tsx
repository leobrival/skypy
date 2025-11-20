import { PropsWithChildren } from 'react'
import { Head } from '@inertiajs/react'

export default function PublicLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </>
  )
}
