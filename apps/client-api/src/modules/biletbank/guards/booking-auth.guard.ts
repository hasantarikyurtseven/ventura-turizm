import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { firstValueFrom, Observable } from 'rxjs';

/**
 * Booking işlemleri için authentication guard.
 * - SearchOnly: Auth gerekmez (sadece arama)
 * - SearchAndBook: Auth zorunlu (rezervasyon akışı)
 * - Diğer booking adımları: Auth zorunlu
 */
@Injectable()
export class BookingAuthGuard extends AuthGuard('jwt-member') {
  private readonly logger = new Logger(BookingAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;
    
    // Debug: Token'ın varlığını kontrol et
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.warn('Token header bulunamadı', {
        path: request.path,
        method: request.method,
        hasAuthHeader: !!authHeader,
      });
    }

    // AirSearch için SearchReason kontrolü
    if (body?.searchReason) {
      // SearchOnly: Auth gerekmez
      if (body.searchReason === 'SearchOnly') {
        return true;
      }
      
      // SearchAndBook: Auth zorunlu
      if (body.searchReason === 'SearchAndBook') {
        const result = super.canActivate(context);
        if (typeof result === 'boolean') return result;
        if (result instanceof Promise) return result as Promise<boolean>;
        return firstValueFrom(result as Observable<boolean>);
      }
    }

    // Diğer booking adımları için (Allocate, MakePreBooking, MakePayment, FinalizeShopping)
    const result = super.canActivate(context);
    if (typeof result === 'boolean') return result;
    if (result instanceof Promise) return result as Promise<boolean>;
    return firstValueFrom(result as Observable<boolean>);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const body = request.body;
    
    // SearchOnly durumunda hata fırlatma (zaten canActivate'de true döndük)
    if (body?.searchReason === 'SearchOnly') {
      this.logger.debug('SearchOnly - Auth bypass', {
        path: request.path,
        searchReason: body.searchReason,
      });
      return null;
    }
    
    // Token yoksa veya geçersizse
    if (err || !user) {
      // Token yoksa (header'da Authorization yok)
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        this.logger.warn('Token header bulunamadı veya geçersiz format', {
          path: request.path,
          method: request.method,
          searchReason: body?.searchReason,
          hasAuthHeader: !!authHeader,
          authHeaderPrefix: authHeader?.substring(0, 10) || 'N/A',
        });
        
        if (body?.searchReason === 'SearchAndBook') {
          throw new UnauthorizedException(
            'Rezervasyon işlemleri için giriş yapmanız gerekmektedir. Lütfen giriş yapın ve tekrar deneyin.',
          );
        }
        throw new UnauthorizedException(
          'Bu işlem için giriş yapmanız gerekmektedir.',
        );
      }
      
      // Token hatası türüne göre mesaj
      this.logger.warn('Token doğrulama hatası', {
        path: request.path,
        method: request.method,
        searchReason: body?.searchReason,
        errorName: info?.name,
        errorMessage: err?.message || info?.message,
        hasUser: !!user,
      });
      
      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException(
          'Geçersiz token. Lütfen tekrar giriş yapın.',
        );
      }
      
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.',
        );
      }
      
      // Diğer hatalar
      if (body?.searchReason === 'SearchAndBook') {
        throw new UnauthorizedException(
          'Rezervasyon işlemleri için giriş yapmanız gerekmektedir. Lütfen giriş yapın ve tekrar deneyin.',
        );
      }
      
      throw new UnauthorizedException(
        'Bu işlem için giriş yapmanız gerekmektedir.',
      );
    }
    
    this.logger.debug('Token doğrulama başarılı', {
      path: request.path,
      method: request.method,
      searchReason: body?.searchReason,
      userId: user?.memberId,
    });
    
    return user;
  }
}
