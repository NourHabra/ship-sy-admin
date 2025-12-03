import { Telescope } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'

export function ComingSoon() {
  const { t } = useLanguage()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <Telescope size={72} />
        <h1 className='text-4xl leading-tight font-bold'>{t.comingSoon.title}</h1>
        <p className='text-muted-foreground text-center'>
          {t.comingSoon.description}
        </p>
      </div>
    </div>
  )
}
