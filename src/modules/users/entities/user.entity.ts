import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type AuthMethod = 'password' | 'magic-link' | 'google' | 'github';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Exclude()
  @Column({ nullable: true })
  password?: string;

  @Column('simple-array', { default: [] })
  authMethods: AuthMethod[];

  @Column({ nullable: true })
  provider?: string;

  @Column({ nullable: true })
  providerId?: string;
}
