import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import logoLight from './Roadlink-logo-light-theme.png'
import logoDark from './Roadlink-logo-dark-theme.png'

export function Logo({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('size-6', className)} {...props}>
      <img
        src={logoLight}
        alt='Roadlink'
        className='h-full w-full object-contain dark:hidden'
      />
      <img
        src={logoDark}
        alt='Roadlink'
        className='hidden h-full w-full object-contain dark:block'
      />
    </div>
  )
}
