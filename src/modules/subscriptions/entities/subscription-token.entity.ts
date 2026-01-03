import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { SubscriptionEntity } from './subscription.entity';

export enum SubscriptionTokenType {
    CONFIRM = 'confirm',
    UNSUBSCRIBE = 'unsubscribe',
}

@Entity({ name: 'subscription_tokens' })
@Index('index_subscription_tokens_subscription_id', ['subscription_id'])
@Index('index_subscription_tokens_token', ['token'])
@Index('index_subscription_tokens_expires_at', ['expires_at'])
export class SubscriptionTokenEntity {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: string;

    @Column({ type: 'bigint', unsigned: true })
    subscription_id: string;

    @Column({ type: 'enum', enum: SubscriptionTokenType, default: SubscriptionTokenType.CONFIRM })
    type: SubscriptionTokenType;

    @Column({ type: 'varchar', length: 255 })
    token: string;

    @CreateDateColumn({ type: 'datetime' })
    created_at: Date;

    @Column({ type: 'datetime', nullable: true })
    expires_at: Date | null;

    @ManyToOne(() => SubscriptionEntity, (sub): SubscriptionTokenEntity => sub.token, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'subscription_id' })
    subscription: SubscriptionEntity;
}
