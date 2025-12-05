import { Head, Link, useForm } from '@inertiajs/react'
import type { FormEventHandler } from 'react'
import { Button } from '../../components/ui/button'
import OnboardingLayout from '../../layouts/onboarding_layout'

interface ActionOption {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  premium?: boolean
}

const ACTION_OPTIONS: ActionOption[] = [
  {
    id: 'create_short_link',
    title: 'Créer un lien court',
    description:
      'Transformez une URL longue et improbable en un lien court et mémorable.',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    ),
  },
  {
    id: 'create_qr_code',
    title: 'Créer un Code QR',
    description:
      "Reliez une destination numérique au monde réel d'un simple scan.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
        />
      </svg>
    ),
  },
  {
    id: 'create_landing_page',
    title: 'Créer une page de destination',
    description:
      'Partagez vos meilleures idées sur une page de destination optimisée pour les appareils mobiles.',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    id: 'setup_custom_domain',
    title: 'Définir un domaine personnalisé',
    description:
      'Remplacez la partie « sky.py » dans vos liens courts par un domaine unique en lien avec votre marque.',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    ),
    premium: true,
  },
]

interface Props {
  firstActionOptions: string[]
}

export default function OnboardingStep3({
  firstActionOptions: _firstActionOptions,
}: Props) {
  const { data, setData, post, processing } = useForm({
    firstAction: '',
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    if (data.firstAction) {
      post('/onboarding/step3')
    }
  }

  const handleActionClick = (actionId: string, isPremium?: boolean) => {
    if (isPremium) {
      // For premium features, we could redirect to upgrade page
      // For now, just select it anyway
    }
    setData('firstAction', actionId)
  }

  const steps = [
    { label: 'À propos de vous', completed: true, active: false },
    { label: 'Votre travail', completed: true, active: false },
    { label: 'Commencer à créer', completed: false, active: true },
  ]

  return (
    <OnboardingLayout steps={steps}>
      <Head title="Commencer - Étape 3" />

      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Par où souhaitez-vous commencer ?
          </h2>
          <p className="text-muted-foreground mt-2">Parlons bit-ness</p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          {/* Action options */}
          <div className="space-y-3">
            {ACTION_OPTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => handleActionClick(action.id, action.premium)}
                className={`w-full flex items-start gap-4 p-4 rounded-lg border text-left transition-colors ${
                  data.firstAction === action.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    data.firstAction === action.id
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {action.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{action.title}</h3>
                    {action.premium && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded">
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
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        Surclassez votre forfait
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <Link
              href="/onboarding/skip"
              method="post"
              as="button"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Je me débrouille
            </Link>
            <Link
              href="/onboarding/step2"
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
            {data.firstAction && (
              <Button type="submit" disabled={processing}>
                {processing ? 'Chargement...' : "C'est parti !"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </OnboardingLayout>
  )
}
