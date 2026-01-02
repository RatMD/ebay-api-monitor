import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { SourceEntity } from '../../sources/entities/source.entity';

@Entity({ name: 'release_notes' })
@Index('index_release_notes_source_id', ['source_id'])
@Index('index_release_notes_release_date', ['release_date'])
@Index('index_release_notes_content_hash', ['content_hash'])
@Index('index_release_notes_source_hash_unique', ['source_id', 'content_hash'], { unique: true })
export class ReleaseNoteEntity {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: string;

    @Column({ type: 'bigint', unsigned: true })
    source_id: string;

    @ManyToOne(() => SourceEntity, (source): ReleaseNoteEntity[] => source.release_notes, {
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'source_id' })
    source: SourceEntity;

    @Column({ type: 'varchar', length: 512 })
    title: string;

    @Column({ type: 'varchar', length: 2048, nullable: true })
    url: string | null;

    @Column({ type: 'varchar', length: 64, nullable: true })
    version: string | null;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'date', nullable: true })
    release_date: string | null;

    @Column({ type: 'longtext' })
    content: string;

    @Column({ type: 'char', length: 64 })
    content_hash: string;

    @CreateDateColumn({ type: 'datetime' })
    created_at: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updated_at: Date;
}
