import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, LessThanOrEqual, In, FindOptionsWhere } from 'typeorm';
import { SourceCategory, SourceEntity, SourceStatus } from './entities/source.entity';

@Injectable()
export class SourcesService {
    /**
     *
     * @param sourcesRepo
     */
    constructor(
        @InjectRepository(SourceEntity)
        private readonly sourcesRepo: Repository<SourceEntity>,
    ) { }

    /**
     *
     * @returns
     */
    findActive() {
        return this.sourcesRepo.find({
            where: { status: SourceStatus.ACTIVE },
            order: { id: 'ASC' },
        });
    }

    /**
     *
     * @returns
     */
    findActiveByCategory(category: SourceCategory) {
        return this.sourcesRepo.find({
            where: { status: SourceStatus.ACTIVE, category },
            order: { id: 'ASC' },
        });
    }

    /**
     *
     * @param sourceId
     * @param limit
     * @returns
     */
    findByQuery(categories: string[], apis: string[]) {
        const whereClauses: FindOptionsWhere<SourceEntity>[] = [];

        // Find by Category
        if (categories.length > 0) {
            whereClauses.push({ category: In(categories) });
        }

        // Find by APIs
        for (const pair of apis) {
            const [cat, slug] = pair.split('/').map(s => s.trim());
            if (!cat || !slug) {
                continue;
            }
            whereClauses.push({ category: cat as SourceCategory, slug });
        }

        // Statement
        const where = whereClauses.length > 0 ? whereClauses : {};
        return this.sourcesRepo.find({
            where,
            relations: { release_notes: true },
            order: { 
                category: 'ASC', 
                slug: 'ASC',
                release_notes: { release_date: 'DESC' }
            },
        });
    }
    
    /**
     *
     * @param limit
     * @returns
     */
    findDue(limit = 10) {
        const now = new Date();

        return this.sourcesRepo.find({
            where: [
                { status: SourceStatus.ACTIVE, deleted_at: IsNull(), next_run_at: LessThanOrEqual(now) },
                { status: SourceStatus.ACTIVE, deleted_at: IsNull(), next_run_at: IsNull() },
            ],
            order: { next_run_at: 'ASC' },
            take: limit,
        });
    }

    /**
     *
     * @param sourceId
     */
    async markStarted(sourceId: string) {
        await this.sourcesRepo.update(sourceId, {
            last_crawled_at: new Date(),
        });
    }

    /**
     *
     * @param sourceId
     * @param intervalSeconds
     */
    async scheduleNextRun(sourceId: string, intervalSeconds: number) {
        const next = new Date(Date.now() + intervalSeconds * 1000);

        await this.sourcesRepo.update(sourceId, {
            next_run_at: next,
        });
    }

    /**
     *
     * @param sourceId
     * @param retrySeconds
     */
    async scheduleRetry(sourceId: string, retrySeconds: number) {
        const next = new Date(Date.now() + retrySeconds * 1000);

        await this.sourcesRepo.update(sourceId, {
            next_run_at: next,
        });
    }
}
