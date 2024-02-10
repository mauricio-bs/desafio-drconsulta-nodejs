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

import { Company } from './Company';
import { Parking } from './Parking';

@Entity({ name: 'vehicle' })
export class Vehicle extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  brand: string;

  @Column()
  color: string;

  @Column({ type: 'enum', enum: EVehicleType })
  type: EVehicleType;

  @Column()
  licence_plate: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;

  // Relations
  @OneToMany(() => Parking, (parking) => parking.vehicle)
  parkings: Parking[];

  @ManyToOne(() => Company, (company) => company.vehicles)
  company: Company;
}
