import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { SubscriptionEntity, SubscriptionStatus } from './entities/subscription.entity';
import { SubscriptionTokenEntity } from './entities/subscription-token.entity';
import crypto from 'crypto';

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectRepository(SubscriptionEntity)
        private readonly subsRepo: Repository<SubscriptionEntity>,
        @InjectRepository(SubscriptionTokenEntity)
        private readonly tokensRepo: Repository<SubscriptionTokenEntity>,
    ) { }

    async subscribe(email: string, name?: string | null) {
        const sub = await this.subsRepo.save({
            email,
            name: name ?? null,
            status: SubscriptionStatus.PENDING,
        });

        const token = crypto.randomBytes(32).toString('hex');

        await this.tokensRepo.save({
            subscription_id: sub.id,
            token,
            expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
        });

        return { subscriptionId: sub.id, token };
    }

    async cleanupExpiredTokens() {
        return this.tokensRepo.delete({ expires_at: LessThan(new Date()) });
    }
}
