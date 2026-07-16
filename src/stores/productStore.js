import { defineStore } from 'pinia';
import axios from 'axios';
import { fetchInitialProducts } from '../services/dataService';
import { useSalesStore } from './salesStore'; // SalesStore import edildi
import { useCartStore } from './cartStore';
import { useFavoriteStore } from './favoriteStore';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: JSON.parse(localStorage.getItem('products')) || [],
    isLoading: false,
  }),
  
  actions: {
    async loadProducts() {
      const isOriginalLoaded = localStorage.getItem('database_original_dummyjson_v5');
      if (this.products.length > 250 || !isOriginalLoaded) {
        this.isLoading = true;
        try {
          const apiProducts = await fetchInitialProducts();
          // Keep custom products added by the admin (IDs generated via Date.now() > 1000000000000)
          const customProducts = this.products.filter(p => p.id > 10000);
          
          const translateDescription = (title, category, originalDesc) => {
            const translations = {
              'beauty': `${title} - Güzellik ve kişisel bakım ürünü. Cildinizi besler ve doğal bir canlılık kazandırır. Günlük kullanım için son derece uygundur.`,
              'skin-care': `${title} - Cilt bakım ürünü. Cildinizi derinlemesine nemlendirir, besler ve canlandırır. Günlük cilt bakım rutininin vazgeçilmez parçası.`,
              'fragrances': `${title} - Büyüleyici esansları ile gün boyu kalıcı, ferah ve çekici bir koku deneyimi sunan özel tasarım parfüm.`,
              'furniture': `${title} - Evinize modern bir zarafet katacak konforlu ve ergonomik mobilya ürünü. Birinci sınıf dayanıklı malzemelerden üretilmiştir.`,
              'groceries': `${title} - Doğal, taze ve özenle seçilmiş süpermarket ürünü. Sağlıklı ve lezzetli öğünleriniz için güvenle tercih edebilirsiniz.`,
              'home-decoration': `${title} - Ev dekorasyonunuza estetik bir dokunuş katacak şık tasarım aksesuar. Yaşam alanlarınızı canlandıran modern detaylar.`,
              'kitchen-accessories': `${title} - Mutfakta işinizi kolaylaştıracak, pratik ve şık mutfak gereci. Isıya dayanıklı ve uzun ömürlü kullanım sunar.`,
              'laptops': `${title} - Yüksek işlemci gücü ve üstün performans sunan modern dizüstü bilgisayar. İş, eğitim ve eğlence için ideal donanım.`,
              'tablets': `${title} - Taşınabilirliği ve hızı bir arada sunan gelişmiş ekran teknolojisine sahip yeni nesil tablet cihazı.`,
              'smartphones': `${title} - Gelişmiş kamera özellikleri ve yüksek pil ömrü sunan, şık tasarımlı yeni nesil akıllı cep telefonu.`,
              'mobile-accessories': `${title} - Mobil cihazınızı koruyan ve işlevselliğini artıran, darbelere dayanıklı şık telefon aksesuarı.`,
              'mens-shirts': `${title} - Erkek giyim koleksiyonunun öne çıkan şık ve konforlu parçası. Kaliteli nefes alan kumaş dokusuyla günlük şıklık.`,
              'mens-shoes': `${title} - Adımlarınıza konfor katan, ergonomik tabanlı ve kaliteli materyalden üretilmiş şık erkek ayakkabısı.`,
              'mens-watches': `${title} - Klasik ve modern çizgileri bir arada sunan, dayanıklı mekanizmaya sahip son derece şık erkek kol saati.`,
              'womens-bags': `${title} - Kombinlerinizi tamamlayacak, geniş iç hacimli ve kaliteli dikiş detaylarına sahip şık kadın çantası.`,
              'womens-dresses': `${title} - Özel günlerinizde ve günlük hayatta tarzınızı yansıtacak, zarif kesimli kaliteli kadın elbise modeli.`,
              'womens-jewellery': `${title} - Işıltınızı ortaya çıkaracak, detayları ince ince işlenmiş, kararmaya dayanıklı özel kadın takı ve mücevher ürünü.`,
              'womens-shoes': `${title} - Gün boyu rahatlık sunan, şık tasarımı ile elbiselerinizi tamamlayacak ergonomik kadın ayakkabısı.`,
              'womens-watches': `${title} - Tarz sahibi kadınlar için tasarlanmış, suya dayanıklı mekanizmaya ve zarif kordon yapısına sahip şık kol saati.`,
              'sports-accessories': `${title} - Spor aktivitelerinizde maksimum verimlilik ve koruma sağlayan dayanıklı spor ekipmanı.`,
              'sunglasses': `${title} - Gözlerinizi zararlı UV ışınlarından tam koruma ile korurken şıklık katan yeni sezon güneş gözlüğü modeli.`,
              'vehicle': `${title} - Aracınızın performansını ve konforunu artıracak, dayanıklı ve uyumlu otomotiv aksesuarı.`,
              'automotive': `${title} - Aracınızın bakım ve görünüm kalitesini artıracak, dayanıklı ve uyumlu oto aksesuar ürünü.`,
              'motorcycle': `${title} - Motosiklet tutkunları için tasarlanmış, sürüş güvenliğini ve konforunu artıran yüksek kaliteli motosiklet ekipmanı.`,
              'tops': `${title} - Kadın giyim koleksiyonunun en şık parçası. Yumuşak dokusu ve modern kesimi ile günlük tarzınızı tamamlar.`,
              'lighting': `${title} - Ev aydınlatmanıza estetik bir hava katacak, tasarruflu ve şık tasarımlı dekoratif aydınlatma ürünü.`,
            }
            const key = String(category).toLowerCase().trim()
            return translations[key] || `${title} - Günlük hayatınızı kolaylaştırmak için özenle seçilmiş, şık tasarıma ve üstün kaliteye sahip özel ürün.`
          }

          const usdToTryRate = 34.5;
          const defaultProducts = apiProducts.map(product => ({
            ...product,
            price: Math.round(product.price * usdToTryRate),
            description: translateDescription(product.title, product.category, product.description),
            discountPercentage: 0,
            discountType: 'none',
            discountValue: 0,
            discountEndsAt: '',
            stock: product.stock || Math.floor(Math.random() * 100) + 10,
            brand: product.brand || 'Trendyol',
            rating: product.rating || (Math.random() * 2 + 3).toFixed(1)
          }));
          
          this.products = [...defaultProducts, ...customProducts];
          this.saveToLocalStorage();
          localStorage.setItem('database_original_dummyjson_v5', 'true');
          
          // Re-seed categories_list with the new large products list
          const productCats = this.products.map(p => p.category)
          const seedList = [...new Set(productCats)].filter(Boolean)
          localStorage.setItem('categories_list', JSON.stringify(seedList))
        } catch (error) {
          console.error('Ürünler yüklenirken hata:', error);
        } finally {
          this.isLoading = false;
        }
      }
    },
    
    addProduct(productData) {
      const newProduct = { 
        ...productData, 
        id: Date.now(),
        rating: productData.rating || 0,
        discountPercentage: 0,
        discountType: 'none',
        discountValue: 0,
        discountEndsAt: ''
      };
      this.products.unshift(newProduct); // En başa ekle
      this.saveToLocalStorage();
    },
    
    updateProduct(updatedProduct) {
      const index = this.products.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        const product = { ...updatedProduct };
        // Discount alanlarının güvenliğini sağla
        product.discountPercentage = updatedProduct.discountType === 'percent' ? Number(updatedProduct.discountValue || 0) : 0;
        product.discountValue = Number(updatedProduct.discountValue || 0);
        product.discountType = updatedProduct.discountType || 'none';
        product.discountEndsAt = updatedProduct.discountEndsAt || '';
        this.products[index] = product;
        this.saveToLocalStorage();
      }
    },
    
    deleteProduct(productId) {
      this.products = this.products.filter(p => p.id !== productId);
      const cartStore = useCartStore();
      const favoriteStore = useFavoriteStore();
      cartStore.removeFromCart(productId);
      favoriteStore.removeFavorite(productId);
      this.saveToLocalStorage();
    },

    sellProduct(productId, quantity) {
      const product = this.products.find(p => p.id === productId);
      if (!product || product.stock < quantity) {
        return false;
      }
      
      product.stock -= quantity;
      this.saveToLocalStorage();
      return true;
    },
    
    // Çoklu ürün satışı
    sellMultipleProducts(items) {
      const salesStore = useSalesStore();
      const successfulItems = [];
      
      for (const item of items) {
        const product = this.products.find(p => p.id === item.id);
        if (product && product.stock >= item.quantity) {
          product.stock -= item.quantity;
          successfulItems.push({
            ...item,
            price: item.discountedPrice || item.price
          });
        }
      }
      
      if (successfulItems.length > 0) {
        this.saveToLocalStorage();
        salesStore.recordSale(successfulItems);
        return true;
      }
      
      return false;
    },
    
    saveToLocalStorage() {
      localStorage.setItem('products', JSON.stringify(this.products));
    },
    
    // API'den kategori listesi çek
    async fetchCategories() {
      try {
        const response = await axios.get('https://dummyjson.com/products/categories');
        return response.data;
      } catch (error) {
        console.error('Kategoriler çekilemedi:', error);
        return [];
      }
    }
  }
});
