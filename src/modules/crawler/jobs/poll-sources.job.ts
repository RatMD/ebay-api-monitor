import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CrawlerService } from '../crawler.service';

@Injectable()
export class PollSourcesJob {
    private readonly logger = new Logger(PollSourcesJob.name);

    constructor(private readonly crawler: CrawlerService) { }

    // @todo use db value
    @Cron('*/15 * * * *')
    async run() {
        this.logger.log('Polling sources...');
        await this.crawler.pollAll();
    }
}
