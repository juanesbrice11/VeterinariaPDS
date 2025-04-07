import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/ormconfig";
import routes from "./routes";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

const swaggerDocument = YAML.load(path.resolve(__dirname, '../docs/swagger.yaml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', routes);

const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
    .then(() => {
        app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
    })
    .catch((err) => console.error("❌ Error en la conexión:", err));
