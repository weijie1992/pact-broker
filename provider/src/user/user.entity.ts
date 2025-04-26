import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity() // Marks it as a TypeORM entity
export class User {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;
}
