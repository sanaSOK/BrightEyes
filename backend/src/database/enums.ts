export enum UserRole {
  SUPPLIER = 'supplier',
  RETAILER = 'retailer',
  ADMIN = 'admin',
}

export enum SkuType {
  LENS = 'lens',
  FRAME = 'frame',
  ACCESSORY = 'accessory',
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum DeliveryMethod {
  CARGO_24H = 'cargo_24h',
  EXPRESS_MOTO = 'express_moto',
  SELF_PICKUP = 'self_pickup',
}
