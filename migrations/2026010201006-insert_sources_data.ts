import {
    MigrationInterface,
    QueryRunner,
} from 'typeorm';

export class InsertSourcesData2026010201006 implements MigrationInterface {
    apis = [
        ["browse-api", "buy", "Browse API", "https://developer.ebay.com/api-docs/buy/browse/overview.html", "https://developer.ebay.com/api-docs/buy/browse/release-notes.html"],
        ["catalog-api", "buy", "Catalog API", "https://developer.ebay.com/api-docs/sell/catalog/overview.html", "https://developer.ebay.com/api-docs/sell/catalog/release-notes.html"],
        ["deal-api", "buy", "Deal API", "https://developer.ebay.com/api-docs/buy/deal/overview.html", "https://developer.ebay.com/api-docs/buy/deal/release-notes.html"],
        ["feed-api", "buy", "Feed API", "https://developer.ebay.com/api-docs/buy/feed/v1/overview.html", "https://developer.ebay.com/api-docs/buy/feed/v1/release-notes.html"],
        ["feed-beta-api", "buy", "Feed Beta API", "https://developer.ebay.com/api-docs/buy/feed/overview.html", "https://developer.ebay.com/api-docs/buy/feed/release-notes.html"],
        ["identity-api", "buy", "Identity API", "https://developer.ebay.com/api-docs/sell/identity/overview.html", "https://developer.ebay.com/api-docs/sell/identity/release-notes.html"],
        ["marketing-api", "buy", "Marketing API", "https://developer.ebay.com/api-docs/buy/marketing/v1/overview.html", "https://developer.ebay.com/api-docs/buy/marketing/v1/release-notes.html"],
        ["marketing-beta-api", "buy", "Marketing Beta API", "https://developer.ebay.com/api-docs/buy/marketing/overview.html", "https://developer.ebay.com/api-docs/buy/marketing/release-notes.html"],
        ["offer-api", "buy", "Offer API", "https://developer.ebay.com/api-docs/buy/offer/overview.html", "https://developer.ebay.com/api-docs/buy/offer/release-notes.html"],
        ["order-api", "buy", "Order API", "https://developer.ebay.com/api-docs/buy/order/release-notes.html"],
        ["taxonomy-api", "buy", "Taxonomy API", "https://developer.ebay.com/api-docs/buy/order/overview.html", "https://developer.ebay.com/api-docs/sell/taxonomy/release-notes.html"],
        ["translation-api", "buy", "Translation API", "https://developer.ebay.com/api-docs/sell/translation/overview.html", "https://developer.ebay.com/api-docs/sell/translation/release-notes.html"],
        ["analytics-api", "developer", "Analytics API", "https://developer.ebay.com/api-docs/developer/analytics/overview.html", "https://developer.ebay.com/api-docs/developer/analytics/release-notes.html"],
        ["client-registration-api", "developer", "Client Registration API", "https://developer.ebay.com/api-docs/developer/client-registration/overview.html", "https://developer.ebay.com/api-docs/developer/client-registration/release-notes.html"],
        ["key-management-api", "developer", "Key Management API", "https://developer.ebay.com/api-docs/developer/key-management/overview.html", "https://developer.ebay.com/api-docs/developer/key-management/release-notes.html"],
        ["account-api", "sell", "Account API", "https://developer.ebay.com/api-docs/sell/account/overview.html", "https://developer.ebay.com/api-docs/sell/account/release-notes.html"],
        ["account-api-v2", "sell", "Account API (v2)", "https://developer.ebay.com/api-docs/sell/account/v2/overview.html", "https://developer.ebay.com/api-docs/sell/account/v2/release-notes.html"],
        ["analytics-api", "sell", "Analytics API", "https://developer.ebay.com/api-docs/sell/analytics/overview.html", "https://developer.ebay.com/api-docs/sell/analytics/release-notes.html"],
        ["catalog-api", "sell", "Catalog API", "https://developer.ebay.com/api-docs/sell/catalog/overview.html", "https://developer.ebay.com/api-docs/sell/catalog/release-notes.html"],
        ["compliance-api", "sell", "Compliance API", "https://developer.ebay.com/api-docs/sell/compliance/overview.html", "https://developer.ebay.com/api-docs/sell/compliance/release-notes.html"],
        ["feed-api", "sell", "Feed API", "https://developer.ebay.com/api-docs/sell/feed/overview.html", "https://developer.ebay.com/api-docs/sell/feed/release-notes.html"],
        ["feedback-api", "sell", "Feedback API", "https://developer.ebay.com/api-docs/commerce/feedback/overview.html", "https://developer.ebay.com/api-docs/commerce/feedback/release-notes.html"],
        ["finances-api", "sell", "Finances API", "https://developer.ebay.com/api-docs/sell/finances/overview.html", "https://developer.ebay.com/api-docs/sell/finances/release-notes.html"],
        ["fulfillment-api", "sell", "Fulfillment API", "https://developer.ebay.com/api-docs/sell/fulfillment/overview.html", "https://developer.ebay.com/api-docs/sell/fulfillment/release-notes.html"],
        ["identity-api", "sell", "Identity API", "https://developer.ebay.com/api-docs/sell/identity/overview.html", "https://developer.ebay.com/api-docs/sell/identity/release-notes.html"],
        ["inventory-api", "sell", "Inventory API", "https://developer.ebay.com/api-docs/sell/inventory/overview.html", "https://developer.ebay.com/api-docs/sell/inventory/release-notes.html"],
        ["leads-api", "sell", "Leads API", "https://developer.ebay.com/api-docs/sell/leads/overview.html", "https://developer.ebay.com/api-docs/sell/leads/release-notes.html"],
        ["marketing-api", "sell", "Marketing API", "https://developer.ebay.com/api-docs/sell/marketing/overview.html", "https://developer.ebay.com/api-docs/sell/marketing/release-notes.html"],
        ["media-api", "sell", "Media API", "https://developer.ebay.com/api-docs/commerce/media/overview.html", "https://developer.ebay.com/api-docs/commerce/media/release-notes.html"],
        ["message-api", "sell", "Message API", "https://developer.ebay.com/api-docs/commerce/message/overview.html", "https://developer.ebay.com/api-docs/commerce/message/release-notes.html"],
        ["metadata-api", "sell", "Metadata API", "https://developer.ebay.com/api-docs/sell/metadata/overview.html", "https://developer.ebay.com/api-docs/sell/metadata/release-notes.html"],
        ["negotiation-api", "sell", "Negotiation API", "https://developer.ebay.com/api-docs/sell/negotiation/overview.html", "https://developer.ebay.com/api-docs/sell/negotiation/release-notes.html"],
        ["notification-api", "sell", "Notification API", "https://developer.ebay.com/api-docs/sell/notification/overview.html", "https://developer.ebay.com/api-docs/sell/notification/release-notes.html"],
        ["recommendation-api", "sell", "Recommendation API", "https://developer.ebay.com/api-docs/sell/recommendation/overview.html", "https://developer.ebay.com/api-docs/sell/recommendation/release-notes.html"],
        ["stores-api", "sell", "Stores API", "https://developer.ebay.com/api-docs/sell/stores/overview.html", "https://developer.ebay.com/api-docs/sell/stores/release-notes.html"],
        ["taxonomy-api", "sell", "Taxonomy API", "https://developer.ebay.com/api-docs/sell/taxonomy/overview.html", "https://developer.ebay.com/api-docs/sell/taxonomy/release-notes.html"],
        ["translation-api", "sell", "Translation API", "https://developer.ebay.com/api-docs/sell/translation/overview.html", "https://developer.ebay.com/api-docs/sell/translation/release-notes.html"],
    ];

    /**
     * Install migration
     * @param queryRunner
     */
    async up(queryRunner: QueryRunner): Promise<void> {
        const values: string[] = this.apis.map(api => {
            return `('active', '${api[0]}', '${api[1]}', '${api[2]}', '${api[3]}', '${api[4]}', '0 */6 * * *', NOW(), NOW())`
        });
        await queryRunner.query(`
            INSERT INTO sources 
                (status, slug, category, title, url, changelog_url, schedule, created_at, updated_at)
            VALUES
                ${values.join(', ')};
        `);
    }

    /**
     * Uninstall migration
     * @param queryRunner
     */
    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM sources WHERE 1=1;`);
    }
}
