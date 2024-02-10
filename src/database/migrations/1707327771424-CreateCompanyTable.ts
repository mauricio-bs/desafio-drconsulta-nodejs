import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCompanyTable1707327771424 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'company',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '191',
            isPrimary: true,
            isNullable: false,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '191',
            isNullable: false,
          },
          {
            name: 'document',
            type: 'varchar',
            length: '191',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '191',
            isNullable: false,
          },
          {
            name: 'car_parking_spaces',
            type: 'integer',
            isNullable: false,
            default: '0',
          },
          {
            name: 'motorcycle_parking_spaces',
            type: 'integer',
            isNullable: false,
            default: '0',
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
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('compayn', true);
  }
}
