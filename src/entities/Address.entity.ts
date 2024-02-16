import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Company } from './Company.entity';

@Entity({ name: 'address' })
export class Address extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  country: string;

  @ApiProperty()
  @Column()
  state: string;

  @ApiProperty()
  @Column()
  city: string;

  @ApiProperty()
  @Column()
  address: string;

  @ApiProperty()
  @Column({ type: 'int' })
  number: number;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  complement?: string;

  @ApiProperty()
  @Column()
  zipcode: string;

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
  @ApiProperty({ type: Company, nullable: true })
  @OneToOne(() => Company, (company) => company.address)
  company?: Company;
}
