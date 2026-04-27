import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './modules/users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from './modules/permissions/schemas/permission.schema';
import { Role } from './modules/roles/schemas/role.schema';
import { User } from './modules/users/schemas/user.schema';
import { Contract } from './modules/contracts/schemas/contract.schema';
import { Reservation } from './modules/reservations/schemas/reservation.schema';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const permissionModel = app.get('PermissionModel'); // Internal Nest fallback for InjectModel
    const roleModel = app.get('RoleModel');
    const usersService = app.get(UsersService);

    console.log('🌱 Seeding database...');

    // 1. Permissions
    const permissions = [
        { code: 'user.read', name: 'Read Users' },
        { code: 'user.create', name: 'Create User' },
        { code: 'user.update', name: 'Update User' },
        { code: 'user.delete', name: 'Delete User' },
        { code: 'role.read', name: 'Read Roles' },
        { code: 'role.manage', name: 'Manage Roles' },
        { code: 'airline.read', name: 'Read Airlines' },
        { code: 'airline.manage', name: 'Manage Airlines' },
        { code: 'contract.read', name: 'Read Contracts' },
        { code: 'contract.manage', name: 'Manage Contracts' },
        { code: 'reservation.read', name: 'Read Reservations' },
        { code: 'reservation.manage', name: 'Manage Reservations' },
    ];

    const createdPermissions: Permission[] = [];
    for (const p of permissions) {
        const exists = await (permissionModel as Model<Permission>).findOne({ code: p.code });
        if (!exists) {
            const newP = new (permissionModel as Model<Permission>)(p);
            const savedP = await newP.save();
            createdPermissions.push(savedP);
            console.log(`- Permission ${p.code} created`);
        } else {
            createdPermissions.push(exists);
        }
    }

    // 2. Roles
    let superAdminRole = (await (roleModel as Model<Role>).findOne({ name: 'Super Admin' })) as any;
    if (!superAdminRole) {
        superAdminRole = new (roleModel as Model<Role>)({
            name: 'Super Admin',
            description: 'Full system access',
            permissions: createdPermissions.map((p) => (p as any)._id),
        });
        await superAdminRole.save();
        console.log('- Role Super Admin created');
    }

    // 3. Default contracts (sözleşmeler) – detaylı içerik; mevcut kayıtlar güncellenir
    const contractModel = app.get('ContractModel') as Model<Contract>;
    const defaultContracts = [
        {
            slug: 'kullanim-sartlari',
            title: 'Kullanım Şartları',
            order: 1,
            content: `
<h2>1. Taraflar ve Konu</h2>
<p>İşbu Kullanım Şartları ("Şartlar"), Ventura Turizm A.Ş. ("Şirket", "Ventura Turizm", "biz") ile www.venturaturizm.com.tr ve ilgili alt alan adları, mobil uygulamalar ve diğer dijital platformlar ("Site") üzerinden hizmetlerimizi kullanan kullanıcılar ("Kullanıcı", "siz") arasındaki ilişkiyi düzenler. Sitemizi veya hizmetlerimizi kullanmakla işbu Şartları okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan etmiş sayılırsınız.</p>

<h2>2. Hizmet Kapsamı</h2>
<p>Ventura Turizm; uçak bileti, otel rezervasyonu, araç kiralama, paket tatil ve diğer seyahat hizmetlerinin araştırılması, rezervasyonu ve satışı konularında aracılık hizmeti sunar. Şirket, bir seyahat acentesi olarak, nihai hizmeti sağlayan havayolları, oteller, tur operatörleri ve diğer tedarikçilerle ("Tedarikçiler") sözleşme ilişkisi içindedir. Kullanıcı ile Şirket arasında oluşan sözleşme, yalnızca aracılık ve rezervasyon hizmetine ilişkindir; taşıma, konaklama vb. hizmetlerin ifası Tedarikçiler tarafından sağlanır.</p>

<h2>3. Kayıt ve Hesap Güvenliği</h2>
<p>Bazı hizmetlerimizden yararlanmak için üyelik hesabı oluşturmanız gerekebilir. Kayıt sırasında verdiğiniz bilgilerin doğru, güncel ve eksiksiz olması sizin yükümlülüğünüzdür. Hesap şifrenizi gizli tutmak ve hesabınız altında gerçekleşen tüm işlemlerden siz sorumlusunuz. Hesabınızın yetkisiz kullanımını fark ettiğinizde derhal bizi bilgilendirmeniz gerekir.</p>

<h2>4. Kullanım Kuralları</h2>
<p>Site ve hizmetlerimizi kullanırken aşağıdaki kurallara uymanız zorunludur:</p>
<ul>
<li>Yasalara, kamu düzenine ve genel ahlaka aykırı davranışlarda bulunmamak,</li>
<li>Üçüncü kişilerin haklarına (fikri mülkiyet, kişilik hakları, gizlilik vb.) tecavüz etmemek,</li>
<li>Yanıltıcı, yanlış veya sahte bilgi vermemek,</li>
<li>Virüs, zararlı yazılım veya sisteme zarar verebilecek içerik yayınlamamak veya yüklememek,</li>
<li>Otomatik sistemler (bot, crawler vb.) ile izin almadan veri toplamamak veya hizmeti aşırı yüklememek,</li>
<li>Başkalarının hesaplarına yetkisiz erişim denememek.</li>
</ul>
<p>Bu kurallara uyulmaması halinde hesabınız askıya alınabilir veya sonlandırılabilir ve gerekirse hukuki yollara başvurulabilir.</p>

<h2>5. Rezervasyon ve Ödeme</h2>
<p>Rezervasyonlar, seçtiğiniz tarih, rota ve tarife kapsamında Tedarikçilerin koşullarına tabidir. Fiyatlar, vergiler ve ek ücretler rezervasyon anındaki bilgilere göre gösterilir; nihai tutar ödeme sayfasında teyit edilir. Ödeme; kredi/banka kartı, havale veya Site üzerinde sunulan diğer yöntemlerle yapılabilir. Ödeme alındıktan sonra bilet veya rezervasyon onayı elektronik ortamda iletilir. İptal ve iade koşulları, ilgili Tedarikçi ve tarife kurallarına göre uygulanır.</p>

<h2>6. Fikri Mülkiyet</h2>
<p>Site üzerindeki metin, görsel, logo, tasarım, yazılım kodu ve diğer tüm içerikler Ventura Turizm veya lisans verenlerine aittir. İzinsiz kopyalama, dağıtma, değiştirme veya ticari kullanım yasaktır. "Ventura Turizm" ve ilgili markalar tescilli veya kullanım hakkı Şirkete ait markalardır.</p>

<h2>7. Sorumluluk Sınırı</h2>
<p>Şirket, Site üzerinden sunulan bilgilerin doğruluğu için makul çabayı göstermekle birlikte, yazım hataları, fiyat değişiklikleri veya Tedarikçi kaynaklı aksaklıklar nedeniyle sorumluluk sınırlıdır. Uçuş iptali, gecikme, otel kapasitesi vb. konularda nihai sorumluluk ilgili Tedarikçiye aittir. Şirket, dolaylı zarar, kar kaybı veya manevi tazminat taleplerinden, yürürlükteki yasaların izin verdiği ölçüde muaf tutulur.</p>

<h2>8. Bağlantılar</h2>
<p>Site üzerinde üçüncü taraf web sitelerine bağlantılar bulunabilir. Bu bağlantılar yalnızca kolaylık amacıyla sunulur; üçüncü taraf içerik ve gizlilik uygulamalarından Şirket sorumlu değildir.</p>

<h2>9. Değişiklikler</h2>
<p>Ventura Turizm, işbu Şartlarda ve Site üzerindeki hizmetlerde önceden bildirimde bulunarak veya bildirim yükümlülüğü olmaksızın (acil durumlarda) değişiklik yapma hakkını saklı tutar. Değişiklikler yayımlandığı tarihte geçerli sayılır. Değişiklikleri kabul etmiyorsanız hizmeti kullanmayı bırakabilirsiniz; kullanmaya devam etmeniz kabulünüz anlamına gelir.</p>

<h2>10. Uygulanacak Hukuk ve Yetkili Mahkeme</h2>
<p>İşbu Şartlar Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlıklarda İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri yetkilidir.</p>

<p><strong>Son güncelleme:</strong> Bu metin Ventura Turizm tarafından yayımlanmış olup, kullanım şartlarının özeti niteliğindedir. Detaylı hak ve yükümlülükler için rezervasyon koşulları ve Tedarikçi sözleşmeleri esas alınır.</p>
            `.trim(),
        },
        {
            slug: 'gizlilik-sartlari',
            title: 'Gizlilik Şartları',
            order: 2,
            content: `
<h2>1. Giriş</h2>
<p>Ventura Turizm A.Ş. ("Şirket", "biz") olarak kişisel verilerinizin güvenliğine önem veriyoruz. İşbu Gizlilik Şartları ("Şartlar"), www.venturaturizm.com.tr ve ilişkili platformlarımız üzerinden toplanan, işlenen ve saklanan kişisel verilerinize ilişkin uygulamamızı açıklamaktadır. Verilerinizi nasıl topladığımızı, kullandığımızı, paylaştığımızı ve koruduğumuzu şeffaf bir biçimde anlatmayı hedefliyoruz.</p>

<h2>2. Veri Sorumlusu</h2>
<p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu, Ventura Turizm A.Ş.'dir. Veri sorumlusu olarak kişisel verilerinizin hukuka ve dürüstlük kurallarına uygun işlenmesinden, doğru ve güncel tutulmasından ve belirli amaçlarla sınırlı tutulmasından sorumluyuz.</p>

<h2>3. Toplanan Verilerin Türleri</h2>
<p>Hizmetlerimizi sunarken aşağıdaki kategorilerde kişisel veri toplayabiliriz:</p>
<ul>
<li><strong>Kimlik ve iletişim bilgileri:</strong> Ad, soyad, T.C. kimlik numarası (yasal zorunluluk olduğunda), doğum tarihi, e-posta adresi, telefon numarası, adres.</li>
<li><strong>Rezervasyon ve seyahat bilgileri:</strong> Uçuş/otel tercihleri, tarih, rota, bilet ve rezervasyon numaraları, ödeme bilgileri (kart maskesi, işlem geçmişi).</li>
<li><strong>Hesap ve teknik veriler:</strong> Kullanıcı adı, şifre (şifrelenmiş), IP adresi, çerez (cookie) verileri, cihaz ve tarayıcı bilgisi, oturum kayıtları.</li>
<li><strong>Tercih ve kullanım verileri:</strong> Arama geçmişi, kampanya onayları, iletişim tercihleri, anket/geri bildirim cevapları.</li>
</ul>
<p>Bu veriler; doğrudan sizden (form, üyelik, rezervasyon), otomatik araçlardan (çerezler, loglar) veya iş ortaklarımızdan (havayolları, oteller) toplanabilir.</p>

<h2>4. Verilerin İşlenme Amaçları</h2>
<p>Topladığımız verileri aşağıdaki amaçlarla işliyoruz:</p>
<ul>
<li>Rezervasyon ve biletleme işlemlerinin gerçekleştirilmesi,</li>
<li>Ödeme işlemlerinin işlenmesi ve fraud önlemleri,</li>
<li>Müşteri hesabı oluşturma, kimlik doğrulama ve hesap yönetimi,</li>
<li>Yasal yükümlülüklerin (vergi, göç, güvenlik) yerine getirilmesi,</li>
<li>Müşteri hizmetleri, şikayet ve talep yönetimi,</li>
<li>Kampanya, bülten ve pazarlama iletişimleri (açık rıza ile),</li>
<li>Site ve hizmetlerin iyileştirilmesi, analiz ve istatistik,</li>
<li>Hukuki uyuşmazlıkların çözümü ve hakkımızın korunması.</li>
</ul>

<h2>5. Verilerin Paylaşımı</h2>
<p>Kişisel verileriniz yalnızca aşağıdaki durumlarda ve gerektiği ölçüde paylaşılır:</p>
<ul>
<li><strong>Tedarikçiler:</strong> Rezervasyon ve seyahat hizmetinin ifası için havayolları, oteller, araç kiralama şirketleri ve diğer hizmet sağlayıcılar.</li>
<li><strong>Ödeme kuruluşları:</strong> Ödeme işlemlerinin güvenli şekilde tamamlanması için bankalar ve ödeme altyapı sağlayıcıları.</li>
<li><strong>Yasal merciler:</strong> Yasa veya mahkeme kararıyla talep edildiğinde yetkili kamu kurum ve kuruluşları.</li>
<li><strong>Hizmet altyapı ortakları:</strong> Sunucu, bulut, e-posta ve destek hizmeti sağlayanlar (veri işleme sözleşmeleri ile).</li>
</ul>
<p>Verileriniz yurt dışına, yalnızca KVKK'nın 9. maddesinde öngörülen koşullar (açık rıza veya yeterli koruma) sağlanarak aktarılabilir.</p>

<h2>6. Saklama Süresi</h2>
<p>Kişisel verileriniz, işlenme amacı için gerekli olan süre boyunca ve yasal saklama süreleri (ticari defter, vergi mevzuatı vb.) dikkate alınarak muhafaza edilir. Amaç ortadan kalktığında veya yasal süre dolduğunda veriler silinir veya anonim hale getirilir.</p>

<h2>7. Güvenlik</h2>
<p>Verilerinizi yetkisiz erişim, kayıp, değiştirme veya ifşaya karşı teknik ve idari tedbirlerle (şifreleme, erişim kısıtları, güvenli altyapı) koruyoruz. Çalışanlarımız ve iş ortaklarımız veri güvenliği konusunda eğitim ve taahhüt altındadır.</p>

<h2>8. Haklarınız</h2>
<p>KVKK uyarınca kişisel verilerinizle ilgili olarak:</p>
<ul>
<li>İşlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme,</li>
<li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
<li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
<li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
<li>KVKK'nın 7. maddesinde sayılan şartlar çerçevesinde silinmesini veya yok edilmesini isteme,</li>
<li>Otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
<li>Kanuna aykırı işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme</li>
</ul>
<p>haklarına sahipsiniz. Başvurularınızı "Veri Sorumlusuna Başvuru Yöntemleri" kapsamında yazılı veya elektronik kanallardan iletebilirsiniz; yasal süre içinde yanıtlanacaktır.</p>

<h2>9. Çerezler (Cookies)</h2>
<p>Site üzerinde oturum yönetimi, güvenlik, tercih hatırlama ve analiz amaçlı çerezler kullanılmaktadır. Çerez politikamız ayrı bir sayfada veya bu metnin ekinde açıklanmaktadır. Tarayıcı ayarlarınızdan çerezleri kısıtlayabilirsiniz; ancak bazı özelliklerin çalışması etkilenebilir.</p>

<h2>10. Değişiklikler</h2>
<p>İşbu Gizlilik Şartları zaman zaman güncellenebilir. Önemli değişiklikler Site üzerinden veya e-posta ile duyurulacaktır. Güncel metin her zaman Site'da yayımlanacaktır. Değişiklikler yayım tarihinden itibaren geçerlidir.</p>

<p><strong>İletişim:</strong> Kişisel verilerinizle ilgili sorularınız veya başvurularınız için veri sorumlusu Ventura Turizm A.Ş. ile iletişime geçebilirsiniz.</p>
            `.trim(),
        },
        {
            slug: 'kisisel-verilerin-korunmasi',
            title: 'Kişisel Verilerin Korunması',
            order: 3,
            content: `
<h2>1. Amaç ve Kapsam</h2>
<p>Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında Ventura Turizm A.Ş. ("Şirket") tarafından işlenen kişisel verilerinize ilişkin aydınlatma ve açık rıza metni niteliğindedir. Veri sorumlusu sıfatıyla kişisel verilerinizi hangi hukuki sebeplerle, hangi amaçlarla ve nasıl işlediğimizi, saklama sürelerini ve haklarınızı aşağıda özetliyoruz.</p>

<h2>2. Veri Sorumlusu</h2>
<p>Veri sorumlusu: Ventura Turizm A.Ş., KVKK uyarınca kişisel verilerinizin işlenmesine ilişkin karar verme ve veri işleme faaliyetlerini yönetme yükümlülüğünü taşımaktadır. İletişim bilgilerimiz web sitemiz ve yasal bildirimlerde yer almaktadır.</p>

<h2>3. İşlenen Kişisel Veri Kategorileri ve Hukuki Sebepler</h2>
<p><strong>Kimlik bilgileri (ad, soyad, T.C. kimlik no, doğum tarihi):</strong> Rezervasyon, sözleşme ve yasal zorunlulukların yerine getirilmesi; KVKK m. 5/2 (a), (c), (e) – sözleşme, yasal zorunluluk, meşru menfaat.</p>
<p><strong>İletişim bilgileri (e-posta, telefon, adres):</strong> Rezervasyon, müşteri hizmeti, bilgilendirme ve gerekirse pazarlama (açık rıza ile); KVKK m. 5/2 (a), (c), (f) ve m. 6/2 (açık rıza).</p>
<p><strong>Finansal bilgiler (kart bilgisi maskesi, işlem geçmişi):</strong> Ödeme işlemleri, dolandırıcılık önleme ve yasal saklama; KVKK m. 5/2 (c), (f).</p>
<p><strong>İşlem güvenliği bilgileri (IP, log, cihaz bilgisi):</strong> Güvenlik, dolandırıcılık önleme, hukuki uyuşmazlık delili; KVKK m. 5/2 (c), (f).</p>
<p><strong>Pazarlama ve tercih bilgileri:</strong> Kampanya, bülten ve anketler yalnızca açık rızanız ile işlenir; KVKK m. 6/2.</p>

<h2>4. Kişisel Verilerin Toplanma Yöntemleri</h2>
<p>Kişisel verileriniz; web sitesi ve mobil uygulama formları, üyelik ve rezervasyon süreçleri, e-posta/telefon iletişimi, çerezler ve benzeri teknolojiler, havayolu/otel vb. iş ortaklarından gelen rezervasyon bilgileri ve yasal mercilerden gelen talepler yoluyla toplanmaktadır.</p>

<h2>5. İşleme Amaçları</h2>
<ul>
<li>Uçak bileti, otel ve diğer seyahat hizmetlerinin satışı ve rezervasyonu,</li>
<li>Ödeme işlemlerinin gerçekleştirilmesi ve doğrulanması,</li>
<li>Müşteri hesabı oluşturma, kimlik doğrulama ve hesap güvenliği,</li>
<li>Yasal ve düzenleyici yükümlülüklerin (vergi, göç, güvenlik) yerine getirilmesi,</li>
<li>Müşteri hizmetleri, şikayet ve talep yönetimi,</li>
<li>İstatistik, analiz ve hizmet kalitesi iyileştirme (anonim/agrege veri kullanımı mümkündür),</li>
<li>İletişim ve pazarlama faaliyetleri (açık rıza ile),</li>
<li>Hukuki süreçler ve hakların korunması.</li>
</ul>

<h2>6. Aktarım ve Paylaşım</h2>
<p>Kişisel verileriniz; rezervasyon ve seyahat hizmetinin ifası için havayolları, oteller, araç kiralama ve diğer tedarikçilere, ödeme işlemleri için banka ve ödeme kuruluşlarına, yasal zorunluluk halinde kamu kurumlarına ve hizmet aldığımız IT/destek sağlayıcılarına (veri işleme sözleşmeleri ile) aktarılabilir. Yurt dışı aktarımda KVKK m. 9 hükümleri (yeterli koruma veya açık rıza) uygulanır.</p>

<h2>7. Saklama Süresi</h2>
<p>Kişisel verileriniz, işlenme amacı için gerekli süre ve Türk Ticaret Kanunu, Vergi Usul Kanunu ve ilgili mevzuatta öngörülen saklama süreleri boyunca muhafaza edilir. Amaç sona erdikten veya yasal süre dolduktan sonra veriler silinir, yok edilir veya anonim hale getirilir.</p>

<h2>8. Kişisel Veri Sahibinin Hakları (KVKK m. 11)</h2>
<p>Kişisel veri sahibi olarak:</p>
<ul>
<li>Kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme,</li>
<li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
<li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
<li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
<li>KVKK m. 7’deki şartlar çerçevesinde silinmesini veya yok edilmesini isteme,</li>
<li>Düzeltme, silme ve yok etme işlemlerinin üçüncü kişilere bildirilmesini isteme,</li>
<li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
<li>Kanuna aykırı işlenmesi nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme</li>
</ul>
<p>haklarına sahipsiniz. Başvurularınızı, KVKK ve "Veri Sorumlusuna Başvuru Usul ve Esasları"na uygun şekilde yazılı veya kayıtlı elektronik ortamdan iletebilirsiniz. Başvurularınız en geç 30 gün içinde sonuçlandırılacaktır.</p>

<h2>9. Açık Rıza</h2>
<p>Yasal zorunluluk veya sözleşme gereği işlenmeyen kişisel verileriniz (örneğin pazarlama iletişimi, belirli çerezler) için açık rızanız alınmaktadır. Açık rızanızı istediğiniz zaman geri çekebilirsiniz; geri çekme, rıza verdiğiniz tarihe kadar yapılan işlemlere etki etmez.</p>

<h2>10. Güncellemeler</h2>
<p>Bu Kişisel Verilerin Korunması metni, mevzuat veya şirket uygulamasındaki değişikliklere göre güncellenebilir. Güncel metin web sitemizde yayımlanacaktır.</p>

<p><strong>Ventura Turizm A.Ş.</strong> – Veri Sorumlusu</p>
            `.trim(),
        },
        {
            slug: 'gizlilik-politikasi',
            title: 'Gizlilik Politikası',
            order: 4,
            content: `
<h2>1. Gizlilik Politikası Hakkında</h2>
<p>Ventura Turizm A.Ş. ("Ventura Turizm", "biz", "Şirket") olarak gizliliğinize saygı duyuyoruz. Bu Gizlilik Politikası ("Politika"), www.venturaturizm.com.tr ve ilişkili web siteleri, mobil uygulamalar ve diğer dijital kanallarımız ("Platform") aracılığıyla topladığımız, kullandığımız ve koruduğumuz kişisel bilgilerinize ilişkin uygulamamızı açıklamaktadır. Politikayı okumanız, verilerinizi nasıl işlediğimizi anlamanız ve haklarınızı kullanmanız açısından önemlidir.</p>

<h2>2. Topladığımız Bilgiler</h2>
<p><strong>Verdiğiniz bilgiler:</strong> Üyelik, rezervasyon veya iletişim formları aracılığıyla adınız, soyadınız, e-posta adresiniz, telefon numaranız, adresiniz, doğum tarihiniz, T.C. kimlik numaranız (yasal zorunluluk olduğunda), kullanıcı adı ve şifre gibi bilgileri sizden alıyoruz.</p>
<p><strong>İşlem bilgileri:</strong> Rezervasyon detayları, uçuş/otel tercihleri, ödeme bilgileri (kart numarası maskesi, işlem tutarı ve tarihi), bilet ve rezervasyon numaraları platformumuz ve iş ortaklarımız aracılığıyla işlenir.</p>
<p><strong>Teknik ve kullanım bilgileri:</strong> IP adresi, tarayıcı türü, cihaz bilgisi, ziyaret edilen sayfalar, tıklama verileri, oturum süresi ve çerez (cookie) verileri otomatik veya yarı otomatik yollarla toplanabilir.</p>
<p><strong>Üçüncü taraflardan gelen bilgiler:</strong> Havayolları, oteller ve diğer tedarikçilerden rezervasyon ve yolcu bilgileri, ödeme kuruluşlarından işlem sonuçları alınabilir.</p>

<h2>3. Bilgileri Neden Kullanıyoruz?</h2>
<p>Topladığımız bilgileri aşağıdaki amaçlarla kullanıyoruz:</p>
<ul>
<li>Uçak bileti, otel ve diğer seyahat hizmetlerinin araştırılması, rezervasyonu ve satışı,</li>
<li>Ödeme işlemlerinin işlenmesi ve dolandırıcılık önlemleri,</li>
<li>Üyelik hesabınızın oluşturulması, yönetilmesi ve güvenliğinin sağlanması,</li>
<li>Rezervasyon onayı, değişiklik ve iptal bildirimleri, müşteri hizmetleri iletişimi,</li>
<li>Yasal ve düzenleyici yükümlülüklerin (vergi, güvenlik, göç) yerine getirilmesi,</li>
<li>Kampanya, indirim ve bülten gönderimi (yalnızca onay verdiğinizde),</li>
<li>Platform ve hizmetlerimizin geliştirilmesi, kişiselleştirme ve kullanım analizi,</li>
<li>Anket, puanlama ve müşteri memnuniyeti çalışmaları,</li>
<li>Hukuki talepler, uyuşmazlık çözümü ve haklarımızın korunması.</li>
</ul>

<h2>4. Bilgilerin Paylaşımı</h2>
<p>Kişisel bilgilerinizi yalnızca aşağıdaki durumlarda ve gerektiği ölçüde paylaşıyoruz:</p>
<ul>
<li><strong>Seyahat tedarikçileri:</strong> Rezervasyonunuzun gerçekleşmesi için havayolları, oteller, araç kiralama ve tur operatörleri.</li>
<li><strong>Ödeme ve finans kuruluşları:</strong> Ödeme işlemlerinin güvenli şekilde tamamlanması için bankalar ve ödeme altyapı sağlayıcıları.</li>
<li><strong>İş hizmeti sağlayıcıları:</strong> Hosting, e-posta, müşteri hizmeti yazılımı ve destek hizmeti veren şirketler (sözleşmesel veri koruma taahhütleri ile).</li>
<li><strong>Yasal merciler:</strong> Mahkeme kararı, yasal düzenleme veya resmi talep halinde yetkili kamu kurumları.</li>
</ul>
<p>Verilerinizi, KVKK ve ilgili mevzuata uygun şekilde yurt dışına da aktarabiliriz; bu durumda yeterli koruma veya açık rıza gibi yasal dayanaklar sağlanır.</p>

<h2>5. Çerezler ve Benzeri Teknolojiler</h2>
<p>Platformumuzda çerezler (cookies), piksel etiketleri ve benzeri teknolojiler kullanılmaktadır. Bunlar:</p>
<ul>
<li>Oturum ve güvenlik yönetimi (zorunlu),</li>
<li>Tercih ve dil ayarlarının hatırlanması (işlevsel),</li>
<li>Trafik ve kullanım analizi (performans/istatistik),</li>
<li>Reklam ve kişiselleştirme (açık rıza ile)</li>
</ul>
<p>için kullanılabilir. Tarayıcı ayarlarınızdan çerezleri kapatabilir veya sınırlayabilirsiniz; ancak bazı özellikler düzgün çalışmayabilir. Detaylı bilgi için "Çerez Politikası" bölümümüze bakınız.</p>

<h2>6. Veri Güvenliği</h2>
<p>Kişisel verilerinizi yetkisiz erişim, ifşa, değişiklik veya imhadan korumak için teknik (şifreleme, güvenli bağlantı, erişim kısıtları) ve idari (eğitim, gizlilik taahhütleri, denetim) tedbirler uyguluyoruz. Ödeme bilgileri PCI-DSS uyumlu ortamlarda işlenir. Veri ihlali durumunda yasal yükümlülüklerimize uygun şekilde bildirimde bulunacağız.</p>

<h2>7. Saklama Süresi</h2>
<p>Kişisel verilerinizi yalnızca işleme amacı için gerekli süre ve yasal saklama süreleri (ticari defter, vergi mevzuatı, tüketici mevzuatı) boyunca saklıyoruz. Süre sonunda veriler silinir, yok edilir veya anonim hale getirilir.</p>

<h2>8. Haklarınız</h2>
<p>KVKK ve ilgili mevzuat uyarınca:</p>
<ul>
<li>Kişisel verilerinizin işlenip işlenmediğini öğrenme ve işlenmişse bilgi talep etme,</li>
<li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
<li>Yurt içi/yurt dışı aktarılan üçüncü kişileri bilme,</li>
<li>Eksik/yanlış verilerin düzeltilmesini isteme,</li>
<li>Yasal şartlar çerçevesinde silinmesini veya yok edilmesini isteme,</li>
<li>Otomatik analiz sonucu aleyhinize bir sonuç çıkmasına itiraz etme,</li>
<li>Kanuna aykırı işlenmeden doğan zararın giderilmesini talep etme</li>
</ul>
<p>haklarına sahipsiniz. Başvurularınızı yazılı veya "Veri Sorumlusuna Başvuru" kanallarımız üzerinden iletebilirsiniz; yasal süre içinde yanıtlanacaktır.</p>

<h2>9. Çocukların Gizliliği</h2>
<p>Platformumuz 18 yaş altındaki bireylere yönelik değildir. Bilerek 18 yaş altındaki kişilerden kişisel veri toplamayı hedeflemiyoruz. 18 yaş altındaki bir bireyin bize veri bıraktığını fark edersek, bu verileri silmek için makul adımlar atacağız.</p>

<h2>10. Politika Değişiklikleri</h2>
<p>Bu Gizlilik Politikası zaman zaman güncellenebilir. Önemli değişiklikler Platform üzerinden veya e-posta ile duyurulacaktır. Güncel metin her zaman sitemizde yayımlanacaktır. Değişiklik sonrası Platformu kullanmaya devam etmeniz, güncel politikayı kabul ettiğiniz anlamına gelir.</p>

<h2>11. İletişim</h2>
<p>Gizlilik ve kişisel verilerinizle ilgili sorularınız veya talepleriniz için Ventura Turizm A.Ş. veri sorumlusu olarak iletişim kanallarımızı kullanabilirsiniz. Başvurularınız KVKK kapsamında değerlendirilecektir.</p>

<p><strong>Ventura Turizm A.Ş.</strong> – Gizlilik Politikası</p>
            `.trim(),
        },
    ];
    for (const c of defaultContracts) {
        const exists = await contractModel.findOne({ slug: c.slug });
        if (!exists) {
            await contractModel.create(c);
            console.log(`- Contract ${c.slug} created`);
        } else {
            await contractModel.updateOne({ slug: c.slug }, { $set: { title: c.title, content: c.content, order: c.order } });
            console.log(`- Contract ${c.slug} updated`);
        }
    }

    // 4. Sample Reservations
    const reservationModel = app.get('ReservationModel') as Model<Reservation>;
    const sampleReservations = [
        {
            reservationNo: 'VNT-2024-000001',
            type: 'flight',
            status: 'completed',
            memberFirstName: 'Ahmet',
            memberLastName: 'Yılmaz',
            memberEmail: 'ahmet.yilmaz@example.com',
            memberPhone: '+905551234567',
            passengers: [
                { firstName: 'Ahmet', lastName: 'Yılmaz', gender: 'male', nationality: 'TR' },
            ],
            segments: [
                {
                    airline: 'Turkish Airlines',
                    flightNo: 'TK123',
                    origin: 'IST',
                    destination: 'AYT',
                    departureAt: new Date('2024-07-15T06:00:00Z'),
                    arrivalAt: new Date('2024-07-15T07:10:00Z'),
                    cabinClass: 'Economy',
                },
            ],
            payment: { method: 'credit_card', transactionId: 'TXN-001', paidAt: new Date('2024-07-01'), amount: 1850, currency: 'TRY' },
            totalAmount: 1850,
            currency: 'TRY',
            completedAt: new Date('2024-07-15'),
        },
        {
            reservationNo: 'VNT-2024-000002',
            type: 'flight',
            status: 'completed',
            memberFirstName: 'Zeynep',
            memberLastName: 'Demir',
            memberEmail: 'zeynep.demir@example.com',
            memberPhone: '+905559876543',
            passengers: [
                { firstName: 'Zeynep', lastName: 'Demir', gender: 'female', nationality: 'TR' },
                { firstName: 'Can', lastName: 'Demir', gender: 'male', nationality: 'TR' },
            ],
            segments: [
                {
                    airline: 'Pegasus',
                    flightNo: 'PC456',
                    origin: 'SAW',
                    destination: 'ADB',
                    departureAt: new Date('2024-08-20T09:30:00Z'),
                    arrivalAt: new Date('2024-08-20T10:45:00Z'),
                    cabinClass: 'Economy',
                },
            ],
            payment: { method: 'credit_card', transactionId: 'TXN-002', paidAt: new Date('2024-08-10'), amount: 3200, currency: 'TRY' },
            totalAmount: 3200,
            currency: 'TRY',
            completedAt: new Date('2024-08-20'),
        },
        {
            reservationNo: 'VNT-2024-000003',
            type: 'tour',
            status: 'completed',
            memberFirstName: 'Mehmet',
            memberLastName: 'Kaya',
            memberEmail: 'mehmet.kaya@example.com',
            memberPhone: '+905554443322',
            passengers: [
                { firstName: 'Mehmet', lastName: 'Kaya', gender: 'male', nationality: 'TR' },
                { firstName: 'Ayşe', lastName: 'Kaya', gender: 'female', nationality: 'TR' },
            ],
            segments: [],
            payment: { method: 'bank_transfer', transactionId: 'TXN-003', paidAt: new Date('2024-09-01'), amount: 12500, currency: 'TRY' },
            totalAmount: 12500,
            currency: 'TRY',
            notes: 'Kapadokya 3 gece tur paketi',
            completedAt: new Date('2024-09-10'),
        },
        {
            reservationNo: 'VNT-2024-000004',
            type: 'car_rental',
            status: 'completed',
            memberFirstName: 'Fatma',
            memberLastName: 'Şahin',
            memberEmail: 'fatma.sahin@example.com',
            memberPhone: '+905556667788',
            passengers: [],
            segments: [],
            payment: { method: 'credit_card', transactionId: 'TXN-004', paidAt: new Date('2024-10-05'), amount: 2800, currency: 'TRY' },
            totalAmount: 2800,
            currency: 'TRY',
            notes: 'Antalya Havalimanı teslim alım — 5 gün',
            completedAt: new Date('2024-10-10'),
        },
        {
            reservationNo: 'VNT-2025-000001',
            type: 'flight',
            status: 'confirmed',
            memberFirstName: 'Ali',
            memberLastName: 'Çelik',
            memberEmail: 'ali.celik@example.com',
            memberPhone: '+905551112233',
            passengers: [
                { firstName: 'Ali', lastName: 'Çelik', gender: 'male', nationality: 'TR' },
            ],
            segments: [
                {
                    airline: 'Turkish Airlines',
                    flightNo: 'TK789',
                    origin: 'IST',
                    destination: 'LHR',
                    departureAt: new Date('2025-04-15T11:00:00Z'),
                    arrivalAt: new Date('2025-04-15T14:30:00Z'),
                    cabinClass: 'Business',
                },
            ],
            payment: { method: 'credit_card', transactionId: 'TXN-005', paidAt: new Date('2025-03-01'), amount: 28500, currency: 'TRY' },
            totalAmount: 28500,
            currency: 'TRY',
        },
        {
            reservationNo: 'VNT-2025-000002',
            type: 'bus',
            status: 'pending',
            memberFirstName: 'Hatice',
            memberLastName: 'Arslan',
            memberEmail: 'hatice.arslan@example.com',
            memberPhone: '+905558889900',
            passengers: [
                { firstName: 'Hatice', lastName: 'Arslan', gender: 'female', nationality: 'TR' },
            ],
            segments: [
                {
                    airline: 'Metro Turizm',
                    flightNo: 'MT-IST-AYD',
                    origin: 'İstanbul',
                    destination: 'Aydın',
                    departureAt: new Date('2025-04-20T22:00:00Z'),
                    arrivalAt: new Date('2025-04-21T06:30:00Z'),
                    cabinClass: '1+1',
                },
            ],
            payment: { method: 'credit_card', transactionId: 'TXN-006', paidAt: new Date('2025-03-20'), amount: 450, currency: 'TRY' },
            totalAmount: 450,
            currency: 'TRY',
        },
    ];

    for (const r of sampleReservations) {
        const exists = await reservationModel.findOne({ reservationNo: r.reservationNo });
        if (!exists) {
            await reservationModel.create(r);
            console.log(`- Reservation ${r.reservationNo} created`);
        }
    }

    // 6. User
    const adminUsername = 'admin';
    const existingUser = await usersService.findByUsername(adminUsername);
    if (!existingUser) {
        await usersService.create({
            name: 'System',
            surName: 'Admin',
            username: adminUsername,
            email: 'admin@ventura.com',
            passwordHash: 'admin123', // Will be hashed in service
            status: 'active',
            roles: [{ roleId: superAdminRole._id, assignedAt: new Date() } as any],
        });
        console.log('- User admin created (pass: admin123)');
    }

    console.log('✅ Seeding complete');
    await app.close();
}

bootstrap();
