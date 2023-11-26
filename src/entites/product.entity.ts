import { Column, Entity, ManyToMany, JoinTable, Index, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {  Cart, Category} from './base.entity';

@Entity()
export class Product {

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdDate: Date

  @UpdateDateColumn()
  updatedDate: Date

  @Index()
  @Column('varchar', { length: 500 })
  name: string;

  @Index()
  @Column('float')
  price: number;

  @Index()
  @Column('int')
  quantity: number;

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[]

  @ManyToMany(() => Cart, (cart) => cart.products)
  carts: Cart[]

}
