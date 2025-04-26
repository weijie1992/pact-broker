import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity() // Marks it as a TypeORM entity
export class User {
  // @PrimaryGeneratedColumn('increment', { generated: false }) // Allow manual IDs
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;
}
