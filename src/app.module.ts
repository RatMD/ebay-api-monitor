import { Module } from '@nestjs/common';
import { ConfigModule } from './core/config/config.module';
import { DatabaseModule } from './core/database/database.module';
import { LoggerModule } from './core/logger/logger.module';
import { HealthModule } from './core/health/health.module';
import { FeedModule } from './infrastructure/feed/feed.module';
import { MailModule } from './infrastructure/mail/mail.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { HttpModule } from './infrastructure/http/http.module';

@Module({
    imports: [
        ConfigModule,
        DatabaseModule,
        LoggerModule,
        HealthModule,
        FeedModule,
        HttpModule,
        MailModule,
        QueueModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
