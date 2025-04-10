import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: "CC" })
    documentType: string;

    @Column({ unique: true })
    documentNumber: string;

    @Column({ default: "Active" })
    status: string;

    @Column({ default: "Guest" })
    role: string;

    @Column({ nullable: true })
    phone: string ;

    @Column({ type: "date", nullable: true })
    birthDate: Date ;

    @Column({ nullable: true })
    gender: string ;

    @Column({ nullable: true })
    address: string ;

    @Column({ type: "text", nullable: true })
    bio: string ;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ nullable: true })
    verificationToken: string ;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ nullable: true })
    resetPasswordToken: string ;

    @Column({ type: "timestamp", nullable: true })
    resetPasswordTokenExpires: Date ;

    @Column({ type: "timestamp", nullable: true })
    lastLogin: Date;

}
