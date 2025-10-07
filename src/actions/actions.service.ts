import { BadRequestException, Injectable } from '@nestjs/common';

import { DocumentsService } from '../documents/documents.service';
import { UsageService } from '../usage/usage.service';
import { RunActionDto } from './dto/run-action.dto';
import { MockProcessorService } from './processors/mock-processor.service';

type Scope = { type: 'folder' | 'files'; name?: string; ids?: string[] };

type CreatedDocumentSummary = {
  id: string;
  filename: string;
  mime: string;
};

type RunActionResult = {
  success: boolean;
  creditsUsed: number;
  documents: CreatedDocumentSummary[];
};

@Injectable()
export class ActionsService {
  constructor(
    private documentsService: DocumentsService,
    private usageService: UsageService,
    private mockProcessor: MockProcessorService
  ) {}

  async runAction(
    userId: string,
    runActionDto: RunActionDto
  ): Promise<RunActionResult> {
    this.validateScope(runActionDto.scope);

    const context = await this.collectContext(userId, runActionDto.scope);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const results = this.mockProcessor.processAction(
      context,
      runActionDto.messages,
      runActionDto.actions
    );

    const createdDocuments: CreatedDocumentSummary[] = [];
    for (const result of results) {
      const doc = await this.documentsService.create(
        userId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        result.filename,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        result.mime,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        result.content
      );

      createdDocuments.push({
        id: doc._id.toString(),
        filename: doc.filename,
        mime: doc.mime,
      });
    }

    await this.usageService.recordUsage(userId, 'scoped_action', 5, {
      scope: runActionDto.scope,
      actions: runActionDto.actions,
    });

    return {
      success: true,
      creditsUsed: 5,
      documents: createdDocuments,
    };
  }

  private validateScope(scope: Scope): void {
    if (scope.type === 'folder' && !scope.name) {
      throw new BadRequestException('Folder name required for folder scope');
    }

    if (scope.type === 'files' && (!scope.ids || scope.ids.length === 0)) {
      throw new BadRequestException('File ids required for files scope');
    }

    if (scope.type === 'folder' && scope.ids && scope.ids.length > 0) {
      throw new BadRequestException('Cannot specify both folder and file ids');
    }
  }

  private collectContext(userId: string, scope: Scope): Promise<string> {
    return Promise.resolve(
      `Context for user ${userId} with scope ${JSON.stringify(scope)}`
    );
  }
}
