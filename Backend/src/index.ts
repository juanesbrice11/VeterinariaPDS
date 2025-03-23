import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/ormconfig";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
    .then(() => {
        console.log("📌 Base de datos conectada correctamente");
        console.log("✅ Tablas sincronizadas con TypeORM");
    })
    .catch((err) => {
        console.error("❌ Error en la conexión a la base de datos:", err);
    });

app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
