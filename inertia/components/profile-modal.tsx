'use client'

import { usePage } from '@inertiajs/react'
import { Bell, CreditCard, Key, LogOut, Settings, User } from 'lucide-react'
import * as React from 'react'
import { cn } from '../lib/utils'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import { Switch } from './ui/switch'

interface UserData {
  id: string
  email: string
  username: string
  displayName: string | null
  profileImageUrl: string | null
  accountTier: 'free' | 'premium'
}

interface SharedProps {
  user?: UserData
}

type ProfileSection = 'profile' | 'account' | 'notifications' | 'billing'

const menuItems = [
  {
    id: 'profile' as ProfileSection,
    label: 'Profil',
    icon: User,
  },
  {
    id: 'account' as ProfileSection,
    label: 'Compte',
    icon: Settings,
  },
  {
    id: 'notifications' as ProfileSection,
    label: 'Notifications',
    icon: Bell,
  },
  {
    id: 'billing' as ProfileSection,
    label: 'Facturation',
    icon: CreditCard,
  },
]

interface ProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { user } = usePage<SharedProps>().props
  const [activeSection, setActiveSection] =
    React.useState<ProfileSection>('profile')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Paramètres du profil</DialogTitle>
        <DialogDescription className="sr-only">
          Gérez vos paramètres de profil et de compte
        </DialogDescription>

        <div className="flex h-[500px]">
          {/* Left sidebar menu */}
          <div className="w-56 border-r bg-muted/30 p-4 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.displayName || user.username}
                    className="size-10 rounded-full"
                  />
                ) : (
                  <span className="text-sm font-semibold">
                    {(user?.displayName || user?.username || 'U')
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm">
                  {user?.displayName || user?.username}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user?.accountTier === 'premium' ? 'Premium' : 'Gratuit'}
                </span>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    activeSection === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-auto">
              <Separator className="my-4" />
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </div>
          </div>

          {/* Right content area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeSection === 'profile' && <ProfileSection user={user} />}
            {activeSection === 'account' && <AccountSection user={user} />}
            {activeSection === 'notifications' && <NotificationsSection />}
            {activeSection === 'billing' && <BillingSection user={user} />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ProfileSection({ user }: { user?: UserData }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Profil</h2>
        <p className="text-sm text-muted-foreground">
          Gérez vos informations personnelles
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user.displayName || user.username}
                className="size-16 rounded-full"
              />
            ) : (
              <span className="text-xl font-semibold">
                {(user?.displayName || user?.username || 'U')
                  .charAt(0)
                  .toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <Button variant="outline" size="sm">
              Changer la photo
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="displayName">Nom d'affichage</Label>
            <Input
              id="displayName"
              defaultValue={user?.displayName || ''}
              placeholder="Votre nom d'affichage"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input
              id="username"
              defaultValue={user?.username || ''}
              placeholder="Votre nom d'utilisateur"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button>Enregistrer</Button>
      </div>
    </div>
  )
}

function AccountSection({ user }: { user?: UserData }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Compte</h2>
        <p className="text-sm text-muted-foreground">
          Gérez vos paramètres de compte
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            defaultValue={user?.email || ''}
            placeholder="Votre adresse email"
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Key className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Mot de passe</p>
              <p className="text-xs text-muted-foreground">
                Dernière modification il y a 3 mois
              </p>
            </div>
            <Button variant="outline" size="sm">
              Modifier
            </Button>
          </div>
        </div>

        <Separator />

        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
          <h3 className="text-sm font-medium text-destructive">
            Zone de danger
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Une fois votre compte supprimé, toutes vos données seront
            définitivement effacées.
          </p>
          <Button variant="destructive" size="sm" className="mt-3">
            Supprimer le compte
          </Button>
        </div>
      </div>
    </div>
  )
}

function NotificationsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Configurez vos préférences de notification
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Notifications par email</p>
            <p className="text-xs text-muted-foreground">
              Recevez des mises à jour par email
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Rapports hebdomadaires</p>
            <p className="text-xs text-muted-foreground">
              Recevez un résumé hebdomadaire de vos analytics
            </p>
          </div>
          <Switch />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Alertes de clics</p>
            <p className="text-xs text-muted-foreground">
              Soyez notifié quand vos liens atteignent des objectifs
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Nouveautés produit</p>
            <p className="text-xs text-muted-foreground">
              Recevez des informations sur les nouvelles fonctionnalités
            </p>
          </div>
          <Switch />
        </div>
      </div>
    </div>
  )
}

function BillingSection({ user }: { user?: UserData }) {
  const isPremium = user?.accountTier === 'premium'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Facturation</h2>
        <p className="text-sm text-muted-foreground">
          Gérez votre abonnement et vos factures
        </p>
      </div>

      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">
              Plan {isPremium ? 'Premium' : 'Gratuit'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isPremium
                ? 'Accès à toutes les fonctionnalités'
                : 'Fonctionnalités limitées'}
            </p>
          </div>
          {!isPremium && <Button>Passer à Premium</Button>}
        </div>
      </div>

      {isPremium && (
        <>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Historique des factures</h3>
            <div className="rounded-lg border divide-y">
              <div className="flex items-center justify-between p-3">
                <div>
                  <p className="text-sm font-medium">Décembre 2024</p>
                  <p className="text-xs text-muted-foreground">9,99 €</p>
                </div>
                <Button variant="ghost" size="sm">
                  Télécharger
                </Button>
              </div>
              <div className="flex items-center justify-between p-3">
                <div>
                  <p className="text-sm font-medium">Novembre 2024</p>
                  <p className="text-xs text-muted-foreground">9,99 €</p>
                </div>
                <Button variant="ghost" size="sm">
                  Télécharger
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-orange-500/50 bg-orange-500/5 p-4">
            <p className="text-sm font-medium text-orange-600">
              Annuler l'abonnement
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Votre abonnement sera actif jusqu'à la fin de la période en cours.
            </p>
            <Button variant="outline" size="sm" className="mt-3">
              Annuler
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
