import { HouseIcon } from 'lucide-react'
import { NavLink, Outlet } from 'react-router'
import { Avatar, AvatarFallback } from '@/features/common/components/ui/avatar'
import { buttonVariants } from '@/features/common/components/ui/button'

const navItems = [{ to: '/', label: 'Home', icon: HouseIcon }]

export function AppLayout() {
  return (
    <div className="flex h-svh flex-col gap-2 bg-muted p-2">
      <header className="flex h-12 shrink-0 items-center justify-between rounded-lg border bg-background px-4">
        <span className="font-heading font-medium">better-management</span>
        <Avatar>
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </header>

      <div className="flex min-h-0 flex-1 gap-2">
        <nav
          aria-label="Main"
          className="flex w-12 shrink-0 flex-col items-center gap-1 rounded-lg border bg-background py-2"
        >
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              aria-label={label}
              className={({ isActive }) =>
                buttonVariants({
                  variant: isActive ? 'secondary' : 'ghost',
                  size: 'icon',
                })
              }
            >
              <Icon />
            </NavLink>
          ))}
        </nav>

        <main className="min-w-0 flex-1 overflow-auto rounded-lg border bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
