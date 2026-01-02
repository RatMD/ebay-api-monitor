import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface MailAddress {
    name: string;
    mail: string;
}

export type MailAddressValue = string | MailAddress;

export type MailContentValue = string | { text: string, html?: string };

@Injectable()
export class MailService {
    /**
     *
     */
    private readonly logger = new Logger(MailService.name);

    /**
     *
     */
    private readonly transporter: nodemailer.Transporter;

    /**
     *
     * @param config
     */
    constructor(private readonly config: ConfigService) {
        const user = this.config.get<string>('SMTP_USER');
        const pass = this.config.get<string>('SMTP_PASSWORD');

        this.transporter = nodemailer.createTransport({
            host: this.config.get<string>('SMTP_HOST'),
            port: this.config.get<number>('SMTP_PORT', 587),
            secure: false,
            ...(user && pass ? { auth: { user, pass } } : {}),
        });
    }

    /**
     *
     * @param to
     * @param subject
     * @param content
     * @returns
     */
    async sendMail(
        to: MailAddressValue,
        subject: string,
        content: MailContentValue,
    ): Promise<any> {
        const address = typeof to == 'string' ? to : `${to.name} <${to.mail}>`;

        this.logger.log(`Sending mail to ${address}`);

        return this.transporter.sendMail({
            from: `${this.config.get<string>('SMTP_FROM_NAME')} <${this.config.get<string>('SMTP_FROM_MAIL')}>`,
            to: address,
            subject: subject,
            text: typeof content == 'string' ? content : content.text,
            html: typeof content == 'string' ? content : (content.html || content.text),
        });
    }
}
