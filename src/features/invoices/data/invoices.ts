import { faker } from '@faker-js/faker'

faker.seed(54321)

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

const statuses = ['paid', 'unpaid', 'overdue', 'cancelled'] as const

export const invoices = Array.from({ length: 250 }, (_, index) => {
  const customerName = faker.helpers.arrayElement(syrianCompanies)
  const status = faker.helpers.arrayElement(statuses)
  const issueDate = faker.date.recent({ days: 90 })
  const dueDate = new Date(issueDate)
  dueDate.setDate(dueDate.getDate() + faker.number.int({ min: 7, max: 30 }))
  
  return {
    id: `INV-${String(index + 1).padStart(6, '0')}`,
    customerId: faker.string.uuid(),
    customerName,
    shipmentId: `SHP-${String(faker.number.int({ min: 1, max: 1000 })).padStart(6, '0')}`,
    amount: faker.number.int({ min: 100, max: 8000 }),
    status,
    issueDate,
    dueDate,
  }
})

