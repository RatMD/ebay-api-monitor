import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReleaseNoteEntity } from './entities/release-note.entity';
import { ReleaseNotesService } from './release-notes.service';
import { ReleaseNotesController } from './release-notes.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([ReleaseNoteEntity]),
    ],
    controllers: [ReleaseNotesController],
    providers: [ReleaseNotesService],
    exports: [ReleaseNotesService],
})
export class ReleaseNotesModule { }
