import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  CreditCard,
  FileText,
  UserPlus,
  ShieldCheck,
} from 'lucide-react'
import { type SidebarData } from '../types'
import { type Translation } from '@/locales'

export const getSidebarData = (t: Translation): SidebarData => ({
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
          url: '/sign-up/driver',
          icon: UserPlus,
        },
      ],
    },
    {
      title: t.nav.pages,
      items: [
        {
          title: 'Auth',
          icon: ShieldCheck,
          items: [
            {
              title: t.auth.signIn,
              url: '/sign-in',
            },
            {
              title: `${t.auth.signIn} (2 Col)`,
              url: '/sign-in-2',
            },
            {
              title: t.auth.signUp,
              url: '/sign-up',
            },
            {
              title: t.auth.forgotPassword,
              url: '/forgot-password',
            },
            {
              title: t.auth.otp,
              url: '/otp',
            },
          ],
        },
      ],
    },
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
