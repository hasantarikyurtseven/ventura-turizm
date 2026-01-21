# Ventura Turizm - Monorepo

Tüm uygulama servislerinin Docker üzerinden orkestre edildiği, hot-reload destekli turizm yönetim sistemi.

## Proje Yapısı

Bu proje bir **monorepo** mimarisine sahiptir ve aşağıdaki servisleri içerir:

### Uygulamalar (apps/)
- **admin-api**: NestJS tabanlı yönetim paneli API'si (Port: 3001)
- **client-api**: NestJS tabanlı son kullanıcı API'si (Port: 3002)
- **jobs-service**: Arka plan işlerini yöneten NestJS worker servisi
- **admin-dashboard**: Angular CSR (PrimeNG + Bootstrap) yönetim arayüzü (Port: 4200)
- **client-web**: Angular SSR (Angular Material) son kullanıcı web sitesi (Port: 4300)

### Altyapı (Infrastructure)
- **MongoDB**: Ana veri tabanı (Port: 27017)
- **Redis**: Önbellekleme ve mesaj kuyruğu servisi (Port: 6379)
- **MinIO**: Nesne depolama ve CDN çözümü (Port: 9000/9001)

## Kurulum ve Çalıştırma

Sistemi yerel ortamınızda ayağa kaldırmak için aşağıdaki adımları izleyin:

1. **Çevresel Değişkenleri Hazırlayın:**
   ```bash
   cp .env.example .env
   ```

2. **Docker Servislerini Başlatın:**
   ```bash
   docker compose up --build
   ```

## Servis Linkleri (Local)

Servisler ayağa kalktıktan sonra aşağıdaki adreslerden erişebilirsiniz:

- **Yönetim Paneli (UI):** [http://localhost:4200](http://localhost:4200)
- **Web Sitesi (UI):** [http://localhost:4300](http://localhost:4300)
- **Yönetim API (Swagger):** [http://localhost:3001](http://localhost:3001)
- **Müşteri API (Swagger):** [http://localhost:3002](http://localhost:3002)
- **MinIO Portalı:** [http://localhost:9001](http://localhost:9001)

## Geliştirme Notları

- **Hot Reload:** Kaynak kodda yapacağınız değişiklikler Docker konteynerları içerisinde anlık olarak tetiklenir (NestJS watch mode ve Angular dev server).
- **Node Modules:** Servislerin bağımlılıkları Docker volume'leri içerisinde yönetilir, yerel ortamdaki `node_modules` klasörleri Docker tarafından göz ardı edilir.