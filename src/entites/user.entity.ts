import { Column, Entity, OneToMany, BeforeInsert, Index , CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {  Cart} from './base.entity';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdDate: Date

  @UpdateDateColumn()
  updatedDate: Date

  @Column('varchar')
  firstName: string;

  @Column('varchar')
  lastName: string;

  @Index()
  @Column('varchar', {unique: true })
  userName: string;

  @Column()
  password: string;

  @Index()
  @Column({ default: 'user' })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[]

  @BeforeInsert()
  async hashPassword() {
    this.password =  await bcrypt.hash(this.password, parseInt(process.env.SALT_OR_ROUNDS));
  }

}
