import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    BaseEntity,
} from 'typeorm';
import { Pet } from './pet';
import { User } from './User';

@Entity('medical_records')
export class MedicalRecord extends BaseEntity {
@PrimaryGeneratedColumn()
id: number;

@Column({ type: 'date' })
date: Date;

@Column('text')
description: string;

@Column()
procedureType: string; 

@ManyToOne(() => Pet)
pet: Pet;

@Column()
petId: number;

@ManyToOne(() => User)
veterinarian: User;

@Column()
veterinarianId: number;

@CreateDateColumn()
createdAt: Date;
}