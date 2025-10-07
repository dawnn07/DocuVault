import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Document,
  DocumentDocument,
} from 'src/documents/schemas/document.schema';
import { Tag, TagDocument } from 'src/tags/tag.schema';
import { Task, TaskDocument } from 'src/tasks/task.schema';
import { Usage, UsageDocument } from 'src/usage/usage.schema';

@Injectable()
export class MetricsService {
  constructor(
    @InjectModel(Document.name) private documentModel: Model<DocumentDocument>,
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
    @InjectModel(Usage.name) private usageModel: Model<UsageDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>
  ) {}

  async getMetrics(userId?: string): Promise<any> {
    const query = userId ? { ownerId: userId } : {};
    const docsTotal = await this.documentModel.countDocuments(query);

    const tagQuery = userId ? { ownerId: userId } : {};
    const foldersTotal = await this.tagModel.countDocuments(tagQuery);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const usageQuery: { [key: string]: any } = {
      timestamp: { $gte: startOfMonth },
    };
    if (userId) {
      usageQuery.userId = userId;
    }
    const actionsMonth = await this.usageModel.countDocuments(usageQuery);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const taskQuery: { [key: string]: any } = {
      createdAt: { $gte: startOfDay },
    };
    if (userId) {
      taskQuery.userId = userId;
    }
    const tasksToday = await this.taskModel.countDocuments(taskQuery);

    return {
      docs_total: docsTotal,
      folders_total: foldersTotal,
      actions_month: actionsMonth,
      tasks_today: tasksToday,
    };
  }
}
