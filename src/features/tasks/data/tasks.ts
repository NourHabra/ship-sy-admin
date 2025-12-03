import { faker } from '@faker-js/faker'

// Set a fixed seed for consistent data generation
faker.seed(12345)

// Arabic content for shipments
const syrianCities = [
  'دمشق',
  'حلب',
  'حمص',
  'اللاذقية',
  'حماة',
  'طرطوس',
]

const borderCrossings = [
  'معبر نصيب',
  'معبر باب الهوى',
]

const syrianCompanies = [
  'شركة الشام للإلكترونيات',
  'مؤسسة الفرات التجارية',
  'شركة دمشق للأدوية',
  'مصنع حلب للمنسوجات',
  'شركة البحر المتوسط للمواد الغذائية',
  'مؤسسة سوريا للتوريدات الطبية',
  'شركة الأمانة للتجارة العامة',
  'معمل النصر للصناعات',
  'شركة الزهراء للاستيراد والتصدير',
  'مؤسسة الياسمين التجارية',
  'شركة النور للمواد الغذائية',
  'معامل حمص للصناعات الغذائية',
]

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
]

const cargoTypesArabic = {
  electronics: 'إلكترونيات',
  food: 'مواد غذائية',
  medical: 'مستلزمات طبية',
  textiles: 'منسوجات',
  machinery: 'قطع غيار',
}

const allLocations = [...syrianCities, ...borderCrossings]

export const tasks = Array.from({ length: 100 }, () => {
  const statuses = [
    'pending',
    'in transit',
    'at border',
    'delivered',
    'cancelled',
  ] as const
  const labels = ['electronics', 'food', 'medical', 'textiles', 'machinery'] as const

  const source = faker.helpers.arrayElement(allLocations)
  let destination = faker.helpers.arrayElement(allLocations)
  while (destination === source) {
    destination = faker.helpers.arrayElement(allLocations)
  }

  const label = faker.helpers.arrayElement(labels)

  return {
    id: `SH-${faker.number.int({ min: 1000, max: 9999 })}`,
    title: `${source} → ${destination}`,
    status: faker.helpers.arrayElement(statuses),
    label: label,
    company: faker.helpers.arrayElement(syrianCompanies),
    driver: faker.helpers.arrayElement(syrianDriverNames),
    source: source,
    destination: destination,
    date: faker.date.recent({ days: 30 }),
    cargoType: cargoTypesArabic[label],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    description: `شحنة ${cargoTypesArabic[label]} من ${source} إلى ${destination}. الوزن: ${faker.number.float({ min: 0.5, max: 5, fractionDigits: 1 })} طن.`,
    dueDate: faker.date.future(),
  }
})
