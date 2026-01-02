import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Feed } from 'feed';

export interface FeedAuthor {
    name?: string;
    email?: string;
    link?: string;
}

export interface FeedObject {
    url: string;
    title: string;
    description: string;
    id?: string;
    link?: string;
    language?: string;
    image?: string;
    favicon?: string;
    copyright?: string;
    updated?: Date;
    generator?: string;
    feedLinks?: { [key: string]: string };
    author?: FeedAuthor;
}

export interface FeedItem {
    url: string;
    title: string;
    description: string;
    id?: string;
    content?: string;
    date?: Date;
    image?: string;
    author?: FeedAuthor | FeedAuthor[];
    contributor?: FeedAuthor | FeedAuthor[];
}

export type FeedFormats = 'atom' | 'json' | 'rss';

@Injectable()
export class FeedService {
    /**
     *
     * @param config
     */
    constructor(private readonly config: ConfigService) {}

    /**
     *
     * @param data
     * @param items
     * @param format
     * @returns
     */
    createFeed(
        data: FeedObject,
        items: FeedItem[],
        format: FeedFormats = 'rss',
    ): string {
        const feed = new Feed({
            title: data.title,
            description: data.description,
            id: data?.id || data.url,
            link: data?.link || data.url,
            language: data?.language || 'en',
            image: data?.image || void 0,
            favicon: data?.favicon || void 0,
            copyright: data?.copyright || `Copyright © ${this.config.get<string>('APP_NAME')}`,
            updated: data?.updated || new Date(),
            generator: data?.generator || 'NestJS / rat.md (using feed for Node.JS)',
            feedLinks: data?.feedLinks || void 0,
            author: data?.author || void 0,
        });

        items.forEach((item) => {
            let author = item?.author || data.author;
            if (author && !Array.isArray(author)) {
                author = [author];
            }

            let contributor = item?.contributor || [];
            if (contributor && !Array.isArray(contributor)) {
                contributor = [contributor];
            }

            feed.addItem({
                title: item.title,
                description: item.description,
                content: item?.content || item.description,
                id: item?.id || item.url,
                link: item.url,
                date: item?.date || new Date(),
                image: item?.image || void 0,
                author: author,
                contributor: contributor,
            });
        });

        if (format == 'atom') {
            return feed.atom1();
        } else if (format == 'json') {
            return feed.json1();
        } else {
            return feed.rss2();
        }
    }
}
