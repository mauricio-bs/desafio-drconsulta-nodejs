import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateVehicle1707523611043 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'vehicle',
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
            name: 'brand',
            type: 'varchar',
            length: '191',
            isNullable: false,
          },
          {
            name: 'color',
            type: 'varchar',
            length: '191',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['car', 'motorcycle'],
            isNullable: false,
          },
          {
            name: 'license_plate',
            type: 'varchar',
            length: '191',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'datetime',
            precision: 3,
            default: 'CURRENT_TIMESTAMP(3)',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'datetime',
            precision: 3,
            isNullable: false,
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
      'vehicle',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedTableName: 'company',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('vehicle', true);
  }
}
