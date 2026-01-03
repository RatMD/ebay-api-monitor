import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReleaseNoteEntity } from './entities/release-note.entity';
import { ReleaseNotesService } from './release-notes.service';
import { SourceEntity } from '../sources/entities/source.entity';
import { ReleaseNotesController } from './release-notes.controller';
import { FeedModule } from 'src/infrastructure/feed/feed.module';
import { SourcesModule } from '../sources/sources.module';
import { FeedController } from './feed.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([SourceEntity, ReleaseNoteEntity]),
        FeedModule,
        SourcesModule,
    ],
    controllers: [
        FeedController,
        ReleaseNotesController
    ],
    providers: [ReleaseNotesService],
    exports: [ReleaseNotesService],
})
export class ReleaseNotesModule { }
