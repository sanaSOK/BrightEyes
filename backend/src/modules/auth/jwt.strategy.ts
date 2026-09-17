import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Supplier, RetailShop } from '../../database/entities';
import { JwtPayload, UserContext } from '../../common/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(RetailShop)
    private shopRepository: Repository<RetailShop>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'super_secret_jwt_key_brighteyes'),
    });
  }

  async validate(payload: JwtPayload): Promise<UserContext> {
    const user = await this.userRepository.findOne({ where: { id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException('Invalid user session');
    }

    let supplierId: string | undefined = undefined;
    let shopId: string | undefined = undefined;

    if (user.role === 'supplier') {
      const supplier = await this.supplierRepository.findOne({ where: { userId: user.id } });
      supplierId = supplier?.id;
    } else if (user.role === 'retailer') {
      const shop = await this.shopRepository.findOne({ where: { userId: user.id } });
      shopId = shop?.id;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      supplierId,
      shopId,
    };
  }
}
