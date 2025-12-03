import {
  LayoutDashboard,
  Package,
  Users,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Truck,
  CreditCard,
  FileText,
  UserPlus,
} from 'lucide-react'
import { type SidebarData } from '../types'
import { type Translation } from '@/locales'

export const getSidebarData = (t: Translation): SidebarData => ({
  teams: [
    {
      name: t.teams.shadcnAdmin,
      logo: Command,
      plan: 'Shipping Platform',
    },
    {
      name: t.teams.acmeInc,
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: t.teams.acmeCorp,
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: t.nav.general,
      items: [
        {
          title: t.nav.dashboard,
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: t.nav.shipments,
          url: '/shipments',
          icon: Package,
        },
        {
          title: t.nav.drivers,
          url: '/drivers',
          icon: Truck,
        },
        {
          title: t.nav.customers,
          url: '/users',
          icon: Users,
        },
      ],
    },
    {
      title: t.nav.financials,
      items: [
        {
          title: t.nav.payments,
          url: '/payments',
          icon: CreditCard,
        },
        {
          title: t.nav.invoices,
          url: '/invoices',
          icon: FileText,
        },
      ],
    },
    {
      title: '',
      items: [
        {
          title: t.nav.createDriverProfile,
          url: '/create-driver-profile',
          icon: UserPlus,
        },
      ],
    },
    // Hidden for later use
    // {
    //   title: t.nav.pages,
    //   items: [
    //     {
    //       title: 'Auth',
    //       icon: ShieldCheck,
    //       items: [
    //         {
    //           title: t.auth.signIn,
    //           url: '/sign-in',
    //         },
    //         {
    //           title: `${t.auth.signIn} (2 Col)`,
    //           url: '/sign-in-2',
    //         },
    //         {
    //           title: t.auth.signUp,
    //           url: '/sign-up',
    //         },
    //         {
    //           title: t.auth.forgotPassword,
    //           url: '/forgot-password',
    //         },
    //         {
    //           title: t.auth.otp,
    //           url: '/otp',
    //         },
    //       ],
    //     },
    //     {
    //       title: t.errors.internalServerError,
    //       icon: Bug,
    //       items: [
    //         {
    //           title: t.errors.unauthorized,
    //           url: '/errors/unauthorized',
    //           icon: Lock,
    //         },
    //         {
    //           title: t.errors.forbidden,
    //           url: '/errors/forbidden',
    //           icon: UserX,
    //         },
    //         {
    //           title: t.errors.notFound,
    //           url: '/errors/not-found',
    //           icon: FileX,
    //         },
    //         {
    //           title: t.errors.internalServerError,
    //           url: '/errors/internal-server-error',
    //           icon: ServerOff,
    //         },
    //         {
    //           title: t.errors.maintenanceError,
    //           url: '/errors/maintenance-error',
    //           icon: Construction,
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   title: t.nav.other,
    //   items: [
    //     {
    //       title: t.nav.settings,
    //       icon: Settings,
    //       items: [
    //         {
    //           title: t.settings.profile.title,
    //           url: '/settings',
    //           icon: UserCog,
    //         },
    //         {
    //           title: t.settings.account.title,
    //           url: '/settings/account',
    //           icon: Wrench,
    //         },
    //         {
    //           title: t.settings.appearance.title,
    //           url: '/settings/appearance',
    //           icon: Palette,
    //         },
    //         {
    //           title: t.settings.notifications.title,
    //           url: '/settings/notifications',
    //           icon: Bell,
    //         },
    //         {
    //           title: t.settings.display.title,
    //           url: '/settings/display',
    //           icon: Monitor,
    //         },
    //       ],
    //     },
    //     {
    //       title: t.nav.helpCenter,
    //       url: '/help-center',
    //       icon: HelpCircle,
    //     },
    //   ],
    // },
  ],
})
