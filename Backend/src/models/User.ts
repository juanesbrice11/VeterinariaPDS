import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
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
}
