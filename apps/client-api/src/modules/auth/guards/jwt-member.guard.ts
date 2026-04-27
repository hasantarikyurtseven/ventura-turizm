import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Member JWT Guard – 'jwt-member' stratejisini kullanır.
 * Admin guard ile karışmaz.
 */
@Injectable()
export class JwtMemberGuard extends AuthGuard('jwt-member') {}
