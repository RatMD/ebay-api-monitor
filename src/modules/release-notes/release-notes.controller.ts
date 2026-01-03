import type { Cache } from 'cache-manager';
import type { FastifyReply } from 'fastify';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Get, Inject, Res } from '@nestjs/common';
import { SourcesService } from '../sources/sources.service';

@Controller('api')
export class ReleaseNotesController {
    /**
     *
     * @param feed
     * @param notes
     * @param sources
     */
    constructor(
        private readonly sources: SourcesService,
        @Inject(CACHE_MANAGER)
        private readonly cache: Cache,
    ) { }

    /**
     *
     */
    @Get('release_notes')
    async list(@Res() res: FastifyReply) {
        const sources = await this.sources.findByQuery([], []);
        return res.send({
            status: 'success',
            result: {
                count: sources.length,
                items: sources
            }
        });
    }
}
