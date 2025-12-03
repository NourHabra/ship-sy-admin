import { z } from 'zod'

export const invoiceSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  customerName: z.string(),
  shipmentId: z.string(),
  amount: z.number(),
  status: z.enum(['paid', 'unpaid', 'overdue', 'cancelled']),
  issueDate: z.coerce.date(),
  dueDate: z.coerce.date(),
})

export type Invoice = z.infer<typeof invoiceSchema>

