import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST, 
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [path.join(__dirname, "../models/**/*.{ts,js}")],
    synchronize: process.env.NODE_ENV === 'test',
    logging: process.env.NODE_ENV === 'test',
    dropSchema: process.env.NODE_ENV === 'test',
    migrations: [],
    subscribers: [],
});

if (process.env.NODE_ENV !== 'test') {
    AppDataSource.initialize()
        .then(() => console.log("📌 Base de datos conectada correctamente"))
        .catch((err) => console.error("❌ Error al conectar la BD:", err));
}
