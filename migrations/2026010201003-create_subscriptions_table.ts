import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableIndex,
} from 'typeorm';

export class CreateSubscriptionsTable2026010201003 implements MigrationInterface {
    /**
     * Install migration
     * @param queryRunner
     */
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'subscriptions',
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                        unsigned: true,
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        length: '64',
                        default: "'pending'",
                        isNullable: false,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        length: '320',
                        isNullable: false,
                    },
                    {
                        name: 'scopes',
                        type: 'json',
                        isNullable: true,
                    },
                    {
                        name: 'verified_at',
                        type: 'datetime',
                        isNullable: true,
                    },
                    {
                        name: 'subscribed_at',
                        type: 'datetime',
                        isNullable: true,
                    },
                    {
                        name: 'unsubscribed_at',
                        type: 'datetime',
                        isNullable: true,
                    },
                ],
                indices: [
                    new TableIndex({
                        name: 'index_subscriptions_email_unique',
                        columnNames: ['email'],
                        isUnique: true,
                    }),
                    new TableIndex({
                        name: 'index_subscriptions_status',
                        columnNames: ['status'],
                    }),
                ],
            }),
            true,
        );
    }

    /**
     * Uninstall migration
     * @param queryRunner
     */
    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('subscriptions', true, true, true);
    }
}
