import { Head, Link, useForm } from '@inertiajs/react'
import type { FormEventHandler } from 'react'
import { Button } from '../../components/ui/button'
import { Label } from '../../components/ui/label'
import OnboardingLayout from '../../layouts/onboarding_layout'

const INDUSTRY_LABELS: Record<string, string> = {
  technology: 'Technologie',
  marketing: 'Marketing & Communication',
  ecommerce: 'E-commerce',
  education: 'Éducation',
  healthcare: 'Santé',
  finance: 'Finance',
  media: 'Média & Divertissement',
  nonprofit: 'Association / ONG',
  government: 'Secteur public',
  other: 'Autre',
}

interface Props {
  user: {
    industry: string
  }
  industryOptions: string[]
}

export default function OnboardingStep2({ user, industryOptions }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    industry: user.industry || '',
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post('/onboarding/step2')
  }

  const steps = [
    { label: 'À propos de vous', completed: true, active: false },
    { label: 'Votre travail', completed: false, active: true },
    { label: 'Commencer à créer', completed: false, active: false },
  ]

  return (
    <OnboardingLayout steps={steps}>
      <Head title="Votre travail - Étape 2" />

      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Parlez-nous de votre travail
          </h2>
          <p className="text-muted-foreground mt-2">
            Cela nous aidera à mieux comprendre vos besoins
          </p>
        </div>

        <form onSubmit={submit} className="space-y-8">
          {/* Industry selection */}
          <div className="space-y-4">
            <Label htmlFor="industry">Que fait votre entreprise ?</Label>

            <div className="relative max-w-md">
              <select
                id="industry"
                value={data.industry}
                onChange={(e) => setData('industry', e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none cursor-pointer"
              >
                <option value="">Sélectionnez un secteur d'activité</option>
                {industryOptions.map((industry) => (
                  <option key={industry} value={industry}>
                    {INDUSTRY_LABELS[industry] || industry}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {errors.industry && (
              <p className="text-sm text-destructive">{errors.industry}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <Link
              href="/onboarding/skip"
              method="post"
              as="button"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Rappelez-moi plus tard
            </Link>
            <Link
              href="/onboarding/step1"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Retour
            </Link>
            <Button type="submit" disabled={processing || !data.industry}>
              {processing ? 'Chargement...' : 'Continuer'}
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        </form>
      </div>
    </OnboardingLayout>
  )
}
