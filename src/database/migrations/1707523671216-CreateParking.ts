import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateParking1707523671216 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'parking',
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
            name: 'observations',
            type: 'varchar',
            length: '191',
            isNullable: true,
          },
          {
            name: 'started_at',
            type: 'datetime',
            precision: 3,
            isNullable: false,
          },
          {
            name: 'ended_at',
            type: 'datetime',
            precision: 3,
            isNullable: true,
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
            name: 'vehicle_id',
            type: 'varchar',
            length: '191',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'parking',
      new TableForeignKey({
        name: 'parking_vehicle_id_fkey',
        columnNames: ['vehicle_id'],
        referencedTableName: 'vehicle',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('parking', true);
  }
}
