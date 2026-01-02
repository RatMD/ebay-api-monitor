import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
