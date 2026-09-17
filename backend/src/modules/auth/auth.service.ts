import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, Supplier, RetailShop } from '../../database/entities';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../../database/enums';
import { UserContext } from '../../common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(RetailShop)
    private shopRepository: Repository<RetailShop>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepository.findOne({
      where: [{ email: dto.email }, ...(dto.phone ? [{ phone: dto.phone }] : [])],
    });
    if (existing) {
      throw new ConflictException('User with this email or phone already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      role: dto.role,
    });
    const savedUser = await this.userRepository.save(user);

    let supplierId: string | undefined;
    let shopId: string | undefined;

    if (dto.role === UserRole.SUPPLIER) {
      const supplier = this.supplierRepository.create({
        userId: savedUser.id,
        companyName: dto.profileName || `${savedUser.email}'s Wholesale`,
      });
      const savedSupplier = await this.supplierRepository.save(supplier);
      supplierId = savedSupplier.id;
    } else if (dto.role === UserRole.RETAILER) {
      const shop = this.shopRepository.create({
        userId: savedUser.id,
        shopName: dto.profileName || `${savedUser.email}'s Optical`,
      });
      const savedShop = await this.shopRepository.save(shop);
      shopId = savedShop.id;
    }

    const payload = { sub: savedUser.id, email: savedUser.email, role: savedUser.role, supplierId, shopId };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        phone: savedUser.phone,
        role: savedUser.role,
        supplierId,
        shopId,
      },
      accessToken,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: [{ email: dto.identifier }, { phone: dto.identifier }],
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    let supplierId: string | undefined;
    let shopId: string | undefined;

    if (user.role === UserRole.SUPPLIER) {
      const supplier = await this.supplierRepository.findOne({ where: { userId: user.id } });
      supplierId = supplier?.id;
    } else if (user.role === UserRole.RETAILER) {
      const shop = await this.shopRepository.findOne({ where: { userId: user.id } });
      shopId = shop?.id;
    }

    const payload = { sub: user.id, email: user.email, role: user.role, supplierId, shopId };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        supplierId,
        shopId,
      },
      accessToken,
    };
  }

  async me(userCtx: UserContext) {
    const user = await this.userRepository.findOne({ where: { id: userCtx.id } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    let supplier = null;
    let shop = null;

    if (user.role === UserRole.SUPPLIER) {
      supplier = await this.supplierRepository.findOne({ where: { userId: user.id } });
    } else if (user.role === UserRole.RETAILER) {
      shop = await this.shopRepository.findOne({ where: { userId: user.id } });
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      supplier,
      shop,
      createdAt: user.createdAt,
    };
  }
}
