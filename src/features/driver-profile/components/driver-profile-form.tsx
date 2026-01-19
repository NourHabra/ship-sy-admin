import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useLanguage } from '@/context/language-provider'
import { cn } from '@/lib/utils'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MobileDatePicker } from '@/components/mobile-date-picker'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth-store'
import { ROLES } from '@/lib/roles'
import type { LicenseType } from '@/lib/supabase'

const createFormSchema = (t: any) =>
  z
    .object({
      // Personal Information
      firstName: z
        .string()
        .min(2, t.driverProfile.validation.firstNameMin)
        .max(50, t.driverProfile.validation.firstNameMax),
      lastName: z
        .string()
        .min(2, t.driverProfile.validation.lastNameMin)
        .max(50, t.driverProfile.validation.lastNameMax),
      nationalNumber: z
        .string()
        .min(5, 'National number must be at least 5 characters')
        .max(20, 'National number must be at most 20 characters'),
      dateOfBirth: z.string().min(1, t.driverProfile.validation.dateOfBirthRequired),
      placeOfBirth: z.string().min(2, 'Place of birth is required'),
      phone: z
        .string()
        .min(9, 'Mobile number must be 9 digits')
        .max(9, 'Mobile number must be 9 digits')
        .regex(/^9\d{8}$/, 'Mobile number must start with 9 and be 9 digits'),
      address: z
        .string()
        .min(5, t.driverProfile.validation.addressMin)
        .max(200, t.driverProfile.validation.addressMax),
      city: z.string().min(2, t.driverProfile.validation.cityRequired),
      country: z.string().default('Syria'),
      
      // License Information
      licenseNumber: z
        .string()
        .min(5, t.driverProfile.validation.licenseNumberMin)
        .max(20, t.driverProfile.validation.licenseNumberMax),
      licenseType: z.string().min(1, 'License type is required'),
      licenseIssueDate: z.string().min(1, 'License issue date is required'),
      licenseExpiryDate: z.string().min(1, t.driverProfile.validation.licenseExpiryRequired),
      
      // Account Credentials
      email: z
        .string()
        .email(t.driverProfile.validation.emailInvalid)
        .min(1, t.driverProfile.validation.emailRequired),
      password: z
        .string()
        .min(1, t.driverProfile.validation.passwordRequired)
        .min(8, t.driverProfile.validation.passwordMin)
        .regex(/[a-zA-Z]/, t.driverProfile.validation.passwordMustContainLetter)
        .regex(/[0-9]/, t.driverProfile.validation.passwordMustContainDigit),
      confirmPassword: z
        .string()
        .min(1, t.driverProfile.validation.confirmPasswordRequired),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t.driverProfile.validation.passwordsDontMatch,
      path: ['confirmPassword'],
    })

type DriverProfileFormValues = z.infer<ReturnType<typeof createFormSchema>>

