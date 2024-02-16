import { ApiProperty } from '@nestjs/swagger';
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

import { Address } from './Address.entity';
import { Vehicle } from './Vehicle.entity';

@Entity('company')
export class Company extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ uniqueItems: true })
  @Column({ unique: true })
  document: string;

  @ApiProperty()
  @Column()
  phone: string;

  @ApiProperty()
  @Column({ type: 'int' })
  car_parking_spaces: number;

  @ApiProperty()
  @Column({ type: 'int' })
  motorcycle_parking_spaces: number;

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
  @OneToMany(() => Vehicle, (vehicle) => vehicle.company)
  vehicles?: Vehicle[];

  @OneToOne(() => Address, (address) => address.company)
  @JoinColumn()
  address: Address;
}
