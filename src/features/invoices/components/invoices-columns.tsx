import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type Invoice } from '../data/schema'
import { type Translation } from '@/locales'

export const getInvoicesColumns = (t: Translation): ColumnDef<Invoice>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.invoices.invoiceId} />
    ),
    cell: ({ row }) => (
      <div className='font-medium ps-3'>{row.getValue('id')}</div>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'issueDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.invoices.issueDate} />
    ),
    cell: ({ row }) => (
      <div className='text-nowrap'>
        {format(row.getValue('issueDate'), 'MM/dd/yyyy')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'customerName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.invoices.customer} />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48'>{row.getValue('customerName')}</LongText>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'shipmentId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.invoices.shipment} />
    ),
    cell: ({ row }) => (
      <div className='font-mono text-sm'>{row.getValue('shipmentId')}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.invoices.amount} />
    ),
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number
      return <div className='font-medium'>${amount.toLocaleString()}</div>
    },
    enableSorting: true,
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.invoices.dueDate} />
    ),
    cell: ({ row }) => (
      <div className='text-nowrap'>
        {format(row.getValue('dueDate'), 'MM/dd/yyyy')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.invoices.status} />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as keyof typeof t.invoices.statuses
      const statusColors = {
        paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        unpaid: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      }
      return (
        <div className={cn('inline-flex rounded-full px-2 py-1 text-xs font-semibold', statusColors[status])}>
          {t.invoices.statuses[status]}
        </div>
      )
    },
    enableSorting: false,
  },
]

export const invoicesColumns = (t: Translation) => getInvoicesColumns(t)

