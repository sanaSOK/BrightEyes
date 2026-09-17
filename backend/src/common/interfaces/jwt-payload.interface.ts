import { UserRole } from '../../database/enums';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  supplierId?: string;
  shopId?: string;
}

export interface UserContext {
  id: string;
  email: string;
  role: UserRole;
  supplierId?: string;
  shopId?: string;
}
