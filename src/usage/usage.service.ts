import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Usage, UsageDocument } from './usage.schema';

@Injectable()
export class UsageService {
  constructor(
    @InjectModel(Usage.name) private usageModel: Model<UsageDocument>
  ) {}

  async recordUsage(
    userId: string,
    action: string,
    credits: number = 5,
    metadata?: any
  ): Promise<UsageDocument> {
    const usage = new this.usageModel({
      userId: new Types.ObjectId(userId),
      action,
      credits,
      timestamp: new Date(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      metadata,
    });

    return usage.save();
  }

  async getMonthlyUsage(userId: string): Promise<any> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const result: Array<{
      _id: Types.ObjectId;
      totalCredits: number;
      count: number;
    }> = await this.usageModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          timestamp: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: '$userId',
          totalCredits: { $sum: '$credits' },
          count: { $sum: 1 },
        },
      },
    ]);

    return result.length > 0
      ? {
          totalCredits: result[0].totalCredits,
          actionCount: result[0].count,
        }
      : { totalCredits: 0, actionCount: 0 };
  }
}
