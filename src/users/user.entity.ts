import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Server } from '../servers/server.entity';
import { Message } from '../messages/message.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Index()
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password?: string;

  @CreateDateColumn()
  creadoEn: Date;

  @OneToMany(() => Server, server => server.owner, { eager: false })
  serversOwned: Server[];

  @OneToMany(() => Message, message => message.sender, { eager: false })
  messages: Message[];
}
