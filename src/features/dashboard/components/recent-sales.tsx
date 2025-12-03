import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/context/language-provider'

const shipments = [
  {
    id: 'SH-2847',
    from: 'damascus',
    to: 'nasib',
    status: 'inTransit',
    cargo: 'electronics',
    weight: '2.4',
    unit: 'tons',
  },
  {
    id: 'SH-2846',
    from: 'babAlHawa',
    to: 'aleppo',
    status: 'delivered',
    cargo: 'foodProducts',
    weight: '1.8',
    unit: 'tons',
  },
  {
    id: 'SH-2845',
    from: 'latakia',
    to: 'homs',
    status: 'atBorder',
    cargo: 'medicalSupplies',
    weight: '850',
    unit: 'kg',
  },
  {
    id: 'SH-2844',
    from: 'homs',
    to: 'nasib',
    status: 'inTransit',
    cargo: 'textiles',
    weight: '3.2',
    unit: 'tons',
  },
  {
    id: 'SH-2843',
    from: 'damascus',
    to: 'nasib',
    status: 'pending',
    cargo: 'machineryParts',
    weight: '1.5',
    unit: 'tons',
  },
]

const statusColors = {
  inTransit: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
  atBorder: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  pending: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
}

export function RecentSales() {
  const { t, language } = useLanguage()

  return (
    <div className='space-y-6'>
      {shipments.map((shipment) => {
        const fromCity = t.cities[shipment.from as keyof typeof t.cities]
        const toCity = t.cities[shipment.to as keyof typeof t.cities]
        const arrow = language === 'ar' ? '←' : '→'
        const route = `${fromCity} ${arrow} ${toCity}`
        const cargoType = t.cargo[shipment.cargo as keyof typeof t.cargo]
        const unit = t.units[shipment.unit as keyof typeof t.units]

        return (
          <div key={shipment.id} className='flex items-center gap-4'>
            <div className='bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold'>
              {shipment.id.split('-')[1]}
            </div>
            <div className='flex flex-1 flex-col gap-1'>
              <div className='flex items-center justify-between'>
                <p className='text-sm leading-none font-medium'>{shipment.id}</p>
                <Badge variant='outline' className={statusColors[shipment.status as keyof typeof statusColors]}>
                  {t.shipmentStatus[shipment.status as keyof typeof t.shipmentStatus]}
                </Badge>
              </div>
              <p className='text-muted-foreground text-xs'>{route}</p>
              <p className='text-muted-foreground text-xs'>
                {cargoType} • {shipment.weight} {unit}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
