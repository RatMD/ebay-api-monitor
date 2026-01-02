import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
} from 'typeorm';

export enum MailOutboxType {
    CONFIRMATION = 'confirmation',
    NEWSLETTER = 'newsletter',
}

export enum MailOutboxStatus {
    PENDING = 'pending',
    SENT = 'sent',
    FAILED = 'failed',
}

@Entity({ name: 'mail_outbox' })
@Index('IDX_mail_outbox_status', ['status'])
@Index('IDX_mail_outbox_type', ['type'])
@Index('IDX_mail_outbox_created_at', ['created_at'])
export class MailOutboxEntity {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: string;

    @Column({ type: 'enum', enum: MailOutboxType })
    type: MailOutboxType;

    @Column({ type: 'enum', enum: MailOutboxStatus, default: MailOutboxStatus.PENDING })
    status: MailOutboxStatus;

    @Column({ type: 'json' })
    payload: Record<string, unknown>;

    @Column({ type: 'int', unsigned: true, default: 0 })
    attempts: number;

    @Column({ type: 'text', nullable: true })
    last_error: string | null;

    @Column({ type: 'datetime', nullable: true })
    last_error_at: Date | null;

    @CreateDateColumn({ type: 'datetime' })
    created_at: Date;

    @Column({ type: 'datetime', nullable: true })
    sent_at: Date | null;
}
