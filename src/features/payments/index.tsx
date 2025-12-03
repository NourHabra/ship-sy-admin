import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { LanguageSwitch } from '@/components/language-switch'
import { useLanguage } from '@/context/language-provider'
import { PaymentsTable } from './components/payments-table'
import { payments } from './data/payments'

const route = getRouteApi('/_authenticated/payments/')

export function Payments() {
  const { t } = useLanguage()
  const search = route.useSearch()
  const navigate = route.useNavigate()

  return (
    <>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <LanguageSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>{t.payments.title}</h2>
            <p className='text-muted-foreground'>
              {t.payments.description}
            </p>
          </div>
        </div>
        <PaymentsTable data={payments} search={search} navigate={navigate} />
      </Main>
    </>
  )
}

