import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
    TableIndex,
} from 'typeorm';

export class CreateReleaseNotesTable2026010201002 implements MigrationInterface {
    /**
     * Install migration
     * @param queryRunner
     */
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'release_notes',
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
                        name: 'source_id',
                        type: 'bigint',
                        unsigned: true,
                        isNullable: false,
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'url',
                        type: 'varchar',
                        length: '2048',
                        isNullable: true,
                    },
                    {
                        name: 'version',
                        type: 'varchar',
                        length: '64',
                        isNullable: true,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'release_date',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'content',
                        type: 'longtext',
                        isNullable: false,
                    },
                    {
                        name: 'content_hash',
                        type: 'varchar',
                        length: '128',
                        isNullable: false,
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
                ],
                indices: [
                    new TableIndex({
                        name: 'index_release_notes_source_id',
                        columnNames: ['source_id'],
                    }),
                    new TableIndex({
                        name: 'index_release_notes_release_date',
                        columnNames: ['release_date'],
                    }),
                    new TableIndex({
                        name: 'index_release_notes_content_hash',
                        columnNames: ['content_hash'],
                    }),
                    new TableIndex({
                        name: 'index_release_notes_source_hash_unique',
                        columnNames: ['source_id', 'content_hash'],
                        isUnique: true,
                    }),
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'release_notes',
            new TableForeignKey({
                name: 'foreign_key_release_notes_source',
                columnNames: ['source_id'],
                referencedTableName: 'sources',
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
        await queryRunner.dropTable('release_notes', true, true, true);
    }
}
