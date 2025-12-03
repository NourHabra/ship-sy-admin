import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const data = [
  {
    name: 'Jan',
    shipments: 342,
  },
  {
    name: 'Feb',
    shipments: 389,
  },
  {
    name: 'Mar',
    shipments: 425,
  },
  {
    name: 'Apr',
    shipments: 398,
  },
  {
    name: 'May',
    shipments: 467,
  },
  {
    name: 'Jun',
    shipments: 512,
  },
  {
    name: 'Jul',
    shipments: 489,
  },
  {
    name: 'Aug',
    shipments: 534,
  },
  {
    name: 'Sep',
    shipments: 478,
  },
  {
    name: 'Oct',
    shipments: 556,
  },
  {
    name: 'Nov',
    shipments: 612,
  },
  {
    name: 'Dec',
    shipments: 587,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          direction='ltr'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey='shipments'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
