import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReleaseNoteEntity } from './entities/release-note.entity';

export type ReleaseNoteUpsertInput = {
  version: string;
  title: string;
  url?: string | null;
  description?: string | null;
  release_date?: string | null;
  content: string;
  content_hash: string;
};

@Injectable()
export class ReleaseNotesService {
    /**
     *
     * @param notesRepo
     */
    constructor(
        @InjectRepository(ReleaseNoteEntity)
        private readonly notesRepo: Repository<ReleaseNoteEntity>,
    ) { }

    /**
     *
     * @param sourceId
     * @param limit
     * @returns
     */
    latestBySource(sourceId: string, limit = 20) {
        return this.notesRepo.find({
            where: { source_id: sourceId },
            order: { created_at: 'DESC' },
            take: limit,
        });
    }

    /**
     *
     * @param sourceId
     * @param limit
     * @returns
     */
    findByVersion(sourceId: string, version: string) {
        return this.notesRepo.findOne({
            where: { source_id: sourceId, version },
            order: { created_at: 'DESC' },
        });
    }

    /**
     *
     * @param sourceId
     * @param limit
     * @returns
     */
    upsertByVersion(sourceId: string, entity: ReleaseNoteUpsertInput) {
        return this.notesRepo.upsert({
            source_id: sourceId,
            ...entity
        }, ['source_id', 'version']);
    }
}
