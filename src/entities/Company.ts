import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Address } from './Address';
import { Vehicle } from './Vehicle';

@Entity('company')
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  document: string;

  @Column()
  phone: string;

  @Column({ type: 'int' })
  car_parking_spaces: number;

  @Column({ type: 'int' })
  motorcycle_parking_spaces: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;

  // Relations
  @OneToMany(() => Vehicle, (vehicle) => vehicle.company)
  vehicles: Vehicle[];

  @OneToOne(() => Address, (address) => address.company)
  @JoinColumn()
  address: Address;
}
