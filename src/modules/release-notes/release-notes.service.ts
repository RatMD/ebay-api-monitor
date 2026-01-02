import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReleaseNoteEntity } from './entities/release-note.entity';

@Injectable()
export class ReleaseNotesService {
    constructor(
        @InjectRepository(ReleaseNoteEntity)
        private readonly notesRepo: Repository<ReleaseNoteEntity>,
    ) { }

    latestBySource(sourceId: string, limit = 20) {
        return this.notesRepo.find({
            where: { source_id: sourceId },
            order: { created_at: 'DESC' },
            take: limit,
        });
    }
}
