import type { FastifyReply, FastifyRequest } from 'fastify';
import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';

interface ConfirmNewsletterQuery {
  email?: string;
  token?: string;
}

interface UnsubscribeNewsletterQuery {
  email?: string;
}

@Controller('api/newsletter')
export class SubscriptionsController {
    /**
     *
     * @param subs
     */
    constructor(private readonly subs: SubscriptionsService) { }

    /**
     * Subscribe
     * @param res
     * @param body
     * @returns
     */
    @Post('subscribe')
    async subscribe(@Res() res: FastifyReply, @Body() body: { email: string; name?: string }) {
        const response = await this.subs.subscribe(body.email, body.name);
        return res.code(response[0]).send(response[1]);
    }

    /**
     * Confirm eMail Subscription
     * @param res
     * @param req
     * @returns
     */
    @Get('confirm')
    async confirm(
        @Res() res: FastifyReply, 
        @Req() req: FastifyRequest<{ Querystring: ConfirmNewsletterQuery }>
    ) {
        const response = await this.subs.confirm(req.query.email || '', req.query.token || '');
        return res.code(response[0]).send(response[1]);
    }

    /**
     * Unsubscribe
     * @param res
     * @param req
     * @returns
     */
    @Get('unsubscribe')
    async unsubscribe(
        @Res() res: FastifyReply, 
        @Req() req: FastifyRequest<{ Querystring: UnsubscribeNewsletterQuery }>
    ) {
        const response = await this.subs.unsubscribe(req.query.email || '');
        return res.code(response[0]).send(response[1]);
    }
}
