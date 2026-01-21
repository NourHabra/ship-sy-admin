import { useEffect, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOutDialog } from '@/components/sign-out-dialog'
import { useLanguage } from '@/context/language-provider'
import { useAuthStore } from '@/stores/auth-store'
import { supabase } from '@/lib/supabase'
import { ROLES, getRoleDisplayName, type Role } from '@/lib/roles'

interface UserProfile {
  firstName: string
  lastName: string
  fullName: string
  roleDisplayName: string
  initials: string
}

function getInitials(firstName: string, lastName: string, email?: string): string {
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }
  if (firstName) {
    return firstName.charAt(0).toUpperCase()
  }
  if (email) {
    return email.charAt(0).toUpperCase()
  }
  return 'U'
}

export function ProfileDropdown() {
  const [open, setOpen] = useDialogState()
  const { t, language } = useLanguage()
  const { auth } = useAuthStore()
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    async function fetchUserProfile() {
      if (!auth.user?.id) {
        return
      }

      try {
        const userRole = auth.user.role?.[0] || ROLES.CUSTOMER
        let firstName = ''
        let lastName = ''
        let roleDisplayName = ''

        // Fetch role display name from roles table
        const { data: roleData, error: roleError } = await supabase
          .from('roles')
          .select('*')
          .eq('name', userRole)
          .single()

        if (roleData && !roleError) {
          roleDisplayName = getRoleDisplayName(roleData as Role, language)
        } else {
          // Fallback: capitalize the role name
          roleDisplayName = userRole.charAt(0).toUpperCase() + userRole.slice(1)
        }

        // Fetch user profile data based on role
        if (userRole === ROLES.DRIVER) {
          // Fetch from drivers table
          const { data: driverData } = await supabase
            .from('drivers')
            .select('first_name, last_name')
            .eq('id', auth.user.id)
            .single()

          if (driverData) {
            firstName = driverData.first_name || ''
            lastName = driverData.last_name || ''
          }
        } else {
          // For other roles, try to get from user metadata or use email
          firstName = auth.supabaseUser?.user_metadata?.first_name || ''
          lastName = auth.supabaseUser?.user_metadata?.last_name || ''

          // If no name in metadata, extract from email
          if (!firstName && auth.user.email) {
            const emailParts = auth.user.email.split('@')[0].split('.')
            firstName = emailParts[0] || ''
            lastName = emailParts[1] || ''
          }
        }

        // Fallback to email if no name found
        if (!firstName && !lastName) {
          firstName = auth.user.email?.split('@')[0] || 'User'
        }

        const fullName = [firstName, lastName].filter(Boolean).join(' ') || auth.user.email || 'User'
        const initials = getInitials(firstName, lastName, auth.user.email)

        setProfile({
          firstName,
          lastName,
          fullName,
          roleDisplayName: roleDisplayName || userRole,
          initials,
        })
      } catch (error) {
        console.error('Error fetching user profile:', error)
        // Fallback profile
        setProfile({
          firstName: auth.user.email?.split('@')[0] || 'User',
          lastName: '',
          fullName: auth.user.email || 'User',
          roleDisplayName: auth.user.role?.[0] || ROLES.CUSTOMER,
          initials: getInitials('', '', auth.user.email),
        })
      }
    }

    fetchUserProfile()
  }, [auth.user?.id, auth.user?.role, auth.user?.email, auth.supabaseUser, language])

  const displayName = profile?.fullName || auth.user?.email || 'User'
  const displayRole = profile?.roleDisplayName || auth.user?.role?.[0] || ''
  const initials = profile?.initials || 'U'

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={undefined} alt={displayName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col gap-1.5'>
              <p className='text-sm leading-none font-medium'>{displayName}</p>
              {displayRole && (
                <p className='text-muted-foreground text-xs leading-none'>
                  {displayRole}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem disabled>
              {t.profile.profile}
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              {t.profile.settings}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onClick={() => setOpen(true)}>
            {t.auth.signOut}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
