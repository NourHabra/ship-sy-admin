import {
  Circle,
  CheckCircle,
  Timer,
  Truck,
  XCircle,
} from 'lucide-react'
import type { Translation } from '@/locales'

// Raw value exports for route validation (doesn't need translation)
export const statusValues = [
  { value: 'pending' as const, icon: Circle },
  { value: 'in transit' as const, icon: Truck },
  { value: 'at border' as const, icon: Timer },
  { value: 'delivered' as const, icon: CheckCircle },
  { value: 'cancelled' as const, icon: XCircle },
]

export const getLabels = (t: Translation) => [
  {
    value: 'electronics',
    label: t.shipments.cargoTypes.electronics,
  },
  {
    value: 'food',
    label: t.shipments.cargoTypes.food,
  },
  {
    value: 'medical',
    label: t.shipments.cargoTypes.medical,
  },
  {
    value: 'textiles',
    label: t.shipments.cargoTypes.textiles,
  },
  {
    value: 'machinery',
    label: t.shipments.cargoTypes.machinery,
  },
]

export const getStatuses = (t: Translation) => [
  {
    label: t.shipments.statuses.pending,
    value: 'pending' as const,
    icon: Circle,
  },
  {
    label: t.shipments.statuses.inTransit,
    value: 'in transit' as const,
    icon: Truck,
  },
  {
    label: t.shipments.statuses.atBorder,
    value: 'at border' as const,
    icon: Timer,
  },
  {
    label: t.shipments.statuses.delivered,
    value: 'delivered' as const,
    icon: CheckCircle,
  },
  {
    label: t.shipments.statuses.cancelled,
    value: 'cancelled' as const,
    icon: XCircle,
  },
]

