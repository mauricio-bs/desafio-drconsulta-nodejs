import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateAddress1707523449545 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'address',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '191',
            isPrimary: true,
            isNullable: false,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'country',
            type: 'varchar',
            length: '191',
            isNullable: false,
          },
          {
            name: 'state',
            type: 'varchar',
            length: '191',
            isNullable: false,
          },
          {
            name: 'city',
            type: 'varchar',
            length: '191',
            isNullable: false,
          },
          {
            name: 'address',
            type: 'varchar',
            length: '191',
            isNullable: false,
          },
          {
            name: 'number',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'complements',
            type: 'varchar',
            length: '191',
            isNullable: true,
          },
          {
            name: 'zipcode',
            type: 'varchar',
            length: '191',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'datetime',
            precision: 3,
            isNullable: false,
            default: 'CURRENT_TIMESTAMP(3)',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            precision: 3,
            isNullable: false,
            default: 'CURRENT_TIMESTAMP(3)',
          },
          {
            name: 'deleted_at',
            type: 'datetime',
            precision: 3,
            isNullable: true,
          },
          {
            name: 'company_id',
            type: 'varchar',
            length: '191',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'address',
      new TableForeignKey({
        name: 'address_company_id_key',
        columnNames: ['company_id'],
        referencedTableName: 'company',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('address', 'address_company_id_foreign');
    await queryRunner.dropTable('address', true);
  }
}
