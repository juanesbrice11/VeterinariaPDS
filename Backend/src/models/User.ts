import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BaseEntity } from "typeorm";
import * as bcrypt from "bcryptjs";

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

    @Column({ default: "Guest" })
    role: string;

    @Column({ default: "Active" })
    status: string;

    @BeforeInsert()
    async beforeInsertActions() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        if (this.email) {
            this.email = this.email.toLowerCase();
        }
    }
}
