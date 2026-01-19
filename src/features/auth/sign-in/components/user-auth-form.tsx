import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { useLanguage } from '@/context/language-provider'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { ROLES } from '@/lib/roles'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const createFormSchema = (t: any) => z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? t.auth.emailRequired : undefined),
  }),
  password: z
    .string()
    .min(1, t.auth.passwordRequired),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()
  const { t } = useLanguage()

  const formSchema = createFormSchema(t)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        throw authError
      }

      if (!authData.user || !authData.session) {
        throw new Error('Failed to sign in')
      }

      // Set user and access token
      // Get user role from database
      const { data: userRoleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('id', authData.user.id)
        .single()

      const authUser = {
        id: authData.user.id,
        email: authData.user.email || '',
        role: userRoleData?.role ? [userRoleData.role] : [ROLES.CUSTOMER],
      }

      auth.setSupabaseUser(authData.user)
      auth.setUser(authUser)
      auth.setAccessToken(authData.session.access_token)

      // Redirect to the stored location or default to dashboard
      const targetPath = redirectTo || '/'
      navigate({ to: targetPath, replace: true })

      toast.success(`${t.auth.welcomeBack}, ${data.email}!`)
    } catch (error: any) {
      console.error('Sign-in error:', error)
      toast.error('Sign-in failed', {
        description: error.message || 'Invalid email or password. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.auth.email}</FormLabel>
              <FormControl>
                <Input placeholder={t.auth.emailPlaceholder} dir='ltr' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>{t.auth.password}</FormLabel>
              <FormControl>
                <PasswordInput placeholder={t.auth.passwordPlaceholder} dir='ltr' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75'
              >
                {t.auth.forgotPassword}
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          {t.auth.signIn}
        </Button>
      </form>
    </Form>
  )
}
