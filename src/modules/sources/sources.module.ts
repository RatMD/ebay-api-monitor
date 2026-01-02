import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourceEntity } from './entities/source.entity';
import { SourcesService } from './sources.service';
import { SourcesController } from './sources.controller';
import { ReleaseNoteEntity } from '../release-notes/entities/release-note.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([SourceEntity, ReleaseNoteEntity]),
    ],
    controllers: [SourcesController],
    providers: [SourcesService],
    exports: [SourcesService],
})
export class SourcesModule { }
