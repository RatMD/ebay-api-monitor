import crypto from 'node:crypto';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { firstValueFrom } from 'rxjs';
import { SourcesService } from '../sources/sources.service';
import { ReleaseNotesService } from '../release-notes/release-notes.service';
import { SourceEntity } from '../sources/entities/source.entity';

interface ParsedRelease {
    version: string;
    releaseDate: string;
    description: string | null;
    content: string;
}

@Injectable()
export class CrawlerService {
    /**
     *
     */
    private readonly logger = new Logger(CrawlerService.name);

    /**
     *
     * @param sources
     * @param notes
     */
    constructor(
        private readonly sources: SourcesService,
        private readonly notes: ReleaseNotesService,
        private readonly http: HttpService,
    ) { }

    /**
     *
     * @returns
     */
    async pollAll() {
        const active = await this.sources.findActive();
        return { sources: active.length };
    }

    /**
     *
     * @returns
     */
    async pollDueSources() {
        const due = await this.sources.findDue(1);

        if (due.length === 0) {
            this.logger.debug('No sources due');
            return;
        }

        this.logger.log(`Polling ${due.length} due sources`);
        for (const source of due) {
            try {
                await this.sources.markStarted(source.id);
                await this.pollOne(source);
                await this.sources.scheduleNextRun(source.id, source.interval);
            } catch (err) {
                this.logger.error(`Failed source ${source.slug}`, err);
                await this.sources.scheduleRetry(source.id, 600);
            }
        }
    }

    /**
     *
     * @param source
     * @returns
     */
    private async pollOne(source: SourceEntity) {
        const response = await firstValueFrom(
            this.http.get(source.changelog_url, { responseType: 'text' })
        );
        const html = response.data as string;

        const $ = cheerio.load(html);
        const doc = $('.doc-content').first();
        if (!doc.length) {
            this.logger.warn(`.doc-content not found for ${source.slug}`);
            return;
        }

        const releases: Map<string, ParsedRelease> = new Map;

        // Fetch release table
        const table = doc.find('table').first();
        if (table.length) {
            table.find('tbody tr').each((_, tr) => {
                const tds = $(tr).find('td');
                const version = $(tds[0]).text().trim() || null;
                const releaseDate = $(tds[1]).text().trim();
                const description = $(tds[2]).text().trim() || null;

                if (version && releaseDate) {
                    releases.set(version, {
                        version,
                        releaseDate,
                        description,
                        content: '',
                    });
                }
            });
        }

        // Fetch release notes
        const h2s = doc.find('h2');
        h2s.each((_, h2) => {
            const version = $(h2).text().trim();
            if (!releases.has(version)) {
                return;
            }

            const chunkNodes = $(h2).nextUntil('h2').toArray();
            const chunkHtml = chunkNodes.map((n) => $.html(n)).join('\n').trim();
            (releases.get(version) as ParsedRelease).content = chunkHtml;
        });

        // Upsert with database
        for (const [version, release] of [...releases.entries()].reverse()) {
            await this.notes.upsertByVersion(source.id, {
                title: `${source.title} ${version}`,
                url: source.changelog_url,
                version,
                description: release.description,
                release_date: release.releaseDate,
                content: release.content,
                content_hash: crypto.createHash('sha256').update(release.content).digest('hex'),
            });
        }
    }
}
