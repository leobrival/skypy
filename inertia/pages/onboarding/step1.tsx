import { Head, Link, useForm } from '@inertiajs/react'
import type { FormEventHandler } from 'react'
import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import OnboardingLayout from '../../layouts/onboarding_layout'

interface UseCase {
  id: string
  label: string
  icon: string
}

const USE_CASE_LABELS: Record<string, UseCase> = {
  short_urls: { id: 'short_urls', label: 'URL courtes griffées', icon: '🔗' },
  qr_codes: { id: 'qr_codes', label: 'Codes QR personnalisables', icon: '📱' },
  landing_pages: {
    id: 'landing_pages',
    label: 'Pages de destination effectives',
    icon: '📄',
  },
  sms_communications: {
    id: 'sms_communications',
    label: 'Communications personnalisées par SMS',
    icon: '💬',
  },
  digital_marketing: {
    id: 'digital_marketing',
    label: 'Marketing numérique ou branding',
    icon: '📣',
  },
  analytics: {
    id: 'analytics',
    label: 'Analyse et suivi détaillés',
    icon: '📊',
  },
  api_development: {
    id: 'api_development',
    label: 'API pour développeurs et développeuses',
    icon: '⚡',
  },
  other: { id: 'other', label: 'Autre', icon: '💡' },
}

interface Props {
  user: {
    displayName: string
    useCases: string[]
  }
  useCaseOptions: string[]
}

export default function OnboardingStep1({ user, useCaseOptions }: Props) {
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>(
    user.useCases || [],
  )

  const { data, setData, post, processing, errors } = useForm({
    displayName: user.displayName || '',
    useCases: user.useCases || [],
  })

  const toggleUseCase = (useCase: string) => {
    const newUseCases = selectedUseCases.includes(useCase)
      ? selectedUseCases.filter((uc) => uc !== useCase)
      : [...selectedUseCases, useCase]
    setSelectedUseCases(newUseCases)
    setData('useCases', newUseCases)
  }

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post('/onboarding/step1')
  }

  const steps = [
    { label: 'À propos de vous', completed: false, active: true },
    { label: 'Votre travail', completed: false, active: false },
    { label: 'Commencer à créer', completed: false, active: false },
  ]

  return (
    <OnboardingLayout steps={steps}>
      <Head title="Bienvenue - Étape 1" />

      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Bienvenue chez Skypy !
          </h2>
          <p className="text-muted-foreground mt-2">
            Parlez-nous un peu de vous
          </p>
        </div>

        <form onSubmit={submit} className="space-y-8">
          {/* Display name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">
              Comment souhaitez-vous être appelé·e ?
            </Label>
            <Input
              id="displayName"
              type="text"
              value={data.displayName}
              onChange={(e) => setData('displayName', e.target.value)}
              placeholder="Votre prénom ou pseudo"
              className="max-w-md"
            />
            <p className="text-sm text-muted-foreground">
              Il s'agit du nom qui sera affiché. Vous pouvez le modifier dans
              les Paramètres.
            </p>
            {errors.displayName && (
              <p className="text-sm text-destructive">{errors.displayName}</p>
            )}
          </div>

          {/* Use cases */}
          <div className="space-y-4">
            <div>
              <Label>Quel usage souhaitez-vous faire de Skypy ?</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Votre sélection sera utilisée pour personnaliser votre
                expérience. Veuillez sélectionner ce qui s'applique.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {useCaseOptions.map((useCase) => {
                const config = USE_CASE_LABELS[useCase]
                if (!config) return null
                const isSelected = selectedUseCases.includes(useCase)

                return (
                  <button
                    key={useCase}
                    type="button"
                    onClick={() => toggleUseCase(useCase)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                  >
                    <span>{config.icon}</span>
                    <span>{config.label}</span>
                  </button>
                )
              })}
            </div>
            {errors.useCases && (
              <p className="text-sm text-destructive">{errors.useCases}</p>
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
            <Button
              type="submit"
              disabled={processing || selectedUseCases.length === 0}
            >
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
