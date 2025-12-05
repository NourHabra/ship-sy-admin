import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Payments } from '@/features/payments'

const paymentsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  filter: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/payments/')({
  validateSearch: paymentsSearchSchema,
  component: Payments,
  beforeLoad: () => {
    document.title = 'Roadlink'
  },
})
