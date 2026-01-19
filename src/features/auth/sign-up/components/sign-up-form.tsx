import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useLanguage } from '@/context/language-provider'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth-store'
import { ROLES } from '@/lib/roles'
import { toast } from 'sonner'
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

const createFormSchema = (t: any) => z
  .object({
    email: z.email({
      error: (iss) =>
        iss.input === '' ? t.auth.emailRequired : undefined,
    }),
    password: z
      .string()
      .min(1, t.auth.passwordRequired)
      .min(8, t.auth.passwordMin)
      .regex(/[a-zA-Z]/, t.auth.passwordMustContainLetter)
      .regex(/[0-9]/, t.auth.passwordMustContainDigit),
    confirmPassword: z.string().min(1, t.auth.confirmPasswordRequired),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t.auth.passwordsDontMatch,
    path: ['confirmPassword'],
  })

export function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const formSchema = createFormSchema(t)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        throw authError
      }

      if (!authData.user) {
        throw new Error('Failed to create user account')
      }

      // If email confirmation is required, show message
      // Otherwise, sign in the user automatically
      if (authData.session) {
        // User is automatically signed in (email confirmation disabled)
        const authUser = {
          id: authData.user.id,
          email: authData.user.email || '',
          role: [ROLES.CUSTOMER],
        }
        
        // Set user role in database
        await supabase
          .from('user_roles')
          .insert({
            id: authData.user.id,
            role: ROLES.CUSTOMER,
          })
          .catch((error) => {
            // Log error but don't fail sign-up
            console.error('Error setting user role:', error)
          })
        auth.setSupabaseUser(authData.user)
        auth.setUser(authUser)
        auth.setAccessToken(authData.session.access_token)

        toast.success('Account created successfully!')
        navigate({ to: '/', replace: true })
      } else {
        // Email confirmation required
        toast.success('Account created! Please check your email to confirm your account.')
        navigate({ to: '/sign-in', replace: true })
      }
    } catch (error: any) {
      console.error('Sign-up error:', error)
      toast.error('Sign-up failed', {
        description: error.message || 'An error occurred during sign-up. Please try again.',
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
            <FormItem>
              <FormLabel>{t.auth.password}</FormLabel>
              <FormControl>
                <PasswordInput placeholder={t.auth.passwordPlaceholder} dir='ltr' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.auth.confirmPassword}</FormLabel>
              <FormControl>
                <PasswordInput placeholder={t.auth.passwordPlaceholder} dir='ltr' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {t.auth.createAccount}
        </Button>
      </form>
    </Form>
  )
}
