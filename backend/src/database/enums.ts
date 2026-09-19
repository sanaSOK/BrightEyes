export enum UserRole {
  SUPPLIER = 'supplier',
  RETAILER = 'retailer',
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export enum SkuType {
  LENS = 'lens',
  FRAME = 'frame',
  CONTACT_LENS = 'contact_lens',
  CONSUMABLE = 'consumable',
  EQUIPMENT = 'equipment',
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

export enum PaymentTerms {
  IMMEDIATE = 'immediate',
  CREDIT = 'credit',
}

export enum JobCardStatus {
  RECEIVED = 'Received',
  IN_PROCESS = 'In-Process',
  READY = 'Ready',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

