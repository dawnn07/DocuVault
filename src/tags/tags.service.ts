import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateTagDto } from './dto/create-tag.dto';
import { Tag, TagDocument } from './tag.schema';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  async create(
    ownerId: string,
    createTagDto: CreateTagDto
  ): Promise<TagDocument> {
    const tag = new this.tagModel({
      ownerId: new Types.ObjectId(ownerId),
      name: createTagDto.name,
    });
    return await tag.save();
  }

  async findByOwner(ownerId: string): Promise<TagDocument[]> {
    return this.tagModel
      .find({ ownerId: new Types.ObjectId(ownerId) })
      .sort({ name: 1 })
      .exec();
  }

  async findByName(ownerId: string, name: string): Promise<TagDocument | null> {
    return this.tagModel
      .findOne({
        ownerId: new Types.ObjectId(ownerId),
        name,
      })
      .exec();
  }

  async findById(id: string, ownerId: string): Promise<TagDocument> {
    const tag = await this.tagModel
      .findOne({
        _id: new Types.ObjectId(id),
        ownerId: new Types.ObjectId(ownerId),
      })
      .exec();

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return tag;
  }

  async findOrCreate(ownerId: string, name: string): Promise<TagDocument> {
    let tag = await this.findByName(ownerId, name);
    if (!tag) {
      tag = await this.create(ownerId, { name });
    }
    return tag;
  }

  async delete(id: string, ownerId: string): Promise<void> {
    const result = await this.tagModel
      .deleteOne({
        _id: new Types.ObjectId(id),
        ownerId: new Types.ObjectId(ownerId),
      })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('Tag not found');
    }
  }
}
