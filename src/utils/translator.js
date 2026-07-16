export const categoryTranslations = {
  'beauty': 'Kozmetik & Güzellik',
  'skin-care': 'Cilt Bakımı',
  'fragrances': 'Parfüm & Koku',
  'furniture': 'Mobilya & Dekorasyon',
  'groceries': 'Gıda & Süpermarket',
  'home-decoration': 'Ev Dekorasyonu',
  'kitchen-accessories': 'Mutfak Aksesuarları',
  'laptops': 'Dizüstü Bilgisayar',
  'mens-shirts': 'Erkek Giyim',
  'mens-shoes': 'Erkek Ayakkabı',
  'mens-watches': 'Erkek Kol Saatleri',
  'mobile-accessories': 'Telefon Aksesuarları',
  'smartphones': 'Cep Telefonları',
  'sports-accessories': 'Spor Aksesuarları',
  'sunglasses': 'Güneş Gözlüğü',
  'tablets': 'Tabletler',
  'tops': 'Kadın Giyim',
  'vehicle': 'Otomotiv',
  'automotive': 'Oto Aksesuar',
  'motorcycle': 'Motosiklet Ekipmanı',
  'lighting': 'Dekoratif Aydınlatma',
  'womens-bags': 'Kadın Çanta',
  'womens-dresses': 'Kadın Elbise',
  'womens-jewellery': 'Kadın Takı & Mücevher',
  'womens-shoes': 'Kadın Ayakkabı',
  'womens-watches': 'Kadın Saatleri'
};

export const translateCategory = (value) => {
  if (!value) return '';
  const key = String(value).toLowerCase().trim();
  return categoryTranslations[key] || value.replaceAll('-', ' ').replace(/\b\w/g, c => c.toLocaleUpperCase('tr-TR'));
};
