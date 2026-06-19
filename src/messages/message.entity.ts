import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Channel } from '../channels/channel.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  contenido: string;

  @CreateDateColumn()
  creadoEn: Date;

  @ManyToOne(() => User, user => user.messages, { nullable: false, onDelete: 'CASCADE' })
  sender: User;

  @ManyToOne(() => Channel, channel => channel.messages, { nullable: false, onDelete: 'CASCADE' })
  channel?: Channel;
}
