import { SetMetadata } from '@nestjs/common';
import { LoaiNguoiDung } from '../../dto/index.dto';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: LoaiNguoiDung[]) =>
  SetMetadata(ROLES_KEY, roles);
