import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Vehicle } from './Vehicle.entity';

@Entity({ name: 'parking' })
export class Parking extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: true, type: 'longtext' })
  observations?: string;

  @ApiProperty()
  @Column({ type: 'datetime' })
  started_at: Date;

  @ApiProperty({ nullable: true })
  @Column({ type: 'datetime', nullable: true })
  ended_at?: Date;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;

  // Relations
  @ManyToOne(() => Vehicle, (vehicle) => vehicle.id)
  vehicle: Vehicle;
}
