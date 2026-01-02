import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { ReleaseNoteEntity } from '../../release-notes/entities/release-note.entity';

export enum SourceStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    ARCHIVED = 'archived',
    DELETED = 'deleted',
}

export enum SourceCategory {
    BUY = 'buy',
    DEVELOPER = 'developer',
    SELL = 'sell',
}

@Entity({ name: 'sources' })
@Index('index_sources_slug_unique', ['category', 'slug'], { unique: true })
@Index('index_sources_status', ['status'])
@Index('index_sources_category', ['category'])
export class SourceEntity {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: string;

    @Column({ type: 'enum', enum: SourceStatus, default: SourceStatus.ACTIVE })
    status: SourceStatus;

    @Column({ type: 'varchar', length: 191 })
    slug: string;

    @Column({ type: 'enum', enum: SourceCategory })
    category: SourceCategory;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'text', nullable: true })
    notes: string | null;

    @Column({ type: 'json', nullable: true })
    details: Record<string, unknown> | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    supported_version: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    latest_version: string | null;

    @Column({ type: 'varchar', length: 2048 })
    url: string;

    @Column({ type: 'varchar', length: 2048 })
    changelog_url: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    schedule: string | null;

    @Column({ type: 'datetime', nullable: true })
    last_crawled_at: Date | null;

    @CreateDateColumn({ type: 'datetime' })
    created_at: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'datetime', nullable: true })
    deleted_at: Date | null;

    @OneToMany(() => ReleaseNoteEntity, (note) => note.source)
    release_notes: ReleaseNoteEntity[];
}
