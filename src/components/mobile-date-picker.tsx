import { format, parse } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type MobileDatePickerProps = {
  value: string // ISO date string (YYYY-MM-DD) or empty string
  onChange: (value: string) => void // Returns ISO date string (YYYY-MM-DD)
  placeholder?: string
  className?: string
  disabled?: boolean
  allowFuture?: boolean // Allow dates in the future (default: false)
  minDate?: Date // Minimum selectable date
  maxDate?: Date // Maximum selectable date
}

export function MobileDatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  className,
  disabled = false,
  allowFuture = false,
  minDate,
  maxDate,
}: MobileDatePickerProps) {
  // Convert string to Date object
  const selectedDate = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined

  // Handle date selection
  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // Convert Date to ISO string (YYYY-MM-DD)
      const isoString = format(date, 'yyyy-MM-dd')
      onChange(isoString)
    } else {
      onChange('')
    }
  }

  // Format date for display (dd/MM/yyyy)
  const displayValue = selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''

  return (
    <div className={cn('w-full', className)}>
      {/* Mobile: Use native date input */}
      <div className='block md:hidden'>
        <input
          type='date'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={minDate ? format(minDate, 'yyyy-MM-dd') : '1900-01-01'}
          max={maxDate ? format(maxDate, 'yyyy-MM-dd') : allowFuture ? undefined : format(new Date(), 'yyyy-MM-dd')}
          className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>

      {/* Desktop: Use calendar popover */}
      <div className='hidden md:block'>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              disabled={disabled}
              data-empty={!selectedDate}
              className={cn(
                'data-[empty=true]:text-muted-foreground w-full justify-start text-start font-normal',
                className
              )}
            >
              {displayValue || <span>{placeholder}</span>}
              <CalendarIcon className='ms-auto h-4 w-4 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='single'
              captionLayout='dropdown'
              selected={selectedDate}
              onSelect={handleSelect}
              fromYear={minDate ? minDate.getFullYear() : 1900}
              toYear={maxDate ? maxDate.getFullYear() : allowFuture ? 2040 : new Date().getFullYear()}
              disabled={(date: Date) => {
                const checkDate = new Date(date)
                checkDate.setHours(0, 0, 0, 0)
                
                // Check minimum date
                if (minDate) {
                  const min = new Date(minDate)
                  min.setHours(0, 0, 0, 0)
                  if (checkDate < min) return true
                } else {
                  const minAllowed = new Date('1900-01-01')
                  minAllowed.setHours(0, 0, 0, 0)
                  if (checkDate < minAllowed) return true
                }
                
                // Check maximum date
                if (maxDate) {
                  const max = new Date(maxDate)
                  max.setHours(0, 0, 0, 0)
                  if (checkDate > max) return true
                } else if (!allowFuture) {
                  // Only restrict future dates if allowFuture is false
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  if (checkDate > today) return true
                }
                
                return false
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

