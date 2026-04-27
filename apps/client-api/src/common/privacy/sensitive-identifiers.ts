import { createHmac } from 'crypto';

/** 11 haneli TCKN (yalnızca rakam) — geçersizse null */
export function normalizeTurkishCitizenId(raw: string | undefined | null): string | null {
  if (raw == null || raw === '') return null;
  const d = String(raw).replace(/\D/g, '');
  if (d.length !== 11) return null;
  return d;
}

/**
 * KVKK / güvenlik: TCKN’yi düz metin aramalarında kullanmadan saklamak için HMAC-SHA256.
 * Ortam değişkeni CITIZEN_ID_STORAGE_PEPPER zorunlu olmalı; yoksa uyarı + güvenli olmayan sabit (yalnızca geliştirme).
 */
export function hashCitizenIdForStorage(normalizedTc: string, pepper: string): string {
  return createHmac('sha256', pepper).update(normalizedTc, 'utf8').digest('hex');
}

export function getCitizenIdPepper(): string {
  const p = process.env.CITIZEN_ID_STORAGE_PEPPER?.trim();
  if (p && p.length >= 16) return p;
  return 'ventura-dev-only-pepper-change-me';
}
