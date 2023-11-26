import { Column, Entity, JoinColumn, OneToOne, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import {  Cart } from './base.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdDate: Date

  @UpdateDateColumn()
  updatedDate: Date

  @Column()
  total_price: number;

  @OneToOne(() => Cart, (cart) => cart.order)
  @JoinColumn({name: "cart_id"})
  cart: Cart
}
