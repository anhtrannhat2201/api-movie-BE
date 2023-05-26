import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { LoaiNguoiDung, RequestWithUser } from '../../dto/index.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<LoaiNguoiDung[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();
    const isAuthorized = requiredRoles.some(
      (role) => user.loaiNguoiDung === role,
    );

    if (isAuthorized) return true;
    throw new UnauthorizedException(
      'Unauthorized. Không có quyền thực hiện hành động này.',
    );
  }
}
