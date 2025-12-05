import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Users } from '@/features/users'

const customersSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Per-column text filter (for company name)
  companyName: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/users/')({
  validateSearch: customersSearchSchema,
  component: Users,
  beforeLoad: () => {
    document.title = 'Roadlink'
  },
})
