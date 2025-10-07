import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';

import { AppModule } from '../src/app.module';
import { AuditService } from '../src/audit/audit.service';
import { DocumentsService } from '../src/documents/documents.service';
import { TagsService } from '../src/tags/tags.service';
import { UsersService } from '../src/users/users.service';

config();

async function seed() {
  console.log('🌱 Starting database seed...');

  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const tagsService = app.get(TagsService);
  const documentsService = app.get(DocumentsService);
  const auditService = app.get(AuditService);

  try {
    // Create demo users
    console.log('Creating users...');

    const admin = await usersService.create({
      email: 'admin@example.com',
      role: 'admin',
    });
    console.log('✓ Admin user created:', admin.email);

    const user1 = await usersService.create({
      email: 'john@example.com',
      role: 'user',
    });
    console.log('✓ User created:', user1.email);

    const user2 = await usersService.create({
      email: 'jane@example.com',
      role: 'user',
    });
    console.log('✓ User created:', user2.email);

    const support = await usersService.create({
      email: 'support@example.com',
      role: 'support',
    });
    console.log('✓ Support user created:', support.email);

    // Create tags for user1
    console.log('\nCreating tags for user1...');
    const invoicesTag = await tagsService.create(user1._id.toString(), {
      name: 'invoices-2025',
    });
    console.log('✓ Tag created:', invoicesTag.name);

    const receiptsTag = await tagsService.create(user1._id.toString(), {
      name: 'receipts',
    });
    console.log('✓ Tag created:', receiptsTag.name);

    const contractsTag = await tagsService.create(user1._id.toString(), {
      name: 'contracts',
    });
    console.log('✓ Tag created:', contractsTag.name);

    // Create sample documents for user1
    console.log('\nCreating sample documents for user1...');

    const doc1 = await documentsService.create(
      user1._id.toString(),
      'invoice-001.txt',
      'text/plain',
      'Invoice #001\nVendor: Acme Corp\nAmount: $1,250.00\nDate: 2025-01-15\nServices: Web development and design'
    );
    await documentsService.assignPrimaryTag(
      doc1._id.toString(),
      invoicesTag._id.toString()
    );
    console.log('✓ Document created:', doc1.filename);

    const doc2 = await documentsService.create(
      user1._id.toString(),
      'invoice-002.txt',
      'text/plain',
      'Invoice #002\nVendor: TechSupply Inc\nAmount: $450.50\nDate: 2025-01-20\nServices: Hardware and equipment'
    );
    await documentsService.assignPrimaryTag(
      doc2._id.toString(),
      invoicesTag._id.toString()
    );
    console.log('✓ Document created:', doc2.filename);

    const doc3 = await documentsService.create(
      user1._id.toString(),
      'receipt-coffee.txt',
      'text/plain',
      'Receipt - Coffee Shop\nAmount: $12.50\nDate: 2025-02-01\nItems: 2x Latte, 1x Croissant'
    );
    await documentsService.assignPrimaryTag(
      doc3._id.toString(),
      receiptsTag._id.toString()
    );
    console.log('✓ Document created:', doc3.filename);

    const doc4 = await documentsService.create(
      user1._id.toString(),
      'contract-freelance.txt',
      'text/plain',
      'Freelance Contract Agreement\nClient: StartupXYZ\nPeriod: Q1 2025\nRate: $150/hour\nTerms: Net 30 payment terms'
    );
    await documentsService.assignPrimaryTag(
      doc4._id.toString(),
      contractsTag._id.toString()
    );
    console.log('✓ Document created:', doc4.filename);

    const doc5 = await documentsService.create(
      user1._id.toString(),
      'invoice-003.txt',
      'text/plain',
      'Invoice #003\nVendor: CloudHost Services\nAmount: $2,100.00\nDate: 2025-02-05\nServices: Annual cloud hosting and backup'
    );
    await documentsService.assignPrimaryTag(
      doc5._id.toString(),
      invoicesTag._id.toString()
    );
    console.log('✓ Document created:', doc5.filename);

    // Create tags for user2
    console.log('\nCreating tags for user2...');
    const projectsTag = await tagsService.create(user2._id.toString(), {
      name: 'projects',
    });
    console.log('✓ Tag created:', projectsTag.name);

    const doc6 = await documentsService.create(
      user2._id.toString(),
      'project-proposal.txt',
      'text/plain',
      'Project Proposal: Mobile App Development\nClient: RetailCo\nEstimate: $50,000\nTimeline: 3 months'
    );
    await documentsService.assignPrimaryTag(
      doc6._id.toString(),
      projectsTag._id.toString()
    );
    console.log('✓ Document created:', doc6.filename);

    // Create audit logs
    console.log('\nCreating audit logs...');
    await auditService.log({
      userId: user1._id.toString(),
      action: 'seed',
      entityType: 'database',
      metadata: { type: 'initial_seed' },
    });

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\nDemo users created:');
    console.log('  - admin@example.com (admin)');
    console.log('  - john@example.com (user) - has sample documents');
    console.log('  - jane@example.com (user)');
    console.log('  - support@example.com (support)');
    console.log(
      '\nUse the generate-jwt script to create tokens for these users.'
    );
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await app.close();
  }
}

seed().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
