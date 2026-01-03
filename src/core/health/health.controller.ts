import { Controller, Get, HttpCode } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
    /**
     *
     * @param config
     */
    constructor(private readonly config: ConfigService) {}

    @Get()
    @HttpCode(200)
    check() {
        return {
            status: 'success',
            result: {
                name: this.config.get<string>('APP_NAME'),
                timestamp: new Date().toISOString(),
            }
        };
    }
}
