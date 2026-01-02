import crypto from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { SubscriptionEntity, SubscriptionStatus } from './entities/subscription.entity';
import { SubscriptionTokenEntity } from './entities/subscription-token.entity';

function equals(a: string, b: string): boolean {
    if (a.length !== b.length) {
        return false;
    }
    if (!/^[0-9a-f]+$/i.test(a) || !/^[0-9a-f]+$/i.test(b)) {
        return false;
    }

    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
        return false;
    } else {
        return crypto.timingSafeEqual(bufA, bufB);
    }
}

@Injectable()
export class SubscriptionsService {
    /**
     *
     * @param subsRepo
     * @param tokensRepo
     */
    constructor(
        @InjectRepository(SubscriptionEntity)
        private readonly subsRepo: Repository<SubscriptionEntity>,
        @InjectRepository(SubscriptionTokenEntity)
        private readonly tokensRepo: Repository<SubscriptionTokenEntity>,
    ) { }

    /**
     *
     * @param email
     * @param name
     * @returns
     */
    async subscribe(email: string, name?: string | null): Promise<[number, string]> {
        let sub = await this.subsRepo.findOne({
            where: { email }
        });

        if (sub !== null) {
            if (sub.status === SubscriptionStatus.PENDING) {
                return [400, 'Subscription is still pending.'];
            } else if (sub.status === SubscriptionStatus.SUBSCRIBED) {
                return [400, 'Subscription already exists.'];
            } else {
                await this.subsRepo.update({ email }, {
                    name: name ?? null,
                    status: SubscriptionStatus.PENDING,
                });
            }
        } else {
            sub = await this.subsRepo.save({
                email,
                name: name ?? null,
                status: SubscriptionStatus.PENDING,
            });
        }

        const token = crypto.randomBytes(32).toString('hex');
        await this.tokensRepo.save({
            subscription_id: sub.id,
            token,
            expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
        });

        return [200, 'Subscription created successfully.'];
    }

    /**
     *
     * @param email
     * @param token
     * @returns
     */
    async confirm(email: string, token: string): Promise<[number, string]> {
        const sub = await this.subsRepo.findOne({
            where: { email }
        });
        if (sub === null) {
            return [404, 'Email address not found.'];
        }
        if (sub.token.expires_at < new Date()) {
            await this.tokensRepo.delete({ token: sub.token.token });
            await this.subsRepo.delete({ email });
            return [403, 'Subscription token has expired. Please subscribe again.'];
        }
        if (!equals(sub.token.token, token)) {
            return [403, 'Invalid subscription token.'];
        }

        await this.subsRepo.update(
            { id: sub.id }, 
            { status: SubscriptionStatus.SUBSCRIBED }
        );
        return [200, 'Subscription confirmed successfully.'];
    }

    /**
     *
     * @param email
     * @returns
     */
    async unsubscribe(email: string): Promise<[number, string]> {
        const sub = await this.subsRepo.findOne({
            where: { email }
        });
        if (sub === null) {
            return [404, 'Email address not found.'];
        }

        await this.subsRepo.update({
            id: sub.id
        }, {
            status: SubscriptionStatus.UNSUBSCRIBED
        });
        return [200, 'Subscription revoked successfully.'];
    }

    /**
     *
     * @returns
     */
    async cleanupExpiredTokens() {
        return this.tokensRepo.delete({ expires_at: LessThan(new Date()) });
    }
}
