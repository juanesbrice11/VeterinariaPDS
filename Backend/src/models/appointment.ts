import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Pet } from './pet';
import { Service } from './Service';

@Entity('appointments')
export class Appointment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    user: User;

    @Column()
    userId: number;

    @ManyToOne(() => Pet)
    pet: Pet;

    @Column()
    petId: number;

    @ManyToOne(() => Service)
    service: Service;

    @Column()
    serviceId: number;

    @ManyToOne(() => User, { nullable: true })
    veterinarian: User;

    @Column({ nullable: true })
    veterinarianId: number;

    @Column({ type: 'timestamp' })
    appointmentDate: Date;

    @Column({ 
        type: 'enum',
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending'
    })
    status: 'Pending' | 'Completed' | 'Cancelled'; // Pending: cita futura, Completed: cita pasada o manualmente completada, Cancelled: cita cancelada

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}