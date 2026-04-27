# Cursor Rules — Biletbank API / Allocate Uygulama Kılavuzu (Eksiksiz Entegrasyon Kuralları)

> Bu dosya, Cursor (IDE) içinde çalışırken **Biletbank API “Allocate”** adımını eksiksiz uygulayabilmek için “rulers/rules” mantığında yazılmıştır:  
> - Kod üretirken **hiçbir adımı atlama**  
> - Header/Body alanlarını **zorunluluklarına göre** kontrol et  
> - Akış sırası, hata yönetimi, loglama, test ve güvenlik dahil **tam entegrasyon** kuralları uygula

---

## 0) Amaç

Allocate çağrısı, AirSearch sonucunda seçilen ürün/opsiyon için **tahsis (allocation)** işlemini gerçekleştirir.  
Bu adım genellikle arama → ürün seçimi → allocate → (gerekirse yolcu güncelleme) → ön rezervasyon/ödeme/finalize akışının bir parçasıdır.

Bu dosya; frontend/backend fark etmeksizin, uygulama tarafında Allocate entegrasyonunun:
- Doğru sırada çağrılmasını,
- Doğru header ve request body ile gönderilmesini,
- Response’un doğru modellenmesini,
- Hata durumlarının doğru ele alınmasını,
- Log/izlenebilirlik/testlerin yazılmasını
zorunlu kılar.

---

## 1) Mutlaka Uyulacak Akış Sırası

### 1.1 Zorunlu çağrı sırası
1. **Login** yapılır → `SessionId` ve `SessionToken` elde edilir.
2. **AirSearch** yapılır → ürün/flight seçenekleri ve seçilecek `ProductId` elde edilir.
3. **Allocate** yapılır → seçilen ürün tahsis edilir.
4. Sonraki adımlar sisteminizin satın alma akışına göre:
   - **UpdatePassenger** (varsa)
   - **MakePreBooking** (varsa)
   - **MakePayment** (varsa)
   - **FinalizeShopping** (varsa)

> Kural: Allocate çağrısı **Login + AirSearch olmadan** yapılmaz.

### 1.2 Oturum (session) disiplin kuralı
- Allocate işlemi, **AirSearch ile aynı session** içinde ve **session canlıyken** yapılmalıdır.
- Session yönetimi tek yerde toplanmalıdır (örn: `BiletbankSessionManager`).

---

## 2) Kimlik Doğrulama (Authentication Header) Zorunlulukları

Allocate çağrısında **AuthenticationHeader** (veya HTTP header muadili) zorunludur.

### 2.1 Zorunlu alanlar
- `SessionId` (Login’den gelir)
- `SessionToken` (Login’den gelir)

> Kural: Bu iki değer yoksa istek **gönderilmez**, uygulama tarafında “precondition error” fırlatılır.

### 2.2 Güvenlik kuralları
- SessionId/Token loglarda **maskelenerek** yazılır:
  - Örn: `SESS-12***89`, `TOK-AB***YZ`
- Bu değerler hiçbir şekilde client’a açık şekilde döndürülmez (özellikle frontend).

---

## 3) Allocate Request Body (Form / SelectedItems) Zorunlulukları

Allocate request body içinde **seçilen ürün** ve **komisyon/servis ücreti** gibi alanlar bulunur.

### 3.1 Zorunlu alanlar
- `ProductId`: AirSearch sonucunda seçilen ürün kimliği
- `SelectedServiceFee.Amount` (veya dokümanda geçen eşdeğer alan):
  - Satıcı komisyonu / servis ücreti gibi kullanılan tutar.
  - Komisyon hesaplanmıyorsa **0** gönderilir.

> Kural: `ProductId` boş/undefined/null ise Allocate çağrısı yapılmaz.

### 3.2 Para birimi / decimal kuralları
- Amount alanı **decimal** tutulmalı (JS/TS’de string veya number; tercihen string).
- Yuvarlama/format için tek kural belirle:
  - Örn: `toFixed(2)` veya backend’de `Decimal128` / `big.js`

---

## 4) Uygulama Tasarım Kuralları (Katmanlar)

### 4.1 Service katmanı
Allocate çağrısı bir “service” üzerinden yapılır:
- `BiletbankClient.allocate(request, session)`

### 4.2 DTO/Model katmanı
Request/response için tipler net olmalıdır:
- `AllocateRequestDto`
- `AllocateResponseDto`

