import { Module } from '@nestjs/common';
import { ConfigModule } from './core/config/config.module';
import { DatabaseModule } from './core/database/database.module';
import { LoggerModule } from './core/logger/logger.module';
import { HealthModule } from './core/health/health.module';
import { FeedModule } from './infrastructure/feed/feed.module';
import { MailModule } from './infrastructure/mail/mail.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { HttpModule } from './infrastructure/http/http.module';
import { SourcesModule } from './modules/sources/sources.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { CrawlerModule } from './modules/crawler/crawler.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ReleaseNotesModule } from './modules/release-notes/release-notes.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
        CacheModule.register({
            isGlobal: true,
            ttl: 60 * 30,
            max: 1_000
        }),
        ScheduleModule.forRoot(),
        
        ConfigModule,
        DatabaseModule,
        LoggerModule,
        HealthModule,
        
        FeedModule,
        HttpModule,
        MailModule,
        QueueModule,

        CrawlerModule,
        SourcesModule,
        ReleaseNotesModule,
        SubscriptionsModule,
        NewsletterModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
