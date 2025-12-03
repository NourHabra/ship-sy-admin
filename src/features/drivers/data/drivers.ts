import { faker } from '@faker-js/faker'

// Set a fixed seed for consistent data generation
faker.seed(54321)

const syrianDriverNames = [
  'أحمد الحسن',
  'خالد يوسف',
  'عمر منصور',
  'باسل النوري',
  'طارق محمود',
  'فادي خوري',
  'نبيل سعد',
  'رامي علوان',
  'محمد الأحمد',
  'سامر القاضي',
  'وليد حمادة',
  'عماد الدين',
  'ياسر العلي',
  'كريم الشامي',
  'زياد الحموي',
]

export type Driver = {
  id: string
  name: string
  phone: string
  email: string
  licenseNumber: string
  vehicleType: string
  vehiclePlate: string
  totalDeliveries: number
  joinedDate: Date
  avatar: string
}

export const drivers: Driver[] = Array.from({ length: 15 }, (_, index) => {
  const name = syrianDriverNames[index % syrianDriverNames.length]
  const firstName = name.split(' ')[0]
  
  return {
    id: `DRV-${faker.number.int({ min: 1000, max: 9999 })}`,
    name,
    phone: `+963 ${faker.string.numeric(3)} ${faker.string.numeric(3)} ${faker.string.numeric(3)}`,
    email: `${faker.helpers.slugify(name.toLowerCase())}@driver.sy`,
    licenseNumber: `SY-${faker.string.numeric(6)}`,
    vehicleType: faker.helpers.arrayElement([
      'شاحنة صغيرة',
      'شاحنة متوسطة',
      'شاحنة كبيرة',
      'فان',
    ]),
    vehiclePlate: `${faker.helpers.arrayElement(['دمشق', 'حلب', 'حمص'])} ${faker.string.numeric(5)}`,
    totalDeliveries: faker.number.int({ min: 50, max: 500 }),
    joinedDate: faker.date.past({ years: 3 }),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`,
  }
})

