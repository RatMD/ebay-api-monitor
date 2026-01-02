import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from '../../infrastructure/mail/mail.service';
import { MailOutboxEntity, MailOutboxStatus, MailOutboxType } from './entities/mail-outbox.entity';

@Injectable()
export class NewsletterService {
    constructor(
        @InjectRepository(MailOutboxEntity)
        private readonly outboxRepo: Repository<MailOutboxEntity>,
        private readonly mail: MailService,
    ) { }

    async queueConfirmationMail(to: string, payload: Record<string, unknown>) {
        return this.outboxRepo.save({
            type: MailOutboxType.CONFIRMATION,
            status: MailOutboxStatus.PENDING,
            payload: { to, ...payload },
            attempts: 0,
        });
    }

    async sendOutboxEntry(entry: MailOutboxEntity) {
        const to = String((entry.payload['to'] ?? '') as string);
        await this.mail.sendMail(
            to,
            entry.type === MailOutboxType.CONFIRMATION ? 'Confirm your subscription' : 'Newsletter',
            JSON.stringify(entry.payload, null, 2),
        );

        entry.status = MailOutboxStatus.SENT;
        entry.sent_at = new Date();
        await this.outboxRepo.save(entry);
    }
}
