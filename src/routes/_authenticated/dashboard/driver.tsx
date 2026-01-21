import { createFileRoute } from '@tanstack/react-router'
import { DriverDashboard } from '@/features/dashboard/driver'

export const Route = createFileRoute('/_authenticated/dashboard/driver')({
  component: DriverDashboard,
})
