import crypto from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionEntity, SubscriptionStatus } from './entities/subscription.entity';
import { SubscriptionTokenEntity, SubscriptionTokenType } from './entities/subscription-token.entity';
import { ConfigService } from '@nestjs/config';

/**
 *
 * @param a
 * @param b
 * @returns
 */
function equals(a: string, b: string): boolean {
    if (a.length !== 64 || 64 !== b.length) {
        return false;
    }
    if (!/^[0-9a-f]+$/i.test(a) || !/^[0-9a-f]+$/i.test(b)) {
        return false;
    }

    const bufA = Buffer.from(a, 'hex');
    const bufB = Buffer.from(b, 'hex');
    return crypto.timingSafeEqual(bufA, bufB);
}

@Injectable()
export class SubscriptionsService {
    /**
     *
     * @param config
     * @param subsRepo
     * @param tokensRepo
     */
    constructor(
        private readonly config: ConfigService,
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
            where: { email },
        });

        if (sub !== null) {
            if (sub.status === SubscriptionStatus.PENDING) {
                return [400, 'Subscription is still pending.'];
            } else if (sub.status === SubscriptionStatus.SUBSCRIBED) {
                return [400, 'Subscription already exists.'];
            }

            await this.subsRepo.update({ email }, {
                name: name ?? null,
                status: SubscriptionStatus.PENDING,
                subscribed_at: new Date(),
            });
            await this.tokensRepo.delete({ subscription_id: sub.id });
        } else {
            const value = email.trim().toLowerCase();
            const hash = crypto
                .createHmac('sha256', this.config.get<string>('APP_KEY') as string)
                .update(value)
                .digest('hex');
            sub = await this.subsRepo.save({
                email,
                hash,
                name: name ?? null,
                status: SubscriptionStatus.PENDING,
                subscribed_at: new Date(),
            });
        }

        await this.tokensRepo.save({
            subscription_id: sub.id,
            type: SubscriptionTokenType.CONFIRM,
            token: crypto.randomBytes(32).toString('hex'),
            expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
        });

        return [200, 'Subscription created successfully.'];
    }

    /**
     *
     * @param hash
     * @param compareToken
     * @returns
     */
    async confirm(hash: string, compareToken: string): Promise<[number, string]> {
        const sub = await this.subsRepo.findOne({
            where: { hash }
        });
        if (sub === null) {
            return [404, 'Email address not found.'];
        }

        const token = await this.tokensRepo.findOne({
            where: { 
                subscription_id: sub.id, 
                type: SubscriptionTokenType.CONFIRM 
            },
            order: { id: 'DESC' },
        });
        if (token === null || token.expires_at === null || token.expires_at < new Date()) {
            await this.tokensRepo.delete({ subscription_id: sub.id });
            await this.subsRepo.delete({ id: sub.id });
            return [403, 'Subscription token has expired. Please subscribe again.'];
        }
        if (!equals(token.token, compareToken)) {
            return [403, 'Invalid subscription token.'];
        }

        await this.subsRepo.update(
            { id: sub.id }, 
            { 
                status: SubscriptionStatus.SUBSCRIBED, 
                verified_at: new Date()
            }
        );
        await this.tokensRepo.delete({ subscription_id: sub.id });
        await this.tokensRepo.save({
            subscription_id: sub.id,
            type: SubscriptionTokenType.UNSUBSCRIBE,
            token: crypto.randomBytes(32).toString('hex'),
            expires_at: null,
        });

        return [200, 'Subscription confirmed successfully.'];
    }

    /**
     *
     * @param hash
     * @param compareToken
     * @returns
     */
    async unsubscribe(hash: string, compareToken: string): Promise<[number, string]> {
        const sub = await this.subsRepo.findOne({
            where: { hash }
        });
        if (sub === null) {
            return [404, 'Email address not found.'];
        }

        const token = await this.tokensRepo.findOne({
            where: { 
                subscription_id: sub.id, 
                type: SubscriptionTokenType.UNSUBSCRIBE 
            },
            order: { id: 'DESC' },
        });
        if (token === null || !equals(token.token, compareToken)) {
            return [403, 'Unsubscribe link seems invalid.'];
        }

        await this.subsRepo.update({
            id: sub.id,
        }, {
            status: SubscriptionStatus.UNSUBSCRIBED,
            unsubscribed_at: new Date,
        });
        await this.tokensRepo.delete({ subscription_id: sub.id });

        return [200, 'Subscription revoked successfully.'];
    }
}
