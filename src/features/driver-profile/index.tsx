import { useLanguage } from '@/context/language-provider'
import { DriverProfileForm } from './components/driver-profile-form'
import { ThemeSwitch } from '@/components/theme-switch'
import { LanguageSwitch } from '@/components/language-switch'
import { Logo } from '@/assets/logo'

export function CreateDriverProfile() {
    const { t } = useLanguage()

    return (
        <div className='min-h-screen bg-background'>
            {/* Header without sidebar */}
            <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
                <div className='container flex h-16 items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <Logo className='h-8 w-8' />
                        <div className='flex flex-col'>
                            <span className='text-xl font-semibold leading-tight'>SyriaShip</span>
                            {/* <span className='text-xs text-muted-foreground leading-tight'>{t.driverProfile.title}</span> */}
                        </div>
                    </div>
                    <div className='flex items-center gap-4'>
                        <ThemeSwitch />
                        <LanguageSwitch />
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className='container py-8'>
                <div className='mx-auto max-w-4xl'>
                    <div className='mb-8'>
                        <h1 className='text-3xl font-bold tracking-tight'>{t.driverProfile.title}</h1>
                        <p className='text-muted-foreground mt-2'>{t.driverProfile.description}</p>
                    </div>
                    <DriverProfileForm />
                </div>
            </main>
        </div>
    )
}

