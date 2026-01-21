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
import { ROLES } from '@/lib/roles'
import type { LicenseType, VehicleType } from '@/lib/supabase'
import { Checkbox } from '@/components/ui/checkbox'

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
        .min(5, t.driverProfile.validation.nationalNumberMin)
        .max(20, t.driverProfile.validation.nationalNumberMax),
      dateOfBirth: z.string().min(1, t.driverProfile.validation.dateOfBirthRequired),
      placeOfBirth: z.string().min(2, t.driverProfile.validation.placeOfBirthRequired),
      phone: z
        .string()
        .min(9, t.driverProfile.validation.phoneNumberDigits)
        .max(9, t.driverProfile.validation.phoneNumberDigits)
        .regex(/^9\d{8}$/, t.driverProfile.validation.phoneNumberFormat),
      address: z
        .string()
        .min(5, t.driverProfile.validation.addressMin)
        .max(200, t.driverProfile.validation.addressMax),
      city: z.string().min(2, t.driverProfile.validation.cityRequired),
      country: z.string().min(1, t.driverProfile.validation.countryRequired),

      // License Information
      licenseNumber: z
        .string()
        .min(5, t.driverProfile.validation.licenseNumberMin)
        .max(20, t.driverProfile.validation.licenseNumberMax),
      licenseType: z.string().min(1, t.driverProfile.validation.licenseTypeRequired),
      licenseIssueDate: z.string().min(1, t.driverProfile.validation.licenseIssueDateRequired),
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

      // Vehicle Information
      vehicleType: z.string().min(1, t.driverProfile.validation.vehicleTypeRequired),
      vehicleMake: z.string().min(1, t.driverProfile.validation.vehicleMakeRequired),
      vehicleModel: z.string().min(1, t.driverProfile.validation.vehicleModelRequired),
      vehicleYear: z
        .string()
        .min(1, t.driverProfile.validation.vehicleYearInvalid)
        .regex(/^\d{4}$/, t.driverProfile.validation.vehicleYearInvalid)
        .refine((val) => {
          const year = parseInt(val)
          return year >= 1900 && year <= new Date().getFullYear() + 1
        }, t.driverProfile.validation.vehicleYearInvalid),
      vehicleVinNumber: z.string().optional(),
      vehicleHeadAxes: z.string().optional(),
      vehicleTailAxes: z.string().optional(),
      vehicleEmptyWeight: z.string().optional(),
      vehicleStandingWeight: z.string().optional(),
      vehicleIsChilled: z.boolean().optional(),
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
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
  const [loadingVehicleTypes, setLoadingVehicleTypes] = useState(true)
  const { t } = useLanguage()
  const navigate = useNavigate()

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
      vehicleType: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: '',
      vehicleVinNumber: '',
      vehicleHeadAxes: '',
      vehicleTailAxes: '',
      vehicleEmptyWeight: '',
      vehicleStandingWeight: '',
      vehicleIsChilled: false,
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

  // Load vehicle types on mount
  useEffect(() => {
    async function loadVehicleTypes() {
      try {
        const { data, error } = await supabase
          .from('vehicle_types')
          .select('id, name_en, name_ar, description_en, description_ar, standing_weight')
          .order('id')

        if (error) {
          console.error('Vehicle types query error:', error)
          throw error
        }

        console.log('Loaded vehicle types:', data)
        setVehicleTypes(data || [])
      } catch (error: any) {
        console.error('Error loading vehicle types:', error)
        toast.error('Failed to load vehicle types', {
          description: error.message || 'Please refresh the page and try again.',
        })
      } finally {
        setLoadingVehicleTypes(false)
      }
    }

    loadVehicleTypes()
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

      // Step 4: Create vehicle record
      const vehicleData: any = {
        driver_id: authData.user.id,
        type_id: parseInt(data.vehicleType),
        make: data.vehicleMake || null,
        model: data.vehicleModel || null,
        year: data.vehicleYear || null,
        vin_number: data.vehicleVinNumber || null,
        head_axes: data.vehicleHeadAxes ? parseFloat(data.vehicleHeadAxes) : null,
        tail_axes: data.vehicleTailAxes ? parseFloat(data.vehicleTailAxes) : null,
        empty_weight: data.vehicleEmptyWeight ? parseFloat(data.vehicleEmptyWeight) : null,
        standing_weight: data.vehicleStandingWeight ? parseFloat(data.vehicleStandingWeight) : null,
        is_chilled: data.vehicleIsChilled || false,
      }

      const { error: vehicleError } = await supabase
        .from('vehicles')
        .insert(vehicleData)

      if (vehicleError) {
        throw vehicleError
      }

      // Step 5: Redirect to login page after successful profile creation
      if (authData.session) {
        // User is automatically signed in (email confirmation disabled)
        // Sign out to ensure they log in manually
        await supabase.auth.signOut()
      }

      toast.success(t.driverProfile.success, {
        description: authData.session
          ? t.driverProfile.successDescription
          : 'Please check your email to confirm your account.',
      })

      // Navigate to login page
      navigate({ to: '/sign-in', replace: true })
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

        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t.driverProfile.vehicleInfo}</CardTitle>
            <CardDescription>{t.driverProfile.vehicleInfoDescription}</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4 sm:grid-cols-2'>
            <FormField
              control={form.control}
              name='vehicleType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.vehicleType}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loadingVehicleTypes}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder={t.driverProfile.vehicleTypePlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingVehicleTypes ? (
                          <SelectItem value='loading' disabled>
                            Loading...
                          </SelectItem>
                        ) : vehicleTypes.length === 0 ? (
                          <SelectItem value='none' disabled>
                            No vehicle types available
                          </SelectItem>
                        ) : (
                          vehicleTypes.map((type) => {
                            const isArabic = t.driverProfile.vehicleType === 'نوع المركبة'
                            const displayName = isArabic ? type.name_ar : type.name_en
                            const description = isArabic ? type.description_ar : type.description_en
                            const displayText = description
                              ? `${displayName || `Type ${type.id}`} - ${description}`
                              : displayName || `Type ${type.id}`
                            return (
                              <SelectItem key={type.id} value={type.id.toString()}>
                                {displayText}
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
            <div className='sm:col-span-2 grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='vehicleMake'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.driverProfile.vehicleMake}</FormLabel>
                    <FormControl>
                      <Input placeholder={t.driverProfile.vehicleMakePlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='vehicleModel'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.driverProfile.vehicleModel}</FormLabel>
                    <FormControl>
                      <Input placeholder={t.driverProfile.vehicleModelPlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='vehicleYear'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.vehicleYear}</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder={t.driverProfile.vehicleYearPlaceholder}
                      maxLength={4}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='vehicleVinNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.vehicleVinNumber || 'VIN Number'}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t.driverProfile.vehicleVinNumberPlaceholder || 'VIN Number'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='vehicleHeadAxes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.vehicleHeadAxes || 'Number of Head Axes'}</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder={t.driverProfile.vehicleHeadAxesPlaceholder || 'Number of head axes'}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='vehicleTailAxes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.vehicleTailAxes || 'Number of Tail Axes'}</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder={t.driverProfile.vehicleTailAxesPlaceholder || 'Number of tail axes'}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='vehicleEmptyWeight'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.vehicleEmptyWeight || 'Empty Weight (Tons)'}</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder={t.driverProfile.vehicleEmptyWeightPlaceholder || 'Empty Weight'}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d.]/g, '')
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='vehicleStandingWeight'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t.driverProfile.vehicleStandingWeight || 'Standing Weight (Tons)'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder={
                        t.driverProfile.vehicleStandingWeightPlaceholder || 'Standing Weight'
                      }
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d.]/g, '')
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='vehicleIsChilled'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 sm:col-span-2'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>{t.driverProfile.isChilled}</FormLabel>
                    <p className='text-sm text-muted-foreground'>
                      {t.driverProfile.isChilledDescription}
                    </p>
                  </div>
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
                      dir='ltr'
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
                      dir='ltr'
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
                      dir='ltr'
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
