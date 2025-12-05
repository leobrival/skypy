import { Head } from '@inertiajs/react'
import type { PropsWithChildren } from 'react'

interface OnboardingStep {
  label: string
  completed: boolean
  active: boolean
}

interface OnboardingLayoutProps extends PropsWithChildren {
  steps: OnboardingStep[]
  illustration?: React.ReactNode
}

export default function OnboardingLayout({
  children,
  steps,
  illustration,
}: OnboardingLayoutProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="min-h-screen bg-background flex">
        {/* Left side - Form content */}
        <div className="flex-1 flex flex-col p-8 lg:p-12 max-w-2xl">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary">Skypy</h1>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((step, index) => (
              <div key={step.label} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      step.completed
                        ? 'bg-primary text-primary-foreground'
                        : step.active
                          ? 'border-2 border-primary text-primary'
                          : 'border-2 border-muted-foreground/30 text-muted-foreground/50'
                    }`}
                  >
                    {step.completed ? (
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : null}
                  </div>
                  <span
                    className={`text-sm ${
                      step.active
                        ? 'text-primary font-medium'
                        : step.completed
                          ? 'text-foreground'
                          : 'text-muted-foreground/50'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-px mx-3 ${
                      step.completed ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1">{children}</div>
        </div>

        {/* Right side - Illustration (hidden on mobile) */}
        <div className="hidden lg:flex flex-1 bg-muted/30 items-center justify-center p-12">
          {illustration || (
            <div className="relative w-full max-w-md aspect-square">
              {/* Decorative circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-dashed border-muted-foreground/20 rounded-full" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-dashed border-muted-foreground/20 rounded-full" />
              </div>
              {/* Center avatar placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
              {/* Decorative dots */}
              <div className="absolute top-8 right-8 w-3 h-3 bg-primary/60 rounded-full" />
              <div className="absolute bottom-12 left-12 w-2 h-2 bg-primary/40 rounded-full" />
              <div className="absolute top-1/3 left-8 w-4 h-4 text-yellow-500">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
