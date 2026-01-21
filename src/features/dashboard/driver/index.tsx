import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { supabase, type Driver, type LicenseType, type Vehicle, type VehicleType } from '@/lib/supabase'
import { useLanguage } from '@/context/language-provider'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { LanguageSwitch } from '@/components/language-switch'
import { Construction, Clock, Shield, CheckCircle2, XCircle, Truck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function DriverDashboard() {
  const { auth } = useAuthStore()
  const { t, language } = useLanguage()
  const [firstName, setFirstName] = useState<string>('')
  const [driverData, setDriverData] = useState<Driver | null>(null)
  const [licenseType, setLicenseType] = useState<LicenseType | null>(null)
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  function formatDate(dateString: string): string {
    if (!dateString) return '-'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString(language === 'ar' ? 'ar-SY' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  useEffect(() => {
    // Update document title
    document.title = `${t.dashboard.driver.welcome} - Roadlink`
  }, [t])

  useEffect(() => {
    async function fetchDriverData() {
      if (!auth.user?.id) return

      try {
        // Fetch all driver data
        const { data, error } = await supabase
          .from('drivers')
          .select('*')
          .eq('id', auth.user.id)
          .single()

        if (error) {
          console.error('Error fetching driver data:', error)
          // Fallback to user metadata if available
          const metadataFirstName = auth.supabaseUser?.user_metadata?.first_name
          if (metadataFirstName) {
            setFirstName(metadataFirstName)
          }
        } else if (data) {
          setDriverData(data as Driver)
          setFirstName(data.first_name || '')

          // Fetch license type if available
          if (data.license_type) {
            const { data: licenseData } = await supabase
              .from('license_types')
              .select('*')
              .eq('id', data.license_type)
              .single()

            if (licenseData) {
              setLicenseType(licenseData as LicenseType)
            }
          }

          // Fetch vehicle data
          const { data: vehicleData, error: vehicleError } = await supabase
            .from('vehicles')
            .select('*')
            .eq('driver_id', auth.user.id)
            .maybeSingle()

          if (vehicleError) {
            console.error('Error fetching vehicle data:', vehicleError)
          } else if (vehicleData) {
            setVehicle(vehicleData as Vehicle)

            // Fetch vehicle type if available
            if (vehicleData.type_id) {
              const { data: vehicleTypeData } = await supabase
                .from('vehicle_types')
                .select('*')
                .eq('id', vehicleData.type_id)
                .single()

              if (vehicleTypeData) {
                setVehicleType(vehicleTypeData as VehicleType)
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching driver data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDriverData()
  }, [auth.user?.id, auth.supabaseUser])

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <LanguageSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='space-y-6'>
          {/* Welcome Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                {firstName
                  ? t.dashboard.driver.welcomeWithName.replace('{name}', firstName)
                  : `${t.dashboard.driver.welcome}!`}
              </CardTitle>
              <CardDescription>
                {isLoading
                  ? t.dashboard.driver.loading
                  : t.dashboard.driver.welcomeDescription}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Information Cards Grid */}
          <div className='grid gap-4 md:grid-cols-3'>
            {/* Under Development Card */}
            <Card className='border-orange-200 dark:border-orange-900'>
              <CardContent className='pt-6'>
                <div className='flex items-center gap-3'>
                  <div className='rounded-lg bg-orange-100 p-2 dark:bg-orange-900/20 shrink-0'>
                    <Construction className='h-5 w-5 text-orange-600 dark:text-orange-400' />
                  </div>
                  <p className='text-base text-muted-foreground'>
                    {t.dashboard.driver.underDevelopment}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Come Back Soon Card */}
            <Card className='border-blue-200 dark:border-blue-900'>
              <CardContent className='pt-6'>
                <div className='flex items-center gap-3'>
                  <div className='rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20 shrink-0'>
                    <Clock className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                  </div>
                  <p className='text-base text-muted-foreground'>
                    {t.dashboard.driver.comeBackSoon}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Keep Password Safe Card */}
            <Card className='border-green-200 dark:border-green-900'>
              <CardContent className='pt-6'>
                <div className='flex items-center gap-3'>
                  <div className='rounded-lg bg-green-100 p-2 dark:bg-green-900/20 shrink-0'>
                    <Shield className='h-5 w-5 text-green-600 dark:text-green-400' />
                  </div>
                  <p className='text-base text-muted-foreground'>
                    {t.dashboard.driver.keepPasswordSafe}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Driver Details Panel */}
          {driverData && (
            <Card>
              <CardHeader>
                <CardTitle>{t.dashboard.driver.driverDetails}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6 md:grid-cols-2'>
                  {/* Personal Information Section */}
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold'>{t.driverProfile.personalInfo}</h3>
                    <div className='space-y-3'>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>{t.driverProfile.firstName}</p>
                        <p className='text-base'>{driverData.first_name || '-'}</p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>{t.driverProfile.lastName}</p>
                        <p className='text-base'>{driverData.last_name || '-'}</p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>{t.driverProfile.email}</p>
                        <p className='text-base'>{driverData.email || '-'}</p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>{t.driverProfile.phoneNumber}</p>
                        <p className='text-base'>{driverData.phone || '-'}</p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>{t.driverProfile.nationalNumber}</p>
                        <p className='text-base'>{driverData.national_number || '-'}</p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>{t.driverProfile.dateOfBirth}</p>
                        <p className='text-base'>{formatDate(driverData.date_of_birth)}</p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>{t.driverProfile.placeOfBirth}</p>
                        <p className='text-base'>{driverData.place_of_birth || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Address & License Information Section */}
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold'>{t.dashboard.driver.addressInformation}</h3>
                    <div className='space-y-3'>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>{t.driverProfile.country}</p>
                        <p className='text-base'>{driverData.country || '-'}</p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>{t.driverProfile.city}</p>
                        <p className='text-base'>{driverData.city || '-'}</p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>{t.driverProfile.address}</p>
                        <p className='text-base'>{driverData.address || '-'}</p>
                      </div>
                    </div>

                    <h3 className='text-lg font-semibold mt-6'>{t.driverProfile.licenseInfo}</h3>
                    <div className='space-y-3'>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>{t.driverProfile.licenseNumber}</p>
                        <p className='text-base'>{driverData.license_number || '-'}</p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>{t.driverProfile.licenseType}</p>
                        <p className='text-base'>
                          {licenseType
                            ? language === 'ar'
                              ? licenseType.name_ar
                              : licenseType.name_en
                            : '-'}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>{t.driverProfile.licenseIssueDate}</p>
                        <p className='text-base'>{formatDate(driverData.license_issue_date)}</p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>{t.driverProfile.licenseExpiry}</p>
                        <p className='text-base'>{formatDate(driverData.license_expiry_date)}</p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground mb-2'>{t.dashboard.driver.verificationStatus}</p>
                        <Badge variant={driverData.is_verified ? 'default' : 'secondary'} className='gap-1.5'>
                          {driverData.is_verified ? (
                            <>
                              <CheckCircle2 className='h-3.5 w-3.5' />
                              {t.dashboard.driver.verified}
                            </>
                          ) : (
                            <>
                              <XCircle className='h-3.5 w-3.5' />
                              {t.dashboard.driver.notVerified}
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vehicle Details Panel */}
          {vehicle && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Truck className='h-5 w-5' />
                  {t.driverProfile.vehicleInfo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6 md:grid-cols-2'>
                  {/* Vehicle Basic Information */}
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold'>{t.driverProfile.vehicleInfo}</h3>
                    <div className='space-y-3'>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>{t.driverProfile.vehicleType}</p>
                        <p className='text-base'>
                          {vehicleType
                            ? language === 'ar'
                              ? vehicleType.name_ar || vehicleType.name_en || '-'
                              : vehicleType.name_en || vehicleType.name_ar || '-'
                            : '-'}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>{t.driverProfile.vehicleMake}</p>
                        <p className='text-base'>{vehicle.make || '-'}</p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>{t.driverProfile.vehicleModel}</p>
                        <p className='text-base'>{vehicle.model || '-'}</p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>{t.driverProfile.vehicleYear}</p>
                        <p className='text-base'>{vehicle.year || '-'}</p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>{t.driverProfile.vehicleVinNumber || 'VIN Number'}</p>
                        <p className='text-base'>{vehicle.vin_number || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Specifications */}
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold'>{language === 'ar' ? 'مواصفات المركبة' : 'Vehicle Specifications'}</h3>
                    <div className='space-y-3'>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>{t.driverProfile.vehicleHeadAxes || 'Number of Head Axes'}</p>
                        <p className='text-base'>{vehicle.head_axes !== null ? vehicle.head_axes : '-'}</p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>{t.driverProfile.vehicleTailAxes || 'Number of Tail Axes'}</p>
                        <p className='text-base'>{vehicle.tail_axes !== null ? vehicle.tail_axes : '-'}</p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>{t.driverProfile.vehicleEmptyWeight || 'Empty Weight (Tons)'}</p>
                        <p className='text-base'>{vehicle.empty_weight !== null ? `${vehicle.empty_weight} ${language === 'ar' ? 'طن' : 'Tons'}` : '-'}</p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>{t.driverProfile.vehicleStandingWeight || 'Standing Weight (Tons)'}</p>
                        <p className='text-base'>{vehicle.standing_weight !== null ? `${vehicle.standing_weight} ${language === 'ar' ? 'طن' : 'Tons'}` : '-'}</p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground mb-2'>{t.driverProfile.isChilled || 'Refrigerated Vehicle'}</p>
                        <Badge variant={vehicle.is_chilled ? 'default' : 'secondary'} className='gap-1.5'>
                          {vehicle.is_chilled ? (
                            <>
                              <CheckCircle2 className='h-3.5 w-3.5' />
                              {language === 'ar' ? 'نعم' : 'Yes'}
                            </>
                          ) : (
                            <>
                              <XCircle className='h-3.5 w-3.5' />
                              {language === 'ar' ? 'لا' : 'No'}
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </Main>
    </>
  )
}

