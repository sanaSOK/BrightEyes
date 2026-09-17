import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { typeOrmConfigOptions } from '../../config/typeorm.config';
import { User, Supplier, RetailShop, Sku } from '../entities';
import { UserRole, SkuType } from '../enums';

async function seed() {
  console.log('🌱 Starting BrightEyes Database Seeding...');
  const dataSource = new DataSource(typeOrmConfigOptions);
  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);
  const supplierRepository = dataSource.getRepository(Supplier);
  const shopRepository = dataSource.getRepository(RetailShop);
  const skuRepository = dataSource.getRepository(Sku);

  const passwordHash = await bcrypt.hash('Secret123!', 10);

  // 1. Admin User
  let admin = await userRepository.findOne({ where: { email: 'admin@brighteyes.com' } });
  if (!admin) {
    admin = userRepository.create({
      email: 'admin@brighteyes.com',
      phone: '+85512000000',
      passwordHash,
      role: UserRole.ADMIN,
    });
    await userRepository.save(admin);
    console.log('✅ Admin user created: admin@brighteyes.com');
  }

  // 2. Supplier User & Company
  let supplierUser = await userRepository.findOne({ where: { email: 'supplier@brighteyes.com' } });
  if (!supplierUser) {
    supplierUser = userRepository.create({
      email: 'supplier@brighteyes.com',
      phone: '+85512111111',
      passwordHash,
      role: UserRole.SUPPLIER,
    });
    await userRepository.save(supplierUser);
  }

  let supplier = await supplierRepository.findOne({ where: { userId: supplierUser.id } });
  if (!supplier) {
    supplier = supplierRepository.create({
      userId: supplierUser.id,
      companyName: 'Phnom Penh Optical Wholesale Co., Ltd.',
      taxId: 'KHM-TAX-889911',
      address: '#88 Monivong Boulevard, Phnom Penh',
      province: 'Phnom Penh',
    });
    await supplierRepository.save(supplier);
    console.log('✅ Supplier profile created: Phnom Penh Optical Wholesale');
  }

  // 3. Retail Shop User & Profile
  let retailerUser = await userRepository.findOne({ where: { email: 'retailer@brighteyes.com' } });
  if (!retailerUser) {
    retailerUser = userRepository.create({
      email: 'retailer@brighteyes.com',
      phone: '+85512222222',
      passwordHash,
      role: UserRole.RETAILER,
    });
    await userRepository.save(retailerUser);
  }

  let shop = await shopRepository.findOne({ where: { userId: retailerUser.id } });
  if (!shop) {
    shop = shopRepository.create({
      userId: retailerUser.id,
      shopName: 'Central Optical Phnom Penh',
      address: '#142 Norodom Boulevard, Phnom Penh',
      province: 'Phnom Penh',
      latitude: 11.5564,
      longitude: 104.9282,
    });
    await shopRepository.save(shop);
    console.log('✅ Retail shop created: Central Optical Phnom Penh');
  }

  // 4. Sample SKUs
  const sampleSkus = [
    {
      sku: 'LENS-SPH-2.00-CYL-1.00-AX90',
      type: SkuType.LENS,
      description: 'Single Vision AR Lens (-2.00 / -1.00 x 90)',
      price: 12.5,
      stockLevel: 150,
      sph: -2.0,
      cyl: -1.0,
      axis: 90,
      lowStockThreshold: 20,
    },
    {
      sku: 'LENS-SPH-3.50-CYL-0.50-AX180',
      type: SkuType.LENS,
      description: 'Single Vision Blue Cut Lens (-3.50 / -0.50 x 180)',
      price: 14.0,
      stockLevel: 80,
      sph: -3.5,
      cyl: -0.5,
      axis: 180,
      lowStockThreshold: 15,
    },
    {
      sku: 'LENS-SPH+1.50-CYL-0.00',
      type: SkuType.LENS,
      description: 'Reading Lens (+1.50 Spherical)',
      price: 10.0,
      stockLevel: 200,
      sph: 1.5,
      cyl: 0.0,
      axis: undefined,
      lowStockThreshold: 30,
    },
    {
      sku: 'FRAME-TITANIUM-BK-001',
      type: SkuType.FRAME,
      description: 'Ultra Lightweight Black Titanium Frame',
      price: 45.0,
      stockLevel: 45,
      lowStockThreshold: 10,
    },
    {
      sku: 'ACC-CLEANER-SPRAY-100ML',
      type: SkuType.ACCESSORY,
      description: 'Anti-Fog Lens Cleaning Spray 100ml',
      price: 3.5,
      stockLevel: 500,
      lowStockThreshold: 50,
    },
  ];

  for (const item of sampleSkus) {
    let existingSku = await skuRepository.findOne({ where: { sku: item.sku } });
    if (!existingSku) {
      existingSku = skuRepository.create({
        ...item,
        supplierId: supplier.id,
      });
      await skuRepository.save(existingSku);
      console.log(`  📦 Created SKU: ${item.sku}`);
    }
  }

  console.log('\n🎉 BrightEyes Database Seeding Completed Successfully!');
  console.log('----------------------------------------------------');
  console.log('Demo Credentials for Testing:');
  console.log('  👑 Admin:     admin@brighteyes.com / Secret123!');
  console.log('  🏢 Supplier:  supplier@brighteyes.com / Secret123!');
  console.log('  🛒 Retailer:  retailer@brighteyes.com / Secret123!');
  console.log('----------------------------------------------------\n');

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});
