import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { AuditLog, AuditLogDocument } from './schema/audit-log.schema';

interface LogEntry {
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: any;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>
  ) {}

  async log(entry: LogEntry): Promise<AuditLogDocument> {
    const auditLog = new this.auditLogModel({
      at: new Date(),
      userId: new Types.ObjectId(entry.userId),
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      metadata: entry.metadata,
    });

    return auditLog.save();
  }

  async findByUser(
    userId: string,
    limit: number = 100
  ): Promise<AuditLogDocument[]> {
    return this.auditLogModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ at: -1 })
      .limit(limit)
      .exec();
  }

  async findByEntity(
    entityType: string,
    entityId: string
  ): Promise<AuditLogDocument[]> {
    return this.auditLogModel
      .find({ entityType, entityId })
      .sort({ at: -1 })
      .exec();
  }

  async findAll(limit: number = 1000): Promise<AuditLogDocument[]> {
    return this.auditLogModel.find().sort({ at: -1 }).limit(limit).exec();
  }
}
