import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ConfirmOrderDto } from './dto/confirm-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UserContext } from '../../common/interfaces/jwt-payload.interface';
import { UserRole } from '../../database/enums';

@ApiTags('Orders & Cart')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('cart')
  @Roles(UserRole.RETAILER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get current Redis-backed cart items for retail shop' })
  getCart(@GetUser() user: UserContext) {
    return this.ordersService.getCart(user);
  }

  @Post('cart')
  @Roles(UserRole.RETAILER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Add or update SKU quantity in Redis cart' })
  addToCart(@Body() dto: AddToCartDto, @GetUser() user: UserContext) {
    return this.ordersService.addToCart(dto, user);
  }

  @Delete('cart')
  @Roles(UserRole.RETAILER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Clear all items in cart' })
  clearCart(@GetUser() user: UserContext) {
    return this.ordersService.clearCart(user);
  }

  @Post('confirm')
  @Roles(UserRole.RETAILER, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Confirm order & execute atomic stock sync',
    description:
      'Deducts supplier stock, upserts retail inventory, records audit logs in a single DB transaction with pessimistic locking.',
  })
  @ApiHeader({
    name: 'Idempotency-Key',
    required: false,
    description: 'Unique client key preventing duplicate order creation on retries',
  })
  @ApiResponse({ status: 201, description: 'Order successfully confirmed' })
  confirmOrder(
    @Body() dto: ConfirmOrderDto,
    @Headers('idempotency-key') headerIdempotencyKey: string | undefined,
    @GetUser() user: UserContext,
  ) {
    return this.ordersService.confirmOrder(dto, headerIdempotencyKey, user);
  }

  @Get()
  @ApiOperation({ summary: 'List order history (scoped to user role & shop/supplier ID)' })
  findAll(@GetUser() user: UserContext) {
    return this.ordersService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detailed order information by ID' })
  findOne(@Param('id') id: string, @GetUser() user: UserContext) {
    return this.ordersService.findOne(id, user);
  }
}
