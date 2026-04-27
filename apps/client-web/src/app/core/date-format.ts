import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

const TURKISH_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

@Injectable()
export class TurkishDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: string): string {
    if (displayFormat === 'input') {
      const day = date.getDate();
      const month = TURKISH_MONTHS[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    }
    return super.format(date, displayFormat);
  }

  override parse(value: string): Date | null {
    if (!value) {
      return null;
    }
    
    // Try to parse "1 Ocak 2026" format
    const parts = value.trim().split(' ');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const monthName = parts[1];
      const year = parseInt(parts[2], 10);
      
      const monthIndex = TURKISH_MONTHS.findIndex(m => m === monthName);
      if (monthIndex !== -1 && !isNaN(day) && !isNaN(year)) {
        return new Date(year, monthIndex, day);
      }
    }
    
    // Fallback to default parsing
    return super.parse(value);
  }

  override getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    return TURKISH_MONTHS;
  }
}

export const TURKISH_DATE_FORMATS = {
  parse: {
    dateInput: 'DD MMMM YYYY',
  },
  display: {
    dateInput: 'input',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
