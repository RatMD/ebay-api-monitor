import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SourceEntity, SourceStatus } from './entities/source.entity';

@Injectable()
export class SourcesService {
    constructor(
        @InjectRepository(SourceEntity)
        private readonly sourcesRepo: Repository<SourceEntity>,
    ) { }

    findActive() {
        return this.sourcesRepo.find({
            where: { status: SourceStatus.ACTIVE },
            order: { id: 'ASC' },
        });
    }
}
