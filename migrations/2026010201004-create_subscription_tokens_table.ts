import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
    TableIndex,
} from 'typeorm';

export class CreateSubscriptionTokensTable2026010201004 implements MigrationInterface {
    /**
     * Install migration
     * @param queryRunner
     */
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'subscription_tokens',
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
                        name: 'subscription_id',
                        type: 'bigint',
                        unsigned: true,
                        isNullable: false,
                    },
                    {
                        name: 'type',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'token',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'expires_at',
                        type: 'datetime',
                        isNullable: true,
                    },
                ],
                indices: [
                    new TableIndex({
                        name: 'index_subscription_tokens_subscription_id',
                        columnNames: ['subscription_id'],
                    }),
                    new TableIndex({
                        name: 'index_subscription_tokens_token',
                        columnNames: ['token'],
                    }),
                    new TableIndex({
                        name: 'index_subscription_tokens_expires_at',
                        columnNames: ['expires_at'],
                    }),
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'subscription_tokens',
            new TableForeignKey({
                name: 'foreign_key_subscription_tokens_subscription',
                columnNames: ['subscription_id'],
                referencedTableName: 'subscriptions',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }),
        );
    }

    /**
     * Uninstall migration
     * @param queryRunner
     */
    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('subscription_tokens', true, true, true);
    }
}