### 4.3 Tek sorumluluk
- Session yönetimi ayrı
- Request oluşturma ayrı
- HTTP/SOAP istemcisi ayrı
- Mapping/validation ayrı

---

## 5) Validasyon Kuralları (Request göndermeden önce)

Allocate çağrısından önce **mutlaka** kontrol et:

### 5.1 Session kontrolleri
- `SessionId` var mı?
- `SessionToken` var mı?
- Session süresi/expiry kontrol edilebiliyorsa kontrol et

### 5.2 Product kontrolleri
- `ProductId` var mı?
- `ProductId` AirSearch’ten gelen seçeneklerden biri mi? (mümkünse doğrula)

### 5.3 Amount kontrolleri
- `Amount` null değil
- Negatif değil
- Format doğru (2 hane kuralı seçildiyse uyuyor)

---

## 6) HTTP/SOAP İstemci Kuralları (Dayanıklılık)

### 6.1 Timeout
- Allocate çağrısına timeout tanımla (örn: 20–40 sn).

### 6.2 Retry
- Sadece **idempotent** olduğundan emin olunan hata türlerinde retry uygula.
- Eğer Allocate “tahsis” yaptığı için idempotent değilse:
  - Retry **çok dikkatli** uygulanmalı (sadece network timeouts + request gönderilmediği kesin ise)
  - Aksi halde duplicate allocation riski olabilir.

### 6.3 Correlation ID
- Her isteğe `correlationId` üret ve loglara ekle.
- Mümkünse header olarak da gönder.

---

## 7) Hata Yönetimi (Eksiksiz)

Allocate çağrısında şu durumlar ayrı ele alınmalı:

### 7.1 Kimlik doğrulama hataları
- Session invalid/expired → otomatik re-login stratejisi (isteğe bağlı) veya kullanıcıya “yeniden dene” mesajı

### 7.2 Ürün uygun değil / stok bitti
- AirSearch sonucu ile Allocate arası süre geçtiyse ürün düşebilir → kullanıcıya yeni arama öner

### 7.3 Validasyon hatası
- Eksik alan → kendi uygulaman “400” benzeri hata üretmeli (request hiç gönderilmemeli)

### 7.4 Sunucu hataları / 5xx
- Logla, gerekirse kısa süreli retry (kural 6.2’ye uygun)

### 7.5 Beklenmeyen response
- Response schema dışıysa raw payload güvenli şekilde loglanır (PII yoksa), “IntegrationError” fırlatılır.

---

## 8) Loglama & İzlenebilirlik (Zorunlu)

### 8.1 Log seviyeleri
- INFO: “Allocate started”, “Allocate success”
- WARN: “Allocate retry”, “Product not available”
- ERROR: “Allocate failed” (stack trace + correlationId)

### 8.2 Log içinde bulunması gerekenler
- `correlationId`
- masked `SessionId`, masked `SessionToken`
- `ProductId`
- `Amount`
- elapsed time (ms)
- response status / error code

> Kural: PII (yolcu adı, TC vb) loga yazma.

---

## 9) Test Kuralları (Eksiksiz)

### 9.1 Unit test
- `validateAllocateRequest()` testleri:
  - ProductId yok → fail
  - Session yok → fail
  - Amount negatif → fail
- `mapAllocateResponse()` testleri:
  - Response alanları doğru mapleniyor mu?

### 9.2 Integration test (mümkünse)
- Sandbox/Stage ortamında:
  - Login → AirSearch → Allocate senaryosu
  - Allocate sonrası beklenen alanlar var mı?

### 9.3 Contract test
- Response schema değişirse build kırılacak şekilde JSON schema / zod / class-validator gibi contract kontrol ekle.

---

## 10) Örnek Tip Taslağı (Projeye uyarlayın)

> Aşağıdaki tipler “taslak”. Biletbank dokümanındaki gerçek alan adlarına göre birebir uyarlayın.

```ts
export interface BiletbankAuth {
  sessionId: string;
  sessionToken: string;
}

export interface AllocateRequestDto {
  form: {
    selectedItems: {
      productId: string | number;i
      selectedServiceFee: {
        amount: string; // "0.00"
      };
    };
  };
}

export interface AllocateResponseDto {
  // dokümana göre doldur
  // örn: allocationId, lastSellerCommission, warnings, errors...
  raw?: unknown;
}