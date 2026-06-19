import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Channel } from '../channels/channel.entity';

@Entity('servers')
export class Server {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @CreateDateColumn()
  creadoEn: Date;

  @ManyToOne(() => User, user => user.serversOwned, { nullable: false, onDelete: 'CASCADE' })
  owner: User;

  @OneToMany(() => Channel, channel => channel.server, { eager: false })
  channels: Channel[];
}
