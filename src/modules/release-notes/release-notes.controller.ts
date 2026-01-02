import { Controller, Get, Query } from '@nestjs/common';
import { ReleaseNotesService } from './release-notes.service';

@Controller('release-notes')
export class ReleaseNotesController {
    constructor(private readonly notes: ReleaseNotesService) { }

    @Get()
    list(@Query('sourceId') sourceId: string) {
        return this.notes.latestBySource(sourceId, 20);
    }
}
