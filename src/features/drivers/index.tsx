import { type ChangeEvent, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Phone, Mail, TrendingUp } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { LanguageSwitch } from '@/components/language-switch'
import { useLanguage } from '@/context/language-provider'
import { drivers } from './data/drivers'

const route = getRouteApi('/_authenticated/drivers/')

export function Drivers() {
  const { t } = useLanguage()
  const { filter = '' } = route.useSearch()
  const navigate = route.useNavigate()

  const [searchTerm, setSearchTerm] = useState(filter)

  const filteredDrivers = drivers
    .filter((driver) => driver.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    navigate({
      search: (prev) => ({
        ...prev,
        filter: e.target.value || undefined,
      }),
    })
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <div className='ms-auto flex items-center gap-4'>
          <ThemeSwitch />
          <LanguageSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Content ===== */}
      <Main fixed>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            {t.drivers.title}
          </h1>
          <p className='text-muted-foreground'>
            {t.drivers.description}
          </p>
        </div>
        <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
          <div className='flex flex-col gap-4 sm:my-4 sm:flex-row'>
            <Input
              placeholder={t.drivers.filterPlaceholder}
              className='h-9 w-40 lg:w-[250px]'
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        <Separator className='shadow-sm' />
        <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3'>
          {filteredDrivers.map((driver) => (
            <li
              key={driver.id}
              className='rounded-lg border p-4 hover:shadow-md'
            >
              <div className='mb-4 flex items-center gap-3'>
                <Avatar className='h-12 w-12'>
                  <AvatarImage src={driver.avatar} alt={driver.name} />
                  <AvatarFallback>{driver.name.split(' ')[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className='font-semibold'>{driver.name}</h2>
                  <p className='text-muted-foreground text-sm'>{driver.id}</p>
                </div>
              </div>

              <div className='space-y-2 text-sm'>
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <Phone size={14} />
                  <span>{driver.phone}</span>
                </div>
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <Mail size={14} />
                  <span className='truncate'>{driver.email}</span>
                </div>
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <TrendingUp size={14} />
                  <span>{driver.totalDeliveries} {t.drivers.deliveries}</span>
                </div>
              </div>

              <Separator className='my-3' />

              <div className='space-y-1 text-sm'>
                <p className='text-muted-foreground'>
                  <span className='font-medium'>{t.drivers.vehicle}:</span> {driver.vehicleType}
                </p>
                <p className='text-muted-foreground'>
                  <span className='font-medium'>{t.drivers.plate}:</span> {driver.vehiclePlate}
                </p>
                <p className='text-muted-foreground'>
                  <span className='font-medium'>{t.drivers.license}:</span> {driver.licenseNumber}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Main>
    </>
  )
}

