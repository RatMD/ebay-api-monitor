import type { Cache } from 'cache-manager';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Get, Inject, Param, Req, Res } from '@nestjs/common';
import { FeedFormats, FeedItem, FeedService } from 'src/infrastructure/feed/feed.service';
import { ReleaseNotesService } from './release-notes.service';
import { SourcesService } from '../sources/sources.service';
import { SourceEntity } from '../sources/entities/source.entity';

interface ListFeedQuery {
    api?: string;
    category?: string;
}

@Controller('feed')
export class FeedController {
    /**
     *
     * @param feed
     * @param notes
     * @param sources
     */
    constructor(
        private readonly feed: FeedService,
        private readonly notes: ReleaseNotesService,
        private readonly sources: SourcesService,
        @Inject(CACHE_MANAGER)
        private readonly cache: Cache,
    ) { }

    /**
     *
     */
    @Get('feed.:type')
    async list(
        @Param('type') type: string, 
        @Req() req: FastifyRequest<{ Querystring: ListFeedQuery }>,
        @Res() res: FastifyReply
    ) {
        let format: FeedFormats | null = null;
        switch (type) {
            case 'atom.xml': format = 'atom'; break;
            case 'json':     format = 'json'; break;
            case 'rss.xml':  format = 'rss';  break;
        }
        if (format === null) {
            res.status(404).send('Unknown feed format');
            return;
        }
        
        // Parameters
        const categories = typeof req.query.category === 'string'
            ? req.query.category.split(',').map(s => s.trim().toLowerCase()).filter(Boolean).sort()
            : []
        const apis = typeof req.query.api === 'string'
            ? req.query.api.split(',').map(s => s.trim().toLowerCase()).filter(Boolean).sort()
            : []
        const base = req.protocol + '://' + req.hostname;
        const url = base + req.url;

        // Check Cache
        const cacheKey = `feed:${req.hostname}:${format}:category=${categories.join(',')}:api=${apis.join(',')}`;
        const cached = await this.cache.get<string>(cacheKey);
        if (cached) {
            if (format === 'atom') {
                res.type('application/atom+xml');
                return res.send(cached);
            } else if (format === 'json') {
                res.type('application/feed+json');
                return res.send(typeof cached == 'string' ? JSON.parse(cached) : cached);
            } else {
                res.type('application/rss+xml');
                return res.send(cached);
            }
        }

        // Fetch Items
        const sources: SourceEntity[] = await this.sources.findByQuery(categories, apis);
        const items: FeedItem[] = sources
            .flatMap((source): FeedItem[] =>
                (source.release_notes ?? []).map((note) => ({
                    url: note.url as string,
                    title: note.title,
                    description: note.description as string,
                    id: note.id,
                    content: note.content,
                    date: note.release_date ? new Date(`${note.release_date}T00:00:00Z`): note.created_at,
                }))
            )
            .sort((a, b) => (b.date as Date).getTime() - (a.date as Date).getTime());

        // Create Feed
        const isAggregated = categories.length === 0 && apis.length === 0;
        const title = isAggregated
        ? 'Aggregated eBay API Release Notes'
        : 'Filtered eBay API Release Notes';
        const description = (() => {
            if (isAggregated) {
                return 'An aggregated feed containing release notes for all available eBay APIs.';
            }
            const parts: string[] = [];
            if (categories.length > 0) {
                parts.push(`categories: ${categories.map(cat => `${cat}/*`).join(', ')}`);
            }
            if (apis.length > 0) {
                parts.push(`APIs: ${apis.join(', ')}`);
            }
            return `A filtered feed containing release notes for the selected eBay APIs (${parts.join('; ')}).`;
        })();
        const feed = this.feed.create({
            url: url,
            title,
            description,
            id: url,
            link: url,
            language: 'en',
            feedLinks: {
                atom: base + '/feed/feed.atom.xml',
                json: base + '/feed/feed.json',
                rss: base + '/feed/feed.rss.xml',
            }
        }, items, format);

        // Respond
        const payload = typeof feed === 'string' ? feed : JSON.stringify(feed);
        await this.cache.set(cacheKey, payload, 60 * 30);
        if (format === 'atom') {
            res.type('application/atom+xml');
            return res.send(feed);
        } else if (format === 'json') {
            res.type('application/feed+json');
            return res.send(feed);
        } else {
            res.type('application/rss+xml');
            return res.send(feed);
        }
    }
}
