import { useLanguage } from '@/context/language-provider'
import { ContentSection } from '../components/content-section'
import { NotificationsForm } from './notifications-form'

export function SettingsNotifications() {
  const { t } = useLanguage()

  return (
    <ContentSection
      title={t.settings.notifications.title}
      desc={t.settings.notifications.description}
    >
      <NotificationsForm />
    </ContentSection>
  )
}
