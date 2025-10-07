import { Injectable } from '@nestjs/common';
import { stringify } from 'csv-stringify/sync';

interface Message {
  role: string;
  content: string;
}

@Injectable()
export class MockProcessorService {
  processAction(context: string, messages: Message[], actions: string[]): any {
    const results: Array<{
      type: string;
      filename: string;
      mime: string;
      content: string;
    }> = [];

    for (const action of actions) {
      if (action === 'make_document') {
        results.push({
          type: 'document',
          filename: 'generated-summary.txt',
          mime: 'text/plain',
          content: this.generateSummary(context, messages),
        });
      } else if (action === 'make_csv') {
        results.push({
          type: 'csv',
          filename: 'generated-data.csv',
          mime: 'text/csv',
          content: this.generateCSV(),
        });
      }
    }

    return results;
  }

  private generateSummary(context: string, messages: Message[]): string {
    const userMessage = messages.find((m) => m.role === 'user')?.content || '';

    return `
GENERATED SUMMARY
=================

Request: ${userMessage}

Context Analysis:
${context}

Summary:
This is a deterministic mock response generated based on the provided context.
The system has analyzed the documents in the specified scope and prepared this summary.

Generated at: ${new Date().toISOString()}
    `.trim();
  }

  private generateCSV(): string {
    const data = [
      ['Document', 'Category', 'Status', 'Value'],
      ['Doc-001', 'Invoice', 'Processed', '1250.00'],
      ['Doc-002', 'Receipt', 'Processed', '450.50'],
      ['Doc-003', 'Invoice', 'Pending', '2100.00'],
    ];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return stringify(data);
  }
}
