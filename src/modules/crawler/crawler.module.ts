import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { PollSourcesJob } from './jobs/poll-sources.job';

import { SourcesModule } from '../sources/sources.module';
import { ReleaseNotesModule } from '../release-notes/release-notes.module';
import { HttpModule } from '../../infrastructure/http/http.module';

@Module({
    imports: [
        SourcesModule,
        ReleaseNotesModule,
        HttpModule,
    ],
    providers: [CrawlerService, PollSourcesJob],
})
export class CrawlerModule { }
