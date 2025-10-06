import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { console } from 'inspector';
import { Model, Types } from 'mongoose';
import { TagsService } from 'src/tags/tags.service';

import { SearchDocumentDto } from './dtos/search-document';
import { UploadDocumentDto } from './dtos/upload-document.dto';
import { Document, DocumentDocument } from './schemas/document.schema';
import {
  DocumentTag,
  DocumentTagDocument,
} from './schemas/document-tag.schema';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name) private documentModel: Model<DocumentDocument>,
    @InjectModel(DocumentTag.name)
    private documentTagModel: Model<DocumentTagDocument>,
    private tagsService: TagsService
  ) {}

  async upload(
    ownerId: string,
    file: Express.Multer.File,
    uploadDto: UploadDocumentDto
  ): Promise<DocumentDocument> {
    const primaryTag = await this.tagsService.findOrCreate(
      ownerId,
      uploadDto.primaryTag
    );

    const document = new this.documentModel({
      ownerId: new Types.ObjectId(ownerId),

      filename: file.originalname,

      mime: file.mimetype,
      textContent: uploadDto.textContent || '',

      fileData: file.buffer,
    });

    await document.save();

    await this.assignPrimaryTag(
      document._id.toString(),
      primaryTag._id.toString()
    );

    if (uploadDto.secondaryTags && uploadDto.secondaryTags.length > 0) {
      for (const tagName of uploadDto.secondaryTags) {
        const tag = await this.tagsService.findOrCreate(ownerId, tagName);
        await this.assignSecondaryTag(
          document._id.toString(),
          tag._id.toString()
        );
      }
    }

    return document;
  }

  async assignPrimaryTag(documentId: string, tagId: string): Promise<void> {
    const existingPrimary = await this.documentTagModel.findOne({
      documentId: new Types.ObjectId(documentId),
      isPrimary: true,
    });

    if (existingPrimary) {
      existingPrimary.isPrimary = false;
      await existingPrimary.save();
    }

    const docTag = new this.documentTagModel({
      documentId: new Types.ObjectId(documentId),
      tagId: new Types.ObjectId(tagId),
      isPrimary: true,
    });

    await docTag.save();
  }

  async assignSecondaryTag(documentId: string, tagId: string): Promise<void> {
    const docTag = new this.documentTagModel({
      documentId: new Types.ObjectId(documentId),
      tagId: new Types.ObjectId(tagId),
      isPrimary: false,
    });
    await docTag.save();
  }

  async getFolders(ownerId: string): Promise<any[]> {
    const tags = await this.tagsService.findByOwner(ownerId);

    const folders = await Promise.all(
      tags.map(async (tag) => {
        const documents = await this.documentTagModel
          .find({ tagId: tag._id, isPrimary: true })
          .populate<{ documentId: DocumentDocument }>('documentId')
          .exec();

        const validDocs = documents.filter((dt) => {
          const doc = dt.documentId;
          return doc && doc.ownerId.toString() === ownerId;
        });

        return {
          name: tag.name,
          tagId: tag._id,
          documentCount: validDocs.length,
        };
      })
    );

    return folders.filter((f) => f.documentCount > 0);
  }

  async getDocumentsByFolder(
    ownerId: string,
    tagId: string
  ): Promise<DocumentDocument[] | []> {
    const tag = await this.tagsService.findById(tagId, ownerId);

    if (!tag) {
      throw new NotFoundException('Folder not found');
    }

    const documentTags = await this.documentTagModel
      .find({
        tagId: tag._id,
        isPrimary: true,
      })
      .populate('documentId')
      .exec();

    console.log('Document tags:', documentTags);

    const documents =
      documentTags
        .map((dt) => dt.documentId as unknown as DocumentDocument)
        .filter((doc) => doc && doc.ownerId.toString() === ownerId) || [];

    return documents;
  }

  async search(
    ownerId: string,
    searchDto: SearchDocumentDto
  ): Promise<DocumentDocument[]> {
    if (
      searchDto.scope === 'folder' &&
      searchDto.ids &&
      searchDto.ids.length > 0
    ) {
      throw new BadRequestException(
        'Cannot specify both folder scope and file ids'
      );
    }

    if (
      searchDto.scope === 'files' &&
      (!searchDto.ids || searchDto.ids.length === 0)
    ) {
      throw new BadRequestException('File ids required when scope is files');
    }

    const query: Record<string, unknown> = {
      ownerId: new Types.ObjectId(ownerId),
      $text: { $search: searchDto.q },
    };

    console.log('Search query:', searchDto);
    if (searchDto.scope === 'files' && searchDto.ids) {
      query._id = { $in: searchDto.ids.map((id) => new Types.ObjectId(id)) };
    }

    let documents = await this.documentModel.find(query).exec();

    if (
      searchDto.scope === 'folder' &&
      searchDto.ids &&
      searchDto.ids.length > 0
    ) {
      const tag = await this.tagsService.findById(searchDto.ids[0], ownerId);

      const documentTags = await this.documentTagModel
        .find({ tagId: tag._id, isPrimary: true })
        .exec();

      const docIds = documentTags.map((dt) => dt.documentId.toString());
      documents = documents.filter((doc) =>
        docIds.includes(doc._id.toString())
      );
    }

    return documents;
  }
}
