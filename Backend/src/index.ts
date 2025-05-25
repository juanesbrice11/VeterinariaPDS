import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/ormconfig";
import routes from "./routes/index";
import dotenv from "dotenv";
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from "path";
import { startNotificationCron } from './schedulers/notifications.cron';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const swaggerDocument = YAML.load(path.resolve(__dirname, '../docs/swagger.yaml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas
app.use("/api", routes);

// Inicializar la conexión a la base de datos
const initializeApp = async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log("📌 Base de datos conectada correctamente");
        }
        
        // Iniciar el servidor
        app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
        
        // Iniciar el cron job después de que la base de datos esté conectada
        await startNotificationCron();
    } catch (error) {
        console.error("❌ Error en la conexión:", error);
        process.exit(1);
    }
};

// Solo inicializar la aplicación si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
    initializeApp();
}

export { app, initializeApp };