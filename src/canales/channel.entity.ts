import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Server } from '../servidores/server.entity';
import { Message } from '../messages/message.entity';

@Entity('channels')
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ default: 'text' })
  tipo: string;

  @CreateDateColumn()
  creadoEn: Date;

  @ManyToOne(() => Server, server => server.channels, { nullable: false, onDelete: 'CASCADE' })
  server?: Server;

  @OneToMany(() => Message, message => message.channel, { eager: false })
  messages: Message[];
}
