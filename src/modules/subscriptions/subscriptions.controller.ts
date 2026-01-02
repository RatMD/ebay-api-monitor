import { Body, Controller, Post } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
    constructor(private readonly subs: SubscriptionsService) { }

    @Post('subscribe')
    subscribe(@Body() body: { email: string; name?: string }) {
        return this.subs.subscribe(body.email, body.name);
    }
}
