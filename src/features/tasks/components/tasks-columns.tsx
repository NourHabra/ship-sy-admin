import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Translation } from '@/locales'
import { getStatuses } from '../data/data'
import { type Task } from '../data/schema'

export const getTasksColumns = (t: Translation): ColumnDef<Task>[] => {
  const statuses = getStatuses(t)
  
  return [
  {
    accessorKey: 'id',
    header: () => <div>{t.shipments.shipmentId}</div>,
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.shipments.date} />
    ),
    meta: { className: 'ps-1', tdClassName: 'ps-4' },
    cell: ({ row }) => {
      const date = row.getValue('date') as Date
      return (
        <span className='font-medium'>
          {date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
        </span>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: 'company',
    header: () => <div>{t.shipments.company}</div>,
    meta: { className: 'ps-1', tdClassName: 'ps-4' },
    cell: ({ row }) => (
      <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
        {row.getValue('company')}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'driver',
    header: () => <div>{t.shipments.driver}</div>,
    meta: { className: 'ps-1', tdClassName: 'ps-4' },
    cell: ({ row }) => (
      <span className='font-medium'>
        {row.getValue('driver')}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'source',
    header: () => <div>{t.shipments.source}</div>,
    meta: { className: 'ps-1', tdClassName: 'ps-4' },
    cell: ({ row }) => (
      <span className='font-medium'>
        {row.getValue('source')}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'destination',
    header: () => <div>{t.shipments.destination}</div>,
    meta: { className: 'ps-1', tdClassName: 'ps-4' },
    cell: ({ row }) => (
      <span className='font-medium'>
        {row.getValue('destination')}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'label',
    header: () => <div>{t.shipments.type}</div>,
    meta: { className: 'ps-1', tdClassName: 'ps-4' },
    cell: ({ row }) => {
      // Get the Arabic cargo type directly from the row data
      const task = row.original as Task & { cargoType?: string }
      return (
        <span className='font-medium'>
          {task.cargoType || ''}
        </span>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: () => <div>{t.shipments.status}</div>,
    meta: { className: 'ps-1', tdClassName: 'ps-4' },
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status')
      )

      if (!status) {
        return null
      }

      return (
        <div className='flex w-[100px] items-center gap-2'>
          {status.icon && (
            <status.icon className='text-muted-foreground size-4' />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
  },
]
}
