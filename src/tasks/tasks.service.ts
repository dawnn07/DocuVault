import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateTaskDto } from './dto/create-task.dto';
import { Task, TaskDocument } from './task.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(
    userId: string,
    createTaskDto: CreateTaskDto
  ): Promise<TaskDocument> {
    const task = new this.taskModel({
      userId: new Types.ObjectId(userId),
      status: 'pending',
      ...createTaskDto,
    });

    return task.save();
  }

  async countTasksBySourceToday(
    userId: string,
    source: string
  ): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return this.taskModel.countDocuments({
      userId: new Types.ObjectId(userId),
      source,
      createdAt: { $gte: startOfDay },
    });
  }

  async findByUser(userId: string): Promise<TaskDocument[]> {
    return this.taskModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async countToday(userId?: string): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const query: Record<string, any> = { createdAt: { $gte: startOfDay } };
    if (userId) {
      query.userId = new Types.ObjectId(userId);
    }

    return this.taskModel.countDocuments(query);
  }
}
