import cron from 'node-cron';
import { generateNotifications } from '../services/notification.service';

// Todos los días a las 06:00 AM
export const startNotificationCron = () => {
    cron.schedule('0 6 * * *', async () => {
    console.log('⏰ Ejecutando job de notificaciones...');
    await generateNotifications();
    });
};