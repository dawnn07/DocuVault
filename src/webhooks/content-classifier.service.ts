import { Injectable } from '@nestjs/common';

@Injectable()
export class ContentClassifierService {
  classify(text: string): { category: string; isAd: boolean } {
    const lowerText = text.toLowerCase();

    const financialTerms = [
      'invoice',
      'receipt',
      'payment',
      'transaction',
      'contract',
      'agreement',
      'legal',
      'tax',
      'statement',
      'bill',
    ];

    const promotionalTerms = [
      'sale',
      'discount',
      'offer',
      'limited time',
      'promo',
      'unsubscribe',
      'click here',
      'buy now',
      'deal',
      'free',
    ];

    const hasFinancial = financialTerms.some((term) =>
      lowerText.includes(term)
    );
    const hasPromotional = promotionalTerms.some((term) =>
      lowerText.includes(term)
    );

    if (hasPromotional) {
      return { category: 'ad', isAd: true };
    }

    if (hasFinancial) {
      return { category: 'official', isAd: false };
    }

    return { category: 'general', isAd: false };
  }

  extractUnsubscribeInfo(
    text: string
  ): { channel: string; target: string } | null {
    const emailMatch = text.match(/(?:mailto:|email:)\s*([^\s<>]+@[^\s<>]+)/i);
    if (emailMatch) {
      return { channel: 'email', target: emailMatch[1] };
    }

    const urlMatch = text.match(
      /(?:unsubscribe|stop).*?(https?:\/\/[^\s<>]+)/i
    );
    if (urlMatch) {
      return { channel: 'url', target: urlMatch[1] };
    }

    return null;
  }
}
