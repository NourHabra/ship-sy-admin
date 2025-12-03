import { useLanguage } from '@/context/language-provider'
import { ContentSection } from '../components/content-section'
import { AccountForm } from './account-form'

export function SettingsAccount() {
  const { t } = useLanguage()

  return (
    <ContentSection
      title={t.settings.account.title}
      desc={t.settings.account.description}
    >
      <AccountForm />
    </ContentSection>
  )
}
