import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsageController } from './usage.controller';
import { Usage, UsageSchema } from './usage.schema';
import { UsageService } from './usage.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Usage.name, schema: UsageSchema }]),
  ],
  controllers: [UsageController],
  providers: [UsageService],
  exports: [UsageService],
})
export class UsageModule {}
