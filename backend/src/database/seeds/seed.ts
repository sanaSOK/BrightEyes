import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { typeOrmConfigOptions } from '../../config/typeorm.config';
import {
  User,
  Supplier,
  RetailShop,
  Sku,
  LensProduct,
  LensVariant,
  B2bInventory,
  CustomerPrescription,
  JobCard,
} from '../entities';
import { UserRole, SkuType, JobCardStatus } from '../enums';

async function seed() {
  console.log('🌱 Starting BrightEyes Optical Ecosystem Database Seeding...');
  const dataSource = new DataSource(typeOrmConfigOptions);
  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);
  const supplierRepository = dataSource.getRepository(Supplier);
  const shopRepository = dataSource.getRepository(RetailShop);
  const skuRepository = dataSource.getRepository(Sku);
  const productRepository = dataSource.getRepository(LensProduct);
  const variantRepository = dataSource.getRepository(LensVariant);
  const b2bInventoryRepository = dataSource.getRepository(B2bInventory);
  const prescriptionRepository = dataSource.getRepository(CustomerPrescription);
  const jobCardRepository = dataSource.getRepository(JobCard);

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

  // 2. Supplier User & Company Profile
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

  // 4. Consumer Customer User
  let customerUser = await userRepository.findOne({ where: { email: 'customer@brighteyes.com' } });
  if (!customerUser) {
    customerUser = userRepository.create({
      email: 'customer@brighteyes.com',
      phone: '+85512333333',
      passwordHash,
      role: UserRole.CUSTOMER,
    });
    await userRepository.save(customerUser);
    console.log('✅ Customer profile created: customer@brighteyes.com (+85512333333)');
  }

  // 5. Lens Master Products & Variant Matrix (SRS Section 6 DDL)
  let lensProduct = await productRepository.findOne({ where: { brandName: 'Essilor Crizal Sapphire HR' } });
  if (!lensProduct) {
    lensProduct = productRepository.create({
      brandName: 'Essilor Crizal Sapphire HR',
      lensType: 'Single Vision',
      lensMaterial: 'Polycarbonate 1.59',
      coating: 'Anti-Reflective Blue-Cut',
      description: 'Premium anti-reflective coated lens with scratch resistance and blue light filter.',
    });
    await productRepository.save(lensProduct);
    console.log('✅ Lens Master Product created: Essilor Crizal Sapphire HR');
  }

  const sampleVariants = [
    { sku: 'LENS-ESS-SPH-200-CYL-100-AX90', sph: -2.00, cyl: -1.00, axis: 90, addPower: 0, wholesalePrice: 18.50, stockQty: 250 },
    { sku: 'LENS-ESS-SPH-350-CYL-050-AX180', sph: -3.50, cyl: -0.50, axis: 180, addPower: 0, wholesalePrice: 22.00, stockQty: 180 },
    { sku: 'LENS-ESS-SPH+150-CYL000', sph: 1.50, cyl: 0.00, axis: 0, addPower: 1.50, wholesalePrice: 15.00, stockQty: 300 },
  ];

  for (const v of sampleVariants) {
    let variant = await variantRepository.findOne({ where: { sku: v.sku } });
    if (!variant) {
      variant = variantRepository.create({
        lensProductId: lensProduct.id,
        sku: v.sku,
        sph: v.sph,
        cyl: v.cyl,
        axis: v.axis,
        addPower: v.addPower,
        baseCurve: 8.6,
        diameter: 70.0,
      });
      await variantRepository.save(variant);

      // Seed Supplier B2B Wholesale Inventory
      let b2bInv = await b2bInventoryRepository.findOne({
        where: { supplierId: supplier.id, lensVariantId: variant.id },
      });
      if (!b2bInv) {
        b2bInv = b2bInventoryRepository.create({
          supplierId: supplier.id,
          lensVariantId: variant.id,
          stockQty: v.stockQty,
          wholesalePrice: v.wholesalePrice,
        });
        await b2bInventoryRepository.save(b2bInv);
      }
      console.log(`  🔍 Matrix Variant created & indexed: ${v.sku} (Sph ${v.sph}, Cyl ${v.cyl})`);
    }
  }

  // 6. Sample SKUs for Catalog Management
  const sampleSkus = [
    {
      sku: 'LENS-ESS-SPH-200-CYL-100-AX90',
      type: SkuType.LENS,
      description: 'Single Vision AR Lens (-2.00 / -1.00 x 90)',
      price: 18.5,
      stockLevel: 250,
      sph: -2.0,
      cyl: -1.0,
      axis: 90,
      lowStockThreshold: 20,
    },
    {
      sku: 'LENS-ESS-SPH-350-CYL-050-AX180',
      type: SkuType.LENS,
      description: 'Single Vision Blue Cut Lens (-3.50 / -0.50 x 180)',
      price: 22.0,
      stockLevel: 180,
      sph: -3.5,
      cyl: -0.5,
      axis: 180,
      lowStockThreshold: 15,
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
      sku: 'EQUIP-LENS-CUTTER-PRO-900',
      type: SkuType.EQUIPMENT,
      description: 'Automatic Optical Lens Edger & Cutter Machine Model 900',
      price: 3200.0,
      stockLevel: 5,
      lowStockThreshold: 1,
    },
    {
      sku: 'ACC-CLEANER-SPRAY-100ML',
      type: SkuType.CONSUMABLE,
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
      console.log(`  📦 Created Catalog SKU: ${item.sku}`);
    }
  }

  // 7. Clinical Prescription Record (OD & OS)
  let rx = await prescriptionRepository.findOne({ where: { customerId: customerUser.id } });
  if (!rx) {
    rx = prescriptionRepository.create({
      customerId: customerUser.id,
      storeId: shop.id,
      checkedBy: 'Dr. Sokha Meas (Ophthalmic Specialist)',
      odSph: -2.25,
      odCyl: -1.00,
      odAxis: 90,
      odAdd: 1.50,
      odPd: 31.5,
      osSph: -2.00,
      osCyl: -0.75,
      osAxis: 180,
      osAdd: 1.50,
      osPd: 31.5,
      baseCurve: 8.6,
      notes: 'Patient exhibits slight astigmatism in right eye. Prescribed Blue-Cut Polycarbonate lenses.',
    });
    await prescriptionRepository.save(rx);
    console.log('✅ Clinical Ophthalmic Prescription created for customer (OD/OS record)');
  }

  // 8. POS Lab Job Card
  let jobCard = await jobCardRepository.findOne({ where: { shopId: shop.id } });
  if (!jobCard) {
    jobCard = jobCardRepository.create({
      shopId: shop.id,
      prescriptionId: rx.id,
      status: JobCardStatus.IN_PROCESS,
      lensDetails: 'Essilor Crizal Sapphire HR (-2.25 / -1.00 x 90)',
      notes: 'Precision edging required for rimless titanium frame mount.',
    });
    await jobCardRepository.save(jobCard);
    console.log('✅ POS Lab Job Card created with status: In-Process');
  }

  console.log('\n🎉 BrightEyes Optical Ecosystem Database Seeding Completed Successfully!');
  console.log('----------------------------------------------------');
  console.log('Demo Credentials for Testing:');
  console.log('  👑 Admin:     admin@brighteyes.com / Secret123!');
  console.log('  🏢 Supplier:  supplier@brighteyes.com / Secret123!');
  console.log('  🛒 Retailer:  retailer@brighteyes.com / Secret123!');
  console.log('  👤 Customer:  customer@brighteyes.com / Secret123!');
  console.log('----------------------------------------------------\n');

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});
