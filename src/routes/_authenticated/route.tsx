import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthStore } from '@/stores/auth-store'
import { ROLES } from '@/lib/roles'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: ({ location }) => {
    const { auth } = useAuthStore.getState()
    const currentPath = location.pathname

    // Only allow driver dashboard path under /_authenticated
    const isDriverDashboard = currentPath === '/dashboard/driver' || currentPath.startsWith('/dashboard/driver/')

    // If not driver dashboard, redirect to login
    if (!isDriverDashboard) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: currentPath,
        },
        replace: true,
      })
    }

    // For driver dashboard, check authentication and role
    if (isDriverDashboard) {
      if (!auth.user) {
        throw redirect({
          to: '/sign-in',
          search: {
            redirect: currentPath,
          },
          replace: true,
        })
      }

      // Check if user is a driver
      const isDriver = auth.user.role?.[0] === ROLES.DRIVER
      if (!isDriver) {
        throw redirect({
          to: '/sign-in',
          replace: true,
        })
      }
    }
  },
})
