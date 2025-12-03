import { faker } from '@faker-js/faker'

// Set a fixed seed for consistent data generation
faker.seed(67890)

const syrianCompanies = [
  'شركة الشام للإلكترونيات',
  'مؤسسة الفرات التجارية',
  'شركة دمشق للأدوية',
  'مصنع حلب للنسيج',
  'شركة البحر المتوسط للأغذية',
  'مؤسسة سوريا للمستلزمات الطبية',
  'شركة الأمانة للتجارة العامة',
  'مصنع النصر للصناعات',
  'شركة الزهراء للاستيراد والتصدير',
  'مؤسسة الياسمين التجارية',
  'شركة النور للمواد الغذائية',
  'مصنع حمص للصناعات الغذائية',
  'شركة الشرق للبناء والإعمار',
  'مؤسسة الأمل للتكنولوجيا',
  'شركة السلام للخدمات اللوجستية',
  'مصنع اللاذقية للمعلبات',
  'شركة الوفاء للاستيراد',
  'مؤسسة الرشيد التجارية',
  'شركة الحكمة للأدوات الكهربائية',
  'مصنع طرطوس للبلاستيك',
]

const syrianNames = [
  'أحمد الخطيب',
  'خالد اليوسف',
  'عمر منصور',
  'باسل النوري',
  'طارق المحمود',
  'فادي الخوري',
  'نبيل السعد',
  'رامي علوان',
  'محمد الأحمد',
  'سامر القاضي',
  'وليد حمادة',
  'عماد الدين',
  'ياسر الحلبي',
  'مازن الشامي',
  'زياد العلي',
  'فراس الحسن',
]

const syrianCities = [
  'دمشق',
  'حلب',
  'حمص',
  'اللاذقية',
  'حماة',
  'طرطوس',
  'دير الزور',
  'الرقة',
  'درعا',
  'السويداء',
]

const syrianAddresses = [
  'شارع بغداد',
  'شارع الثورة',
  'حي المزة',
  'حي الشعلان',
  'شارع الحمراء',
  'حي العزيزية',
  'شارع النيل',
  'حي الصالحية',
  'شارع الجلاء',
  'حي المهاجرين',
]

export const users = Array.from({ length: 500 }, () => {
  return {
    id: `CUST-${faker.number.int({ min: 1000, max: 9999 })}`,
    companyName: faker.helpers.arrayElement(syrianCompanies),
    contactPerson: faker.helpers.arrayElement(syrianNames),
    email: faker.internet.email().toLowerCase(),
    phoneNumber: `+963 9${faker.string.numeric(8)}`,
    address: faker.helpers.arrayElement(syrianAddresses),
    city: faker.helpers.arrayElement(syrianCities),
    totalShipments: faker.number.int({ min: 5, max: 500 }),
    registeredDate: faker.date.past({ years: 3 }),
  }
})
