import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { EVehicleType } from '@enum/EVehicleType';

import { Company } from './Company.entity';
import { Parking } from './Parking.entity';

@Entity({ name: 'vehicle' })
export class Vehicle extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  brand: string;

  @ApiProperty()
  @Column()
  color: string;

  @ApiProperty({ enum: EVehicleType })
  @Column({ type: 'enum', enum: EVehicleType })
  type: EVehicleType;

  @ApiProperty()
  @Column()
  licence_plate: string;

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

  @OneToMany(() => Parking, (parking) => parking.vehicle)
  parkings: Parking[];

  @ManyToOne(() => Company, (company) => company.vehicles)
  company: Company;
}
