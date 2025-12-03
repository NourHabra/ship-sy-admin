import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/language-provider'

export function ForbiddenError() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>403</h1>
        <span className='font-medium'>{t.errorPages.forbidden.title}</span>
        <p className='text-muted-foreground text-center'>
          {t.errorPages.forbidden.description}
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => history.go(-1)}>
            {t.errorPages.forbidden.goBack}
          </Button>
          <Button onClick={() => navigate({ to: '/' })}>
            {t.errorPages.forbidden.backToHome}
          </Button>
        </div>
      </div>
    </div>
  )
}
