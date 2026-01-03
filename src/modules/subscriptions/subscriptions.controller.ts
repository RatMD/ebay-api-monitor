import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';

interface SubscribeNewsletterBody {
    email: string;
    name?: string;
}

interface ConfirmNewsletterQuery {
    id?: string;
    token?: string;
}

interface UnsubscribeNewsletterQuery {
    id?: string;
    token?: string;
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
    async subscribe(
        @Res() res: FastifyReply,
        @Req() req: FastifyRequest<{ Body: SubscribeNewsletterBody }>,
    ) {
        const response = await this.subs.subscribe(req.body.email || '', req.body.name || '');
        return res.code(response[0]).send({
            status: response[0] === 200 ? 'success' : 'error',
            [response[0] === 200 ? 'result' : 'message']: response[1],
        });
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
        const response = await this.subs.confirm(req.query.id || '', req.query.token || '');
        return res.code(response[0]).send({
            status: response[0] === 200 ? 'success' : 'error',
            message: response[1],
        });
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
        const response = await this.subs.unsubscribe(req.query.id || '', req.query.token || '');
        return res.code(response[0]).send({
            status: response[0] === 200 ? 'success' : 'error',
            message: response[1],
        });
    }
}
