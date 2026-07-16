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

export const translateComment = (value) => {
  if (!value) return '';
  const key = String(value).toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
  const dict = {
    'very unhappy with the purchase': 'Satın aldığım için hiç memnun değilim!',
    'very satisfied': 'Çok memnun kaldım!',
    'great product': 'Harika bir ürün!',
    'excellent value for money': 'Fiyat/performans açısından mükemmel.',
    'highly recommended': 'Kesinlikle tavsiye ederim!',
    'good quality': 'İyi kalitede bir ürün.',
    'fast shipping': 'Hızlı kargo.',
    'waste of money': 'Paranızı boşa harcamayın.',
    'satisfied customer': 'Memnun bir müşteri.',
    'would buy again': 'Tekrar satın alırım.',
    'not as described': 'Görseldeki/açıklamadaki gibi değil.',
    'average quality': 'Ortalama kalitede.',
    'excellent': 'Mükemmel!',
    'awesome product': 'Harika bir ürün.',
    'very fast delivery': 'Çok hızlı teslimat.',
    'product is okay': 'Ürün idare eder.',
    'not worth the price': 'Bu fiyata değmez.',
    'superb': 'Harika!',
    'perfect fit': 'Tam uydu.',
    'beautiful': 'Çok güzel.',
    'worst purchase ever': 'Şimdiye kadarki en kötü alışverişim.',
    'poor quality': 'Düşük kalite.',
    'very disappointed': 'Büyük hayal kırıklığı.',
    'fast delivery': 'Hızlı teslimat.',
    'great value': 'Harika fiyat.',
    'love it': 'Çok beğendim!',
    'highly disappointed': 'Çok büyük hayal kırıklığı!',
    'very pleased': 'Çok memnunum.',
    'happy with the purchase': 'Alışverişten memnun kaldım.',
    'disappointed with the quality': 'Kalitesinden dolayı hayal kırıklığına uğradım.',
    'great experience': 'Harika bir deneyim.',
    'not satisfied': 'Memnun kalmadım.',
    'good value': 'İyi fiyat.',
    'very good': 'Çok iyi.',
    'will buy again': 'Tekrar alacağım.',
    'terrible product': 'Berbat bir ürün.',
    'doesnt work': 'Çalışmıyor / işe yaramıyor.',
    'okay product': 'Fena değil.'
  };

  for (const k in dict) {
    if (key.includes(k)) {
      return dict[k];
    }
  }

  return value;
};
