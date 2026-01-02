import type { FastifyRequest } from 'fastify';
import { Controller, Get, Req } from '@nestjs/common';
import { SourcesService } from './sources.service';
import { SourceCategory } from './entities/source.entity';

interface ListSourcesQuery {
  category?: string;
}

@Controller('api/sources')
export class SourcesController {
    constructor(private readonly sources: SourcesService) { }

    @Get()
    async list(@Req() request: FastifyRequest<{ Querystring: ListSourcesQuery }>) {
        const category = request.query.category ?? 'all';

        const result = (Object.values(SourceCategory) as string[]).includes(category)
            ? await this.sources.findActiveByCategory(category as SourceCategory)
            : await this.sources.findActive();
        
        return {
            status: 'success',
            result: {
                count: result.length,
                items: result.map((entity) => ({
                    slug: entity.slug,
                    category: entity.category,
                    title: entity.title,
                    description: entity.description,
                    notes: entity.notes,
                    details: entity.details,
                    supported_version: entity.supported_version,
                    latest_version: entity.latest_version,
                    url: entity.url,
                    changelog_url: entity.changelog_url,
                }))
            }
        }
    }
}
