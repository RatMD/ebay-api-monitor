import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailOutboxEntity } from './entities/mail-outbox.entity';
import { NewsletterService } from './newsletter.service';
import { MailModule } from '../../infrastructure/mail/mail.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([MailOutboxEntity]),
        MailModule,
    ],
    providers: [NewsletterService],
    exports: [NewsletterService],
})
export class NewsletterModule { }
