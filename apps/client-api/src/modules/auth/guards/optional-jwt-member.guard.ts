import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Opsiyonel JWT guard.
 * Token varsa ve geçerliyse req.user set edilir.
 * Token yoksa veya geçersizse hata fırlatmaz, req.user = null kalır.
 */
@Injectable()
export class OptionalJwtMemberGuard extends AuthGuard('jwt-member') {
  canActivate(context: ExecutionContext) {
    // Hata fırlatmadan devam et
    return super.canActivate(context) as Promise<boolean>;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRequest(_err: any, user: any) {
    // Auth hatası olsa da istisna fırlatma — kullanıcı null döner
    return user ?? null;
  }
}
