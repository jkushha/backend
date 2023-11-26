import { Column, Entity, ManyToMany, Index, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {  Product } from './base.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdDate: Date

  @UpdateDateColumn()
  updatedDate: Date

  @Index()
  @Column('varchar',{ length: 500 })
  name: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[]

}
