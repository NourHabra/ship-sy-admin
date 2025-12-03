import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLanguage } from '@/context/language-provider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

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
      email: z
        .string()
        .email(t.driverProfile.validation.emailInvalid)
        .min(1, t.driverProfile.validation.emailRequired),
      password: z
        .string()
        .min(1, t.driverProfile.validation.passwordRequired)
        .min(8, t.driverProfile.validation.passwordMin),
      confirmPassword: z
        .string()
        .min(1, t.driverProfile.validation.confirmPasswordRequired),
      phoneNumber: z
        .string()
        .min(10, t.driverProfile.validation.phoneNumberMin)
        .regex(/^[0-9+\-\s()]+$/, t.driverProfile.validation.phoneNumberInvalid),
      dateOfBirth: z.string().min(1, t.driverProfile.validation.dateOfBirthRequired),
      address: z
        .string()
        .min(5, t.driverProfile.validation.addressMin)
        .max(200, t.driverProfile.validation.addressMax),
      city: z.string().min(2, t.driverProfile.validation.cityRequired),
      
      // License Information
      licenseNumber: z
        .string()
        .min(5, t.driverProfile.validation.licenseNumberMin)
        .max(20, t.driverProfile.validation.licenseNumberMax),
      licenseExpiry: z.string().min(1, t.driverProfile.validation.licenseExpiryRequired),
      licenseClass: z.string().min(1, t.driverProfile.validation.licenseClassRequired),
      
      // Vehicle Information
      vehicleType: z.string().min(2, t.driverProfile.validation.vehicleTypeRequired),
      vehicleMake: z.string().min(2, t.driverProfile.validation.vehicleMakeRequired),
      vehicleModel: z.string().min(2, t.driverProfile.validation.vehicleModelRequired),
      vehicleYear: z
        .string()
        .regex(/^\d{4}$/, t.driverProfile.validation.vehicleYearInvalid)
        .refine(
          (year) => {
            const yearNum = parseInt(year)
            return yearNum >= 1900 && yearNum <= new Date().getFullYear() + 1
          },
          { message: t.driverProfile.validation.vehicleYearInvalid }
        ),
      vehiclePlate: z
        .string()
        .min(3, t.driverProfile.validation.vehiclePlateMin)
        .max(15, t.driverProfile.validation.vehiclePlateMax),
      vehicleColor: z.string().min(2, t.driverProfile.validation.vehicleColorRequired),
      vehicleCapacity: z
        .string()
        .regex(/^\d+(\.\d+)?$/, t.driverProfile.validation.vehicleCapacityInvalid),
      isChilled: z.boolean(),
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
  const { t } = useLanguage()

  const formSchema = createFormSchema(t)

  const form = useForm<DriverProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      dateOfBirth: '',
      address: '',
      city: '',
      licenseNumber: '',
      licenseExpiry: '',
      licenseClass: '',
      vehicleType: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: '',
      vehiclePlate: '',
      vehicleColor: '',
      vehicleCapacity: '',
      isChilled: false,
    },
  })

  function onSubmit(data: DriverProfileFormValues) {
    setIsLoading(true)
    // eslint-disable-next-line no-console
    console.log('Driver Profile Data:', data)

    setTimeout(() => {
      setIsLoading(false)
      toast.success(t.driverProfile.success, {
        description: t.driverProfile.successDescription,
      })
      form.reset()
    }, 2000)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-6', className)}
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
              name='phoneNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.phoneNumber}</FormLabel>
                  <FormControl>
                    <Input
                      type='tel'
                      placeholder={t.driverProfile.phoneNumberPlaceholder}
                      {...field}
                    />
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
                    <Input type='date' {...field} />
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.city}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.driverProfile.cityPlaceholder} {...field} />
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
              name='licenseClass'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.licenseClass}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.driverProfile.licenseClassPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='licenseExpiry'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.licenseExpiry}</FormLabel>
                  <FormControl>
                    <Input type='date' {...field} />
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
                    <Input placeholder={t.driverProfile.vehicleTypePlaceholder} {...field} />
                  </FormControl>
                  <FormDescription>{t.driverProfile.vehicleTypeDescription}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name='vehicleYear'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.vehicleYear}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.driverProfile.vehicleYearPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='vehiclePlate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.vehiclePlate}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.driverProfile.vehiclePlatePlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='vehicleColor'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.vehicleColor}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.driverProfile.vehicleColorPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='vehicleCapacity'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.driverProfile.vehicleCapacity}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.driverProfile.vehicleCapacityPlaceholder} {...field} />
                  </FormControl>
                  <FormDescription>{t.driverProfile.vehicleCapacityDescription}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isChilled'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>{t.driverProfile.isChilled}</FormLabel>
                    <FormDescription>{t.driverProfile.isChilledDescription}</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
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
                    <PasswordInput placeholder={t.driverProfile.passwordPlaceholder} {...field} />
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
                    <PasswordInput placeholder={t.driverProfile.passwordPlaceholder} {...field} />
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

