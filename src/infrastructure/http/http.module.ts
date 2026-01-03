import { Module } from '@nestjs/common';
import { HttpModule as NestHttpModule } from '@nestjs/axios';

@Module({
    imports: [
        NestHttpModule.register({
            global: true,
            timeout: 15000,
            maxRedirects: 5,
            headers: { 'User-Agent': 'ebay-api-monitor' },
        }),
    ],
    exports: [NestHttpModule],
})
export class HttpModule {}
