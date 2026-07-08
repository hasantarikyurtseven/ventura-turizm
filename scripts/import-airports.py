#!/usr/bin/env python3
"""
Excel'deki havalimanı verilerini MongoDB airports koleksiyonuna aktarır.
Mevcut kayıtlar airportCode bazında upsert edilir (çift kayıt oluşmaz).
"""
import sys
import openpyxl
from pymongo import MongoClient, UpdateOne
from pymongo.errors import BulkWriteError

EXCEL_PATH = "/Users/tarik/Documents/projeler/ventura-turizm/Airports&Cities&Countries EN.xlsx"
MONGO_URI  = "mongodb://root:example@localhost:27017/ventura?authSource=admin"
DB_NAME    = "ventura"
COLLECTION = "airports"

def main():
    print("📂 Excel dosyası okunuyor...")
    wb = openpyxl.load_workbook(EXCEL_PATH, read_only=True)
    ws = wb["Sayfa1"]

    rows = list(ws.iter_rows(min_row=2, values_only=True))
    print(f"   {len(rows)} kayıt bulundu.")

    print("🔌 MongoDB'ye bağlanılıyor...")
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db     = client[DB_NAME]
    col    = db[COLLECTION]

    # Bağlantı testi
    client.admin.command("ping")
    print("   Bağlantı başarılı.")

    operations = []
    for row in rows:
        city_code, city_name, airport_code, airport_name, \
        country_code, country_name, tz_id, rating = row

        if not airport_code:
            continue

        # searchName: arama kolaylığı için birleşik metin
        search_name = " ".join(filter(None, [
            str(airport_name or ""),
            str(airport_code or ""),
            str(city_name or ""),
            str(country_name or ""),
        ])).lower()

        doc = {
            "cityCode":    str(city_code    or "").strip(),
            "cityName":    str(city_name    or "").strip(),
            "airportCode": str(airport_code or "").strip(),
            "airportName": str(airport_name or "").strip(),
            "countryCode": str(country_code or "").strip(),
            "countryName": str(country_name or "").strip(),
            "timeZoneId":  str(tz_id        or "").strip() or None,
            "rating":      str(int(rating)) if rating is not None else "0",
            "searchName":  search_name,
        }

        operations.append(UpdateOne(
            {"airportCode": doc["airportCode"]},
            {"$set": doc},
            upsert=True,
        ))

    print(f"💾 {len(operations)} işlem MongoDB'ye yazılıyor (upsert)...")
    try:
        result = col.bulk_write(operations, ordered=False)
        print(f"✅ Tamamlandı!")
        print(f"   Eklenen : {result.upserted_count}")
        print(f"   Güncellenen: {result.modified_count}")
    except BulkWriteError as e:
        print(f"⚠️  Bazı hatalar oluştu: {e.details.get('nErrors', '?')} hata")
        print(f"   Başarılı upsert: {e.details.get('nUpserted', 0)}")
        print(f"   Başarılı güncelleme: {e.details.get('nModified', 0)}")

    client.close()

if __name__ == "__main__":
    main()
