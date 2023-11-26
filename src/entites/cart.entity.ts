import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, Column, Entity, ManyToMany, OneToOne, ManyToOne, JoinColumn, JoinTable} from 'typeorm';
import {  Order, Product, User } from './base.entity';

@Entity()
export class Cart{
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[]

  @OneToOne(() => Order, (order) => order.cart)
  order: Order

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({name: 'user_id'})
  user: User
  
}
