import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Drivers } from '@/features/drivers'

const driverSearchSchema = z.object({
  filter: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/drivers/')({
  validateSearch: driverSearchSchema,
  component: Drivers,
  beforeLoad: () => {
    document.title = 'Roadlink'
  },
})
