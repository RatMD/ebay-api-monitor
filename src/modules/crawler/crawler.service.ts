import { Injectable } from '@nestjs/common';
import { SourcesService } from '../sources/sources.service';
import { ReleaseNotesService } from '../release-notes/release-notes.service';

@Injectable()
export class CrawlerService {
    constructor(
        private readonly sources: SourcesService,
        private readonly notes: ReleaseNotesService,
    ) { }

    async pollAll() {
        const active = await this.sources.findActive();
        // @todo parse
        return { sources: active.length };
    }
}
