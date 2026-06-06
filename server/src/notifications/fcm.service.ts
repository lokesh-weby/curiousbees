import { Injectable, Logger } from '@nestjs/common';


@Injectable()
export class FCMService {
  private readonly logger = new Logger(FCMService.name);

  async sendToToken(token: string, title: string, body: string, data?: any) {
    this.logger.debug(`[Mock FCM] sendToToken: token=${token}, title=${title}`);
    return true;
  }

  async sendToTopic(topic: string, title: string, body: string, data?: any) {
    this.logger.debug(`[Mock FCM] sendToTopic: topic=${topic}, title=${title}`);
    return true;
  }

  async subscribeToTopic(tokens: string[], topic: string) {
    this.logger.log(`[Mock FCM] subscribeToTopic: topic=${topic}, tokenCount=${tokens.length}`);
  }
}
