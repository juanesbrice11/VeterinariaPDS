import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BaseEntity
} from 'typeorm';
import { User } from './User';
import { Pet } from './pet';

@Entity('notifications')
export class Notification extends BaseEntity {
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

    @Column()
    type: string; // Vacuna, Baño, Cita

    @Column('text')
    message: string;

    @Column({ type: 'timestamp' })
    sentAt: Date;

    @Column({ default: false })
    isRead: boolean;
}