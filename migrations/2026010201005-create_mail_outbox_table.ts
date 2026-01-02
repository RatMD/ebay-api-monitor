import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableIndex,
} from 'typeorm';

export class CreateMailOutboxTable2026010201005 implements MigrationInterface {
    /**
     * Install migration
     * @param queryRunner
     */
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'mail_outbox',
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
                        name: 'type',
                        type: 'varchar',
                        length: '64',
                        isNullable: false,
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        length: '64',
                        default: "'pending'",
                        isNullable: false,
                    },
                    {
                        name: 'payload',
                        type: 'json',
                        isNullable: false,
                    },
                    {
                        name: 'attempts',
                        type: 'int',
                        unsigned: true,
                        default: 0,
                    },
                    {
                        name: 'last_error',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'last_error_at',
                        type: 'datetime',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'sent_at',
                        type: 'datetime',
                        isNullable: true,
                    },
                ],
                indices: [
                    new TableIndex({
                        name: 'index_mail_outbox_status',
                        columnNames: ['status'],
                    }),
                    new TableIndex({
                        name: 'index_mail_outbox_type',
                        columnNames: ['type'],
                    }),
                    new TableIndex({
                        name: 'index_mail_outbox_created_at',
                        columnNames: ['created_at'],
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
        await queryRunner.dropTable('mail_outbox', true, true, true);
    }
}
