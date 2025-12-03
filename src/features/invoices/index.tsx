import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { LanguageSwitch } from '@/components/language-switch'
import { useLanguage } from '@/context/language-provider'
import { InvoicesTable } from './components/invoices-table'
import { invoices } from './data/invoices'

const route = getRouteApi('/_authenticated/invoices/')

export function Invoices() {
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
            <h2 className='text-2xl font-bold tracking-tight'>{t.invoices.title}</h2>
            <p className='text-muted-foreground'>
              {t.invoices.description}
            </p>
          </div>
        </div>
        <InvoicesTable data={invoices} search={search} navigate={navigate} />
      </Main>
    </>
  )
}

