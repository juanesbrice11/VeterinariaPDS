import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
} from 'typeorm';
import { User } from './User';

@Entity('pets')
export class Pet extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    species: string; 

    @Column({ nullable: true })
    breed: string;

    @Column({ nullable: true })
    color: string;

    @Column({ type: 'date', nullable: true })
    birthDate: Date;

    @Column({ nullable: true })
    gender: string; 

    @Column({ type: 'decimal', nullable: true })
    weight: number;

    @Column()
    ownerId: number;

    @ManyToOne(() => User, user => user.id)
    owner: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