export function DriverProfileForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false)
  const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>([])
  const [loadingLicenseTypes, setLoadingLicenseTypes] = useState(true)
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const formSchema = createFormSchema(t)

  const form = useForm<DriverProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      nationalNumber: '',
      dateOfBirth: '',
      placeOfBirth: '',
      phone: '',
      address: '',
      city: '',
      country: 'Syria',
      licenseNumber: '',
      licenseType: '',
      licenseIssueDate: '',
      licenseExpiryDate: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  // Load license types on mount
  useEffect(() => {
    async function loadLicenseTypes() {
      try {
        const { data, error } = await supabase
          .from('license_types')
          .select('id, name_en, name_ar')
          .order('id')

        if (error) {
          console.error('License types query error:', error)
          throw error
        }

        console.log('Loaded license types:', data)
        setLicenseTypes(data || [])
      } catch (error: any) {
        console.error('Error loading license types:', error)
        toast.error('Failed to load license types', {
          description: error.message || 'Please refresh the page and try again.',
        })
      } finally {
        setLoadingLicenseTypes(false)
      }
    }

    loadLicenseTypes()
  }, [])

  async function onSubmit(data: DriverProfileFormValues) {
    setIsLoading(true)

    try {
      // Step 1: Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            role: 'driver',
          },
        },
      })

      if (authError) {
        throw authError
      }

      if (!authData.user) {
        throw new Error('Failed to create user account')
      }

      // Step 2: Create driver record in the database
      // Format phone number with +963 prefix
      const formattedPhone = `+963${data.phone}`
      
      const { error: driverError } = await supabase
        .from('drivers')
        .insert({
          id: authData.user.id,
          first_name: data.firstName,
          last_name: data.lastName,
          national_number: data.nationalNumber,
          date_of_birth: data.dateOfBirth,
          place_of_birth: data.placeOfBirth,
          country: data.country,
          city: data.city,
          address: data.address,
          phone: formattedPhone,
          email: data.email,
          license_number: data.licenseNumber,
          license_type: parseInt(data.licenseType),
          license_issue_date: data.licenseIssueDate,
          license_expiry_date: data.licenseExpiryDate,
          is_verified: false,
        })

      if (driverError) {
        throw driverError
      }

      // Step 3: Set user role to 'driver'
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          id: authData.user.id,
          role: ROLES.DRIVER,
        })

      if (roleError) {
        // Log error but don't fail sign-up if role insertion fails
        console.error('Error setting user role:', roleError)
      }

      // Step 4: If email confirmation is required, show message
      // Otherwise, sign in the user automatically
      if (authData.session) {
        // User is automatically signed in (email confirmation disabled)
        const authUser = {
          id: authData.user.id,
          email: authData.user.email || '',
          role: [ROLES.DRIVER],
        }
        auth.setSupabaseUser(authData.user)
        auth.setUser(authUser)
        auth.setAccessToken(authData.session.access_token)

        toast.success(t.driverProfile.success, {
          description: t.driverProfile.successDescription,
        })

        // Navigate to dashboard
        navigate({ to: '/', replace: true })
      } else {
        // Email confirmation required
        toast.success(t.driverProfile.success, {
          description: 'Please check your email to confirm your account.',
        })
        navigate({ to: '/sign-in', replace: true })
      }
    } catch (error: any) {
      console.error('Driver sign-up error:', error)
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
        className={cn('space-y-6', className)}
        autoComplete='off'
        {...props}
      >
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t.driverProfile.personalInfo}</CardTitle>
            <CardDescription>{t.driverProfile.personalInfoDescription}</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4 sm:grid-cols-2'>
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.firstName}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.driverProfile.firstNamePlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.lastName}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.driverProfile.lastNamePlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='nationalNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.nationalNumber}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.driverProfile.nationalNumberPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='dateOfBirth'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.dateOfBirth}</FormLabel>
                  <FormControl>
                    <MobileDatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t.driverProfile.dateOfBirth}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='placeOfBirth'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.placeOfBirth}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.driverProfile.placeOfBirthPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.phoneNumber}</FormLabel>
                  <FormControl>
                    <div className='flex items-center' dir='ltr'>
                      <Select disabled value='+963'>
                        <SelectTrigger className='w-[100px] rounded-r-none border-r-0'>
                          <SelectValue>
                            <span className='flex items-center gap-1.5'>
                              <span>🇸🇾</span>
                              <span>+963</span>
                            </span>
                          </SelectValue>
                        </SelectTrigger>
                      </Select>
                      <Input
                        type='tel'
                        placeholder={t.driverProfile.phoneNumberPlaceholder}
                        className='rounded-l-none'
                        maxLength={9}
                        dir='ltr'
                        {...field}
                        onChange={(e) => {
                          // Only allow digits and ensure it starts with 9
                          const value = e.target.value.replace(/\D/g, '')
                          if (value === '' || (value.startsWith('9') && value.length <= 9)) {
                            field.onChange(value)
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem className='sm:col-span-2'>
                  <FormLabel>{t.driverProfile.address}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.driverProfile.addressPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='city'
              render={({ field }) => {
                const isArabic = t.driverProfile.city === 'المدينة'
                const syrianCities = [
                  { value: 'Damascus', en: 'Damascus', ar: 'دمشق' },
                  { value: 'Aleppo', en: 'Aleppo', ar: 'حلب' },
                  { value: 'Homs', en: 'Homs', ar: 'حمص' },
                  { value: 'Latakia', en: 'Latakia', ar: 'اللاذقية' },
                  { value: 'Hama', en: 'Hama', ar: 'حماة' },
                  { value: 'Tartus', en: 'Tartus', ar: 'طرطوس' },
                  { value: 'Deir ez-Zor', en: 'Deir ez-Zor', ar: 'دير الزور' },
                  { value: 'Hasakah', en: 'Hasakah', ar: 'الحسكة' },
                  { value: 'Raqqa', en: 'Raqqa', ar: 'الرقة' },
                  { value: 'Daraa', en: 'Daraa', ar: 'درعا' },
                  { value: 'Idlib', en: 'Idlib', ar: 'إدلب' },
                  { value: 'As-Suwayda', en: 'As-Suwayda', ar: 'السويداء' },
                  { value: 'Quneitra', en: 'Quneitra', ar: 'القنيطرة' },
                  { value: 'Rif Dimashq', en: 'Rif Dimashq', ar: 'ريف دمشق' },
                ]
                return (
                  <FormItem>
                    <FormLabel>{t.driverProfile.city}</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder={t.driverProfile.cityPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {syrianCities.map((city) => (
                            <SelectItem key={city.value} value={city.value}>
                              {isArabic ? city.ar : city.en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name='country'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.country}</FormLabel>
                  <FormControl>
                    <Select disabled value='Syria' onValueChange={field.onChange}>
                      <SelectTrigger className='w-full'>
                        <SelectValue>
                          <span>🇸🇾 Syria / سوريا</span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Syria'>🇸🇾 Syria / سوريا</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Separator />

        {/* License Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t.driverProfile.licenseInfo}</CardTitle>
            <CardDescription>{t.driverProfile.licenseInfoDescription}</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4 sm:grid-cols-2'>
            <FormField
              control={form.control}
              name='licenseNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.licenseNumber}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.driverProfile.licenseNumberPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='licenseType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.licenseType}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loadingLicenseTypes}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder={t.driverProfile.licenseClassPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingLicenseTypes ? (
                          <SelectItem value='loading' disabled>
                            Loading...
                          </SelectItem>
                        ) : licenseTypes.length === 0 ? (
                          <SelectItem value='none' disabled>
                            No license types available
                          </SelectItem>
                        ) : (
                          licenseTypes.map((type) => {
                            const isArabic = t.driverProfile.licenseType === 'نوع الرخصة'
                            const displayName = isArabic ? type.name_ar : type.name_en
                            return (
                              <SelectItem key={type.id} value={type.id.toString()}>
                                {displayName}
                              </SelectItem>
                            )
                          })
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='licenseIssueDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.licenseIssueDate}</FormLabel>
                  <FormControl>
                    <MobileDatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t.driverProfile.licenseIssueDate}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='licenseExpiryDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.licenseExpiry}</FormLabel>
                  <FormControl>
                    <MobileDatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t.driverProfile.licenseExpiry}
                      allowFuture={true}
                      minDate={new Date('2025-01-01')}
                      maxDate={new Date('2040-12-31')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Separator />

        {/* Account Credentials */}
        <Card>
          <CardHeader>
            <CardTitle>{t.driverProfile.accountCredentials}</CardTitle>
            <CardDescription>{t.driverProfile.accountCredentialsDescription}</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4 sm:grid-cols-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='sm:col-span-2'>
                  <FormLabel>{t.driverProfile.email}</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder={t.driverProfile.emailPlaceholder}
                      autoComplete='off'
                      data-form-type='other'
                      {...field}
                    />
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
                  <FormLabel>{t.driverProfile.password}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t.driverProfile.passwordPlaceholder}
                      autoComplete='new-password'
                      data-form-type='other'
                      {...field}
                    />
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
                  <FormLabel>{t.driverProfile.confirmPassword}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t.driverProfile.passwordPlaceholder}
                      autoComplete='new-password'
                      data-form-type='other'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type='submit' className='w-full' disabled={isLoading} size='lg'>
          {isLoading ? t.driverProfile.submitting : t.driverProfile.submit}
        </Button>
      </form>
    </Form>
  )
}
