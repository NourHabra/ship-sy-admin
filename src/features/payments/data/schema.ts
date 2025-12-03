import { z } from 'zod'

export const paymentSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  customerName: z.string(),
  amount: z.number(),
  method: z.enum(['cash', 'card', 'transfer', 'check']),
  status: z.enum(['completed', 'pending', 'failed', 'refunded']),
  date: z.coerce.date(),
})

export type Payment = z.infer<typeof paymentSchema>

