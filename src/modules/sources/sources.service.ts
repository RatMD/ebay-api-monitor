import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, LessThanOrEqual } from 'typeorm';
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
