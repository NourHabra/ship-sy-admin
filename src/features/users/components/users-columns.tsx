import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type User } from '../data/schema'
import { type Translation } from '@/locales'

export const getUsersColumns = (t: Translation): ColumnDef<User>[] => [
  {
    accessorKey: 'companyName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.customers.companyName} />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48 ps-3'>{row.getValue('companyName')}</LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'contactPerson',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.customers.contactPerson} />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('contactPerson')}</LongText>
    ),
    meta: { className: 'w-36' },
    enableSorting: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.customers.email} />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>{row.getValue('email')}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.customers.phone} />
    ),
    cell: ({ row }) => <div>{row.getValue('phoneNumber')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'city',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.customers.city} />
    ),
    cell: ({ row }) => <div>{row.getValue('city')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'totalShipments',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.customers.totalShipments} />
    ),
    cell: ({ row }) => <div className='text-center'>{row.getValue('totalShipments')}</div>,
    enableSorting: true,
  },
  {
    accessorKey: 'registeredDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.customers.registeredDate} />
    ),
    cell: ({ row }) => (
      <div className='text-nowrap'>
        {format(row.getValue('registeredDate'), 'MM/dd/yyyy')}
      </div>
    ),
    enableSorting: true,
  },
]

// Export as default for backwards compatibility
export const usersColumns = (t: Translation) => getUsersColumns(t)
