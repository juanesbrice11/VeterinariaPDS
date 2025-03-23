import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/ormconfig";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
    .then(() => {
        app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
    })
    .catch((err) => console.error("❌ Error en la conexión:", err));
