/**
 * Blog ve Yardım/FAQ örnek verilerini MongoDB'ye ekler.
 * Kullanım: node scripts/seed-blog-help.js
 */
const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb://root:example@localhost:27017/ventura?authSource=admin';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const blogs = [
  {
    title: 'Yurt İçi Uçuşlarda Bagaj Hakları ve Bilinmesi Gerekenler',
    excerpt: 'Türkiye\'deki iç hat uçuşlarında bagaj hakkınız, ek bagaj ücretleri ve sık yapılan hatalar hakkında bilmeniz gereken her şey.',
    content: `<h2>Kabin Bagajı</h2>
<p>Türkiye'deki iç hat uçuşlarında genel olarak <strong>8 kg kabin bagajı</strong> hakkınız bulunmaktadır. Ancak bu ağırlık havayoluna göre değişebilir; uçuşunuzu satın almadan önce mutlaka kontrol edin.</p>
<h2>Ücretli Bagaj</h2>
<p>Çoğu ekonomi sınıfı biletinde ücretli bagaj dahil değildir. Havalimanında ek bagaj ücreti ödemek, online ön alıma göre 2-3 kat daha pahalıya gelebilir. Bu nedenle bilet satın alırken bagajınızı da ekleyin.</p>
<h2>Sık Yapılan Hatalar</h2>
<ul>
<li>Kabin bagajındaki sıvı kurallarını ihmal etmek</li>
<li>Bagaj kilolarını son dakikaya bırakmak</li>
<li>Değerli eşyaları ücretli bagaja koymak</li>
</ul>
<p>Ventura Turizm olarak sizi en uygun uçuşa yönlendirirken bagaj dahil seçenekleri de gösteriyoruz.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    category: 'Seyahat İpuçları',
    tags: ['bagaj', 'iç hat', 'uçuş', 'havacılık'],
    status: 'published',
    author: 'Ventura Turizm',
    viewCount: 142,
    metaTitle: 'Yurt İçi Uçuşlarda Bagaj Hakları | Ventura Turizm',
    metaDescription: 'İç hat uçuşlarında bagaj hakkınızı, ek bagaj ücretlerini ve dikkat etmeniz gereken noktaları öğrenin.',
  },
  {
    title: 'En Güzel 10 Yurt İçi Tatil Destinasyonu',
    excerpt: 'Türkiye\'nin saklı cenneti destinasyonlarından tarihi şehirlere uzanan muhteşem tatil rotaları.',
    content: `<h2>1. Kapadokya</h2>
<p>Peri bacaları, balon turları ve eşsiz manzarasıyla Kapadokya, her mevsim ziyaret edilebilecek büyülü bir destinasyondur.</p>
<h2>2. Bodrum</h2>
<p>Turkuaz denizi, antik kalesi ve canlı gece hayatıyla Bodrum, yaz tatilinin vazgeçilmezi.</p>
<h2>3. Safranbolu</h2>
<p>UNESCO Dünya Mirası listesindeki Osmanlı evleri ve tarihi çarşısıyla Safranbolu, tarihe yolculuk yapmak isteyenler için ideal.</p>
<h2>4. Pamukkale</h2>
<p>Beyaz travertenler ve termal sular, Pamukkale'yi hem görsel hem sağlık turizmi açısından özel kılıyor.</p>
<p>Tüm bu destinasyonlara en uygun uçuş fiyatları için Ventura Turizm'i kullanın!</p>`,
    coverImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
    category: 'Destinasyon',
    tags: ['tatil', 'türkiye', 'destinasyon', 'seyahat'],
    status: 'published',
    author: 'Ventura Turizm',
    viewCount: 289,
    metaTitle: 'En Güzel 10 Yurt İçi Tatil Destinasyonu | Ventura Turizm',
    metaDescription: 'Türkiye\'nin en güzel tatil destinasyonlarını keşfedin. Kapadokya\'dan Bodrum\'a, Safranbolu\'dan Pamukkale\'ye.',
  },
  {
    title: 'Uçak Bileti Nasıl Daha Ucuza Alınır? 7 Altın Kural',
    excerpt: 'Bilet fiyatlarını düşürmek için bilmeniz gereken zamanlamalar, esneklik tüyoları ve platform karşılaştırma stratejileri.',
    content: `<h2>1. Erken Rezervasyon Yapın</h2>
<p>Yurt içi uçuşlarda en uygun fiyatlar genellikle <strong>4–8 hafta öncesinde</strong> çıkar. Uluslararası uçuşlarda bu süre 2–3 aya uzayabilir.</p>
<h2>2. Esnek Tarih Seçin</h2>
<p>Salı ve Çarşamba günleri genellikle en ucuz uçuş günleridir. Hafta sonu uçuşları daha pahalı olabilir.</p>
<h2>3. Fiyat Alarmı Kurun</h2>
<p>Ventura Turizm üzerinden favori rotalarınızı takip edin ve fiyat düştüğünde bildirim alın.</p>
<h2>4. El Bagajıyla Seyahat Edin</h2>
<p>Kısa mesafeli uçuşlarda sadece kabin bagajıyla seyahat etmek bilet fiyatını önemli ölçüde düşürebilir.</p>
<h2>5. Kombine Rotaları Deneyin</h2>
<p>Aktarmalı uçuşlar bazen direkt uçuşlardan çok daha ucuz olabilir.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80',
    category: 'Seyahat İpuçları',
    tags: ['ucuz bilet', 'tasarruf', 'ipuçları', 'uçuş'],
    status: 'published',
    author: 'Ventura Turizm',
    viewCount: 415,
    metaTitle: 'Ucuz Uçak Bileti Nasıl Alınır? 7 Altın Kural | Ventura Turizm',
    metaDescription: 'Uçak bileti fiyatlarını düşürmek için uzman ipuçları. Erken rezervasyon, esnek tarih ve daha fazlası.',
  },
  {
    title: 'Havalimanında Geçireceğiniz Uzun Bekleme Süreleri İçin Öneriler',
    excerpt: 'Saatler süren transit bekleyişleri daha keyifli geçirmek için pratik öneriler ve havalimanı rehberi.',
    content: `<h2>Transit Geçişlerde Vizye Dikkat</h2>
<p>Bazı ülkelerde transit yolcular için bile vize gerekebilir. Uçuş planınızı yapmadan önce transit vize şartlarını kontrol edin.</p>
<h2>Havalimanı Salonlarını Kullanın</h2>
<p>Birçok havalimanında günübirlik salon üyeliği satın alabilirsiniz. Yiyecek, içecek, duş imkânı ve sessiz çalışma alanları sunulur.</p>
<h2>Şarj İstasyonlarını Bulun</h2>
<p>Büyük havalimanlarında şarj istasyonları genellikle kapı yakınlarındadır. Güç bankası yanında bulundurmak da iyi bir alternatiftir.</p>
<h2>Kısa Şehir Turu</h2>
<p>6 saat ve üzeri bekleyişlerde, pasaport çıkışı gerektiren aktarmalarda şehri keşfetme fırsatı değerlendirilebilir.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=800&q=80',
    category: 'Seyahat İpuçları',
    tags: ['havalimanı', 'transit', 'bekleme', 'ipuçları'],
    status: 'published',
    author: 'Ventura Turizm',
    viewCount: 98,
    metaTitle: 'Havalimanı Bekleme Süresi İçin Öneriler | Ventura Turizm',
    metaDescription: 'Uzun transit bekleyişlerini daha verimli ve keyifli hale getirmek için pratik öneriler.',
  },
  {
    title: 'Çocuklu Aile Tatilleri İçin Türkiye\'nin En İyi Destinasyonları',
    excerpt: 'Çocuklarla tatile çıkmak mı istiyorsunuz? İşte ailenizin her bireyi için uygun aktiviteler sunan en iyi destinasyonlar.',
    content: `<h2>Antalya & Belek</h2>
<p>Geniş çakıl ve kum plajları, çocuk havuzlu oteller ve su parkları ile Antalya, aileler için ideal bir destinasyon.</p>
<h2>Bodrum</h2>
<p>Sakin koylarda yüzme, tekne turları ve su sporları çocukların vazgeçemeyeceği aktiviteler arasında.</p>
<h2>Kapadokya</h2>
<p>Peri bacalarını keşfetmek, ATV turu ve balon turları (yetişkinler için) çocukların hayal gücünü canlandırır.</p>
<blockquote>Ventura Turizm olarak aile paketlerinde özel indirimler sunuyoruz. Hemen inceleyin!</blockquote>`,
    coverImage: 'https://images.unsplash.com/photo-1502920514313-52581002a659?w=800&q=80',
    category: 'Destinasyon',
    tags: ['aile tatili', 'çocuklar', 'destinasyon', 'türkiye'],
    status: 'published',
    author: 'Ventura Turizm',
    viewCount: 201,
    metaTitle: 'Çocuklu Aile Tatilleri İçin En İyi Destinasyonlar | Ventura Turizm',
    metaDescription: 'Çocuklarınızla birlikte keyfini çıkarabileceğiniz Türkiye\'nin en iyi aile tatil destinasyonları.',
  },
  {
    title: 'Online Check-in Nasıl Yapılır? Adım Adım Rehber',
    excerpt: 'Havalimanı kuyruklarından kurtulun: online check-in sürecini, avantajlarını ve dikkat edilmesi gereken noktaları öğrenin.',
    content: `<h2>Online Check-in Nedir?</h2>
<p>Online check-in, uçuşunuzdan <strong>24–48 saat önce</strong> havayolunun web sitesi veya mobil uygulaması üzerinden koltuk seçimi yapıp biniş kartınızı almanızdır.</p>
<h2>Nasıl Yapılır?</h2>
<ol>
<li>Havayolunun sitesine gidin ve "Check-in" bölümüne tıklayın</li>
<li>PNR numaranızı ve soyadınızı girin</li>
<li>Koltuğunuzu seçin</li>
<li>Biniş kartınızı PDF veya mobil olarak indirin</li>
</ol>
<h2>Avantajları</h2>
<ul>
<li>Kuyruk bekleme süresi azalır</li>
<li>Daha iyi koltuk seçeneği</li>
<li>Havalimanına geç gidebilme esnekliği</li>
</ul>
<p>Ventura Turizm üzerinden aldığınız biletlerde PNR numaranız rezervasyonlarım sayfasında bulunabilir.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80',
    category: 'Rehber',
    tags: ['check-in', 'online', 'havalimanı', 'rehber'],
    status: 'published',
    author: 'Ventura Turizm',
    viewCount: 334,
    metaTitle: 'Online Check-in Nasıl Yapılır? | Ventura Turizm',
    metaDescription: 'Online check-in sürecini adım adım öğrenin, havalimanı kuyruklarından kurtulun.',
  },
];

const faqs = [
  // Rezervasyon
  { question: 'Rezervasyonumu nasıl iptal edebilirim?', answer: 'Rezervasyonlarım sayfasından ilgili rezervasyonu seçip "İptal Et" butonuna tıklayabilirsiniz. İptal koşulları seçilen tarife ve havayoluna göre değişmektedir. Detaylı bilgi için müşteri hizmetlerimizle iletişime geçin.', category: 'Rezervasyon', order: 1, active: true },
  { question: 'PNR numarası nedir, nasıl kullanılır?', answer: 'PNR (Passenger Name Record), rezervasyonunuzu tanımlayan 6 haneli bir koddur. Havayolunun web sitesinde veya kontuarında bu kodu kullanarak biletinizi kontrol edebilir ve online check-in yapabilirsiniz.', category: 'Rezervasyon', order: 2, active: true },
  { question: 'Rezervasyon onay maili gelmiyor, ne yapmalıyım?', answer: 'Önce spam/junk klasörünüzü kontrol edin. E-posta hâlâ yoksa "Rezervasyonlarım" sayfasından rezervasyonunuzun durumunu kontrol edin. Sorun devam ederse destek@venturaturizm.com adresine yazın.', category: 'Rezervasyon', order: 3, active: true },
  // Ödeme
  { question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?', answer: 'Visa, Mastercard ve Amex kredi/banka kartları ile ödeme kabul ediyoruz. 3D Secure ile güvenli ödeme altyapımız mevcuttur. Şu an itibarıyla havale/EFT ve kapıda ödeme seçeneği bulunmamaktadır.', category: 'Ödeme', order: 1, active: true },
  { question: 'Ödeme güvenli mi?', answer: 'Tüm ödemeler SSL sertifikası ile şifrelenmiş güvenli bir bağlantı üzerinden işlenir. Kart bilgileriniz sistemimizde saklanmaz; her işlem bağımsız olarak gerçekleştirilir.', category: 'Ödeme', order: 2, active: true },
  { question: 'İptal durumunda iade ne zaman yapılır?', answer: 'İade süreleri havayoluna ve ödeme yönteminize bağlıdır. Genellikle kredi kartı iadelerinde 7–14 iş günü gerekmektedir. İade talebinizi müşteri hizmetleri üzerinden iletebilirsiniz.', category: 'Ödeme', order: 3, active: true },
  // Bagaj
  { question: 'Kabin bagajı boyut sınırları nedir?', answer: 'Türkiye iç hat uçuşlarında standart kabin bagajı boyutu genellikle 55x40x20 cm ve 8 kg\'dır. Ancak havayoluna göre farklılık gösterebilir; bilet satın almadan önce ilgili havayolunun kurallarını inceleyin.', category: 'Bagaj', order: 1, active: true },
  { question: 'Ücretli bagaj kaçıncı güne kadar eklenebilir?', answer: 'Çoğu havayolunda online olarak uçuştan 1 saat öncesine kadar ücretli bagaj eklenebilir. Havalimanı kontuarında ek bagaj almak daha pahalıya mal olabilir. Online alım her zaman daha avantajlıdır.', category: 'Bagaj', order: 2, active: true },
  // Hesap
  { question: 'Üye olmadan bilet alabilir miyim?', answer: 'Evet, misafir olarak da rezervasyon yapabilirsiniz. Ancak üye olursanız geçmiş rezervasyonlarınızı takip edebilir, kayıtlı yolcu özelliğinden faydalanabilir ve özel kampanyalardan haberdar olabilirsiniz.', category: 'Hesap', order: 1, active: true },
  { question: 'Şifremi unuttum, ne yapmalıyım?', answer: 'Giriş sayfasındaki "Şifremi Unuttum" bağlantısına tıklayın. Kayıtlı e-posta adresinize şifre sıfırlama bağlantısı gönderilecektir. E-posta birkaç dakika içinde gelmezse spam klasörünüzü kontrol edin.', category: 'Hesap', order: 2, active: true },
];

async function main() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log('✅ MongoDB bağlandı');
    const db = client.db('ventura');

    // --- Blog ---
    const blogsCol = db.collection('blogs');
    let blogInserted = 0;

    for (const blog of blogs) {
      const slug = slugify(blog.title);
      const exists = await blogsCol.findOne({ slug });
      if (!exists) {
        await blogsCol.insertOne({
          ...blog,
          slug,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        blogInserted++;
        console.log(`  📝 Blog eklendi: ${blog.title}`);
      } else {
        console.log(`  ⏭  Blog zaten var: ${blog.title}`);
      }
    }
    console.log(`\n✅ Blog: ${blogInserted} yeni kayıt eklendi\n`);

    // --- FAQs ---
    const faqsCol = db.collection('faqs');
    let faqInserted = 0;

    for (const faq of faqs) {
      const exists = await faqsCol.findOne({ question: faq.question });
      if (!exists) {
        await faqsCol.insertOne({ ...faq, createdAt: new Date(), updatedAt: new Date() });
        faqInserted++;
        console.log(`  ❓ FAQ eklendi: ${faq.question.substring(0, 50)}...`);
      } else {
        console.log(`  ⏭  FAQ zaten var: ${faq.question.substring(0, 50)}...`);
      }
    }
    console.log(`\n✅ FAQ: ${faqInserted} yeni kayıt eklendi`);

  } finally {
    await client.close();
    console.log('\n🔌 Bağlantı kapatıldı.');
  }
}

main().catch(err => { console.error('❌ Hata:', err); process.exit(1); });
