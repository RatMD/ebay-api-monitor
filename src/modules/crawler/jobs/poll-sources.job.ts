import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CrawlerService } from '../crawler.service';

@Injectable()
export class PollSourcesJob {
    /**
     * 
     */
    private readonly logger = new Logger(PollSourcesJob.name);

    /**
     *
     */
    private running = false;

    /**
     *
     * @param crawler
     */
    constructor(private readonly crawler: CrawlerService) { }

    // @todo use db value
    @Cron('* * * * *')
    async run() {
        if (this.running) {
            return;
        }
        this.running = true;
        
        try {
            await this.crawler.pollDueSources();
        } catch (err) {
            this.logger.error('Master poll failed', err);
        } finally {
            this.running = false;
        }
    }
}
