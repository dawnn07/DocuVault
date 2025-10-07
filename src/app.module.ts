import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

import { ActionsModule } from './actions/actions.module';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/documents.module';
import { MetricsModule } from './metrics/metrics.module';
import { TagsModule } from './tags/tags.module';
import { TasksModule } from './tasks/tasks.module';
import { UsageModule } from './usage/usage.module';
import { UsersModule } from './users/users.module';
import { WebhooksModule } from './webhooks/webhooks.module';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    TagsModule,
    MetricsModule,
    AuditModule,
    DocumentsModule,
    WebhooksModule,
    UsersModule,
    AuthModule,
    TasksModule,
    UsageModule,
    ActionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
