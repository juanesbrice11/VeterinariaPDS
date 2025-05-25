import cron from 'node-cron';
import { generateNotifications } from '../services/notification.service';
import { AppDataSource } from '../config/ormconfig';

// Ejecutar cada hora para asegurar que no se pierdan notificaciones
export const startNotificationCron = async () => {
    try {
        // Esperar a que la base de datos esté conectada
        if (!AppDataSource.isInitialized) {
            console.log('⏳ Esperando conexión a la base de datos...');
            await AppDataSource.initialize();
        }

        console.log('⏰ Iniciando programador de notificaciones...');
        
        // Ejecutar inmediatamente al iniciar
        console.log('🔄 Ejecutando primera verificación de notificaciones...');
        await generateNotifications();
        console.log('✅ Primera verificación completada');

        // Programar ejecución cada hora
        cron.schedule('0 * * * *', async () => {
            console.log('⏰ Ejecutando verificación programada de notificaciones...');
            try {
                await generateNotifications();
                console.log('✅ Verificación programada completada exitosamente');
            } catch (error) {
                console.error('❌ Error en la verificación programada:', error);
            }
        });

        console.log('✅ Programador de notificaciones iniciado correctamente');
    } catch (error) {
        console.error('❌ Error al iniciar el programador de notificaciones:', error);
    }
};