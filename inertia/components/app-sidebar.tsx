import { Link, router, usePage } from '@inertiajs/react'
import {
  BarChart3,
  FileText,
  Home,
  Link2,
  LogOut,
  QrCode,
  Search,
  Settings,
  ShoppingBag,
  User as UserIcon,
} from 'lucide-react'
import * as React from 'react'
import { ProfileModal } from './profile-modal'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './ui/command'
import { Kbd } from './ui/kbd'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from './ui/sidebar'

interface User {
  id: string
  email: string
  username: string
  displayName: string | null
  profileImageUrl: string | null
  accountTier: 'free' | 'premium'
}

interface SharedProps {
  user?: User
}

const mainNavItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Liens',
    url: '/links',
    icon: Link2,
  },
  {
    title: 'Pages',
    url: '/pages',
    icon: FileText,
  },
  {
    title: 'Analytics',
    url: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'QR Codes',
    url: '/qr/generate',
    icon: QrCode,
  },
  {
    title: 'Boutique',
    url: '/shop',
    icon: ShoppingBag,
  },
]

const settingsNavItems = [
  {
    title: 'Paramètres UTM',
    url: '/utm-presets',
    icon: Settings,
  },
]

export function AppSidebar() {
  const { user } = usePage<SharedProps>().props
  const currentPath =
    typeof window !== 'undefined' ? window.location.pathname : ''
  const [commandOpen, setCommandOpen] = React.useState(false)
  const [profileOpen, setProfileOpen] = React.useState(false)

  // Keyboard shortcut to open command palette
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleNavigation = (url: string) => {
    setCommandOpen(false)
    router.visit(url)
  }

  const handleOpenProfile = () => {
    setCommandOpen(false)
    setProfileOpen(true)
  }

  const handleLogout = () => {
    setCommandOpen(false)
    router.post('/logout')
  }

  return (
    <>
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Rechercher une page ou une commande..." />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {mainNavItems.map((item) => (
              <CommandItem
                key={item.url}
                onSelect={() => handleNavigation(item.url)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Configuration">
            {settingsNavItems.map((item) => (
              <CommandItem
                key={item.url}
                onSelect={() => handleNavigation(item.url)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Compte">
            <CommandItem onSelect={handleOpenProfile}>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </CommandItem>
            <CommandItem onSelect={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />

      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <span className="text-lg font-bold">S</span>
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Skypy</span>
                    <span className="text-xs text-muted-foreground">
                      {user?.accountTier === 'premium' ? 'Premium' : 'Free'}
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* Search Button */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setCommandOpen(true)}
                className="w-full justify-between"
                tooltip="Rechercher"
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>Rechercher</span>
                </div>
                <Kbd>K</Kbd>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={currentPath === item.url}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Configuration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {settingsNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={currentPath === item.url}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setProfileOpen(true)}
                tooltip="Profil"
              >
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                    {user?.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={user.displayName || user.username}
                        className="size-8 rounded-full"
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {(user?.displayName || user?.username || 'U')
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium text-sm">
                      {user?.displayName || user?.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    </>
  )
}
