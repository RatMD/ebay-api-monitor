import {
    Column,
    Entity,
    Index,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { SubscriptionTokenEntity } from './subscription-token.entity';

export enum SubscriptionStatus {
    PENDING = 'pending',
    SUBSCRIBED = 'subscribed',
    UNSUBSCRIBED = 'unsubscribed',
}

@Entity({ name: 'subscriptions' })
@Index('index_subscriptions_email_unique', ['email'], { unique: true })
@Index('index_subscriptions_status', ['status'])
export class SubscriptionEntity {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: string;

    @Column({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.PENDING })
    status: SubscriptionStatus;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string | null;

    @Column({ type: 'varchar', length: 320 })
    email: string;

    @Column({ type: 'json', nullable: true })
    scopes: unknown[] | Record<string, unknown> | null;

    @Column({ type: 'datetime', nullable: true })
    verified_at: Date | null;

    @Column({ type: 'datetime', nullable: true })
    subscribed_at: Date | null;

    @Column({ type: 'datetime', nullable: true })
    unsubscribed_at: Date | null;

    @OneToOne(() => SubscriptionTokenEntity, (token): SubscriptionEntity => token.subscription)
    token: SubscriptionTokenEntity;
}
