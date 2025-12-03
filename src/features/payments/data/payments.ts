import { faker } from '@faker-js/faker'

faker.seed(12345)

const syrianCompanies = [
  'شركة الشام للإلكترونيات',
  'مؤسسة الفرات التجارية',
  'شركة دمشق للأدوية',
  'مصنع حلب للنسيج',
  'شركة البحر الأبيض المتوسط للمواد الغذائية',
  'مؤسسة سوريا للمستلزمات الطبية',
  'شركة الأمانة للتجارة العامة',
  'مصنع النصر للصناعات',
  'شركة الزهراء للاستيراد والتصدير',
  'مؤسسة الياسمين التجارية',
  'شركة النور للمواد الغذائية',
  'مصنع حمص للصناعات الغذائية',
]

const methods = ['cash', 'card', 'transfer', 'check'] as const
const statuses = ['completed', 'pending', 'failed', 'refunded'] as const

export const payments = Array.from({ length: 300 }, (_, index) => {
  const customerName = faker.helpers.arrayElement(syrianCompanies)
  const status = faker.helpers.arrayElement(statuses)
  const method = faker.helpers.arrayElement(methods)
  
  return {
    id: `PAY-${String(index + 1).padStart(6, '0')}`,
    customerId: faker.string.uuid(),
    customerName,
    amount: faker.number.int({ min: 50, max: 5000 }),
    method,
    status,
    date: faker.date.recent({ days: 180 }),
  }
})

