import { createFileRoute } from '@tanstack/react-router'
import { CreateDriverProfile } from '@/features/driver-profile'

export const Route = createFileRoute('/(public)/create-driver-profile')({
  component: CreateDriverProfile,
  beforeLoad: () => {
    document.title = 'Roadlink'
  },
})
