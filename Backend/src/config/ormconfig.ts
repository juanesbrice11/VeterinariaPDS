import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST, 
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ["src/models/*.ts"],
    synchronize: true,
    logging: false,
});

AppDataSource.initialize()
    .then(() => console.log("📌 Base de datos conectada correctamente"))
    .catch((err) => console.error("❌ Error al conectar la BD:", err));
