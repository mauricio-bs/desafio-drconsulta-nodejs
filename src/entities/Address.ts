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

import { Company } from './Company';

@Entity({ name: 'address' })
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  country: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column({ type: 'int' })
  number: number;

  @Column({ nullable: true })
  complement?: string;

  @Column()
  zipcode: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;

  // Relations
  @OneToOne(() => Company, (company) => company.address)
  company: Company;
}
