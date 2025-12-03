import { z } from 'zod'

const customerSchema = z.object({
  id: z.string(),
  companyName: z.string(),
  contactPerson: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  address: z.string(),
  city: z.string(),
  totalShipments: z.number(),
  registeredDate: z.coerce.date(),
})
export type Customer = z.infer<typeof customerSchema>

// Keep the old User type for backwards compatibility
export type User = Customer

export const customerListSchema = z.array(customerSchema)
export const userListSchema = customerListSchema
