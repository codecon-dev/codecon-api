import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password?: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  provider: string;

  @Column({ nullable: true })
  providerId: string;
}
