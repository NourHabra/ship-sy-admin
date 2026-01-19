import { createFileRoute } from '@tanstack/react-router'
import { CreateDriverProfile } from '@/features/driver-profile'

export const Route = createFileRoute('/(auth)/sign-up/driver')({
  component: CreateDriverProfile,
  beforeLoad: () => {
    document.title = 'Roadlink - Driver Sign Up'
  },
})
