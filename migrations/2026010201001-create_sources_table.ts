import { 
    MigrationInterface, 
    QueryRunner,
    Table,
    TableIndex,
} from 'typeorm';

export class CreateSourcesTable2026010201001 implements MigrationInterface {
    /**
     * Install migration
     * @param queryRunner
     */
    async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: 'sources',
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
                        default: "'active'",
                        isNullable: false,
                    },
                    {
                        name: 'slug',
                        type: 'varchar',
                        length: '150',
                        isNullable: false,
                    },
                    {
                        name: 'category',
                        type: 'varchar',
                        length: '64',
                        isNullable: false,
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'notes',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'details',
                        type: 'json',
                        isNullable: true,
                    },
                    {
                        name: 'supported_version',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'latest_version',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'url',
                        type: 'varchar',
                        length: '2048',
                        isNullable: false,
                    },
                    {
                        name: 'changelog_url',
                        type: 'varchar',
                        length: '2048',
                        isNullable: false,
                    },
                    {
                        name: 'interval',
                        type: 'int',
                        default: 21600,
                        isNullable: false,
                        unsigned: true
                    },
                    {
                        name: 'last_crawled_at',
                        type: 'datetime',
                        isNullable: true,
                    },
                    {
                        name: 'next_run_at',
                        type: 'datetime',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'deleted_at',
                        type: 'datetime',
                        isNullable: true,
                    },
                ],
                indices: [
                    new TableIndex({
                        name: 'index_sources_category_slug_unique',
                        columnNames: ['category', 'slug'],
                        isUnique: true,
                    }),
                    new TableIndex({
                        name: 'index_sources_status',
                        columnNames: ['status'],
                    }),
                    new TableIndex({
                        name: 'index_sources_category',
                        columnNames: ['category'],
                    }),
                    new TableIndex({
                        name: 'index_sources_next_run_at',
                        columnNames: ['next_run_at'],
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
        await queryRunner.dropTable('sources', true, true, true);
    }
}
