import { useSearch, Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useLanguage } from '@/context/language-provider'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })
  const { t } = useLanguage()

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight mb-8'>{t.auth.signIn}</CardTitle>
          <CardDescription>
            {/* {t.auth.enterEmailPassword} <br /> */}
            {/* {t.auth.logIntoAccount} */}
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <UserAuthForm redirectTo={redirect} />
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <Separator />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-background px-2 text-muted-foreground'>
                {t.auth.or || 'Or'}
              </span>
            </div>
          </div>
          <Link to='/sign-up/driver'>
            <Button variant='outline' className='w-full'>
              {t.auth.signUpAsDriver || 'Sign up as a driver'}
            </Button>
          </Link>
        </CardContent>
        <CardFooter>
          {/* <p className='text-muted-foreground px-8 text-center text-sm'>
            {t.auth.byClickingSignIn}{' '}
            <a
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              {t.auth.termsOfService}
            </a>{' '}
            {t.auth.and}{' '}
            <a
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              {t.auth.privacyPolicy}
            </a>
            .
          </p> */}
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
