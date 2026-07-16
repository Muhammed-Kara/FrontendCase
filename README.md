# Frontend Case - E-Ticaret ve Yönetim Paneli Uygulaması

Bu proje, DummyJSON API servislerini kullanan, rol tabanlı yetkilendirme (Admin/User), dinamik sepet & favori yönetimi ve gelişmiş kampanya modüllerine sahip modern, duyarlı (responsive) bir e-ticaret uygulamasıdır.

Mülakat değerlendirmesi göz önüne alınarak, kod kalitesi yüksek, bileşen odaklı ve modüler bir mimariyle geliştirilmiştir.

---

## 🛠️ Kullanılan Teknolojiler

*   **Core:** Vue 3 (Composition API & `<script setup>` syntax)
*   **Derleyici & Araçlar:** Vite
*   **State Management:** Pinia (Modüler Store Mimarisi)
*   **Routing:** Vue Router (Meta tabanlı rota koruma guards)
*   **Tasarım & Styling:** Tailwind CSS (Harmonik HSL renk paletleri ve modern tipografi)
*   **API Client:** Axios
*   **Kalıcılık Katmanı:** `localStorage` & `sessionStorage`

---

## 🚀 Öne Çıkan Özellikler (Features)

### 1. Rol Tabanlı Yetkilendirme & Rota Koruması
*   Basit kullanıcı girişi üzerinden iki rol (`admin` ve `user`) tanımlanmıştır.
*   **Vue Router Navigation Guards (`beforeEach`)** kullanılarak `/admin` altındaki tüm yönetim sayfaları ve sepet/favori sayfaları yetkisiz erişime kapatılmıştır.
*   Güvenli çıkış yapıldığında sepet ve favori listesi otomatik sıfırlanır.

### 2. Ürün CRUD İşlemleri (Yönetici Paneli)
*   Yöneticiler için yeni ürün ekleme, güncelleme ve silme işlemleri mevcuttur.
*   API'den çekilen veriler `localStorage` üzerinde saklanarak tarayıcı yenilendiğinde verilerin kaybolmaması (persistence) sağlanmıştır.

### 3. Dinamik Sepet & Favori Yönetimi
*   Kullanıcılar sepetlerine ürün ekleyebilir, adet güncelleyebilir veya silebilirler.
*   Oturum bazlı saklama için sepet ve favoriler `sessionStorage` üzerinde tutulur.

---

## ✨ Artı Puan Kazandıracak Ek Özellikler (Extra Features)

1.  **Şans Çarkı (Oyunlaştırma / Gamification):**
    *   Kullanıcılar çarkı çevirerek rastgele indirim kuponları kazanabilir.
    *   Çarkın görsel dönüş açısı ile kazanılan kuponun eşleşmesini sağlamak amacıyla hassas matematiksel rotasyon hesabı yapılmıştır.
    *   "Kopyala & Uygula" butonu kupon kodunu anında `cartStore` üzerinden sepete indirim olarak tanımlar.
2.  **Scroll-Spy Buton Tetikleyicisi:**
    *   Kullanıcı deneyimini (UX) temiz tutmak adına Şans Çarkı butonu sayfa ilk açıldığında gizlenir. Kullanıcı ürünler alanına ulaştığında (`scrollY > 350`) animasyonlu bir şekilde ekranda belirir.
3.  **Dinamik Kampanya Modülü (`discount.js`):**
    *   Yönetici panelinden ürünlere saatlik, günlük veya aylık geçerliliği olan yüzdelik ya da sabit tutarlı kampanyalar tanımlanabilir.
    *   Kampanyaların geçerlilik süreleri arka planda anlık doğrulanarak süresi biten indirimler otomatik olarak devredışı bırakılır.
4.  **Akıllı Kategori Çeviri Sistemi (`translator.js`):**
    *   DummyJSON'dan gelen kategorileri Türkçeleştirir. Eşleşmeyen bir kategori geldiğinde ise kelimelerin baş harflerini büyüterek sayfada kötü bir görsel oluşmasını engelleyen yedek plan (fallback) mekanizması barındırır.

---

## 📦 Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

1.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

2.  **Geliştirici Sunucusunu Başlatın:**
    ```bash
    npm run dev
    ```

3.  **Üretim Sürümünü Derleyin (Production Build):**
    ```bash
    npm run build
    ```
