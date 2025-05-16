import { AppDataSource } from '../config/ormconfig';
import { Appointment } from '../models/appointment';
import { MedicalRecord } from '../models/medicalRecord';
import { Notification } from '../models/notifications';
import { Pet } from '../models/pet';
import { User } from '../models/User';
import { sendEmail } from '../utils/sendEmail';
import { LessThan, MoreThan } from 'typeorm';

const HOURS_BEFORE_APPOINTMENT = 24;
const MONTHS_FOR_VACCINE = 12;
const MONTHS_FOR_HYGIENE = 3;

export const generateNotifications = async (): Promise<void> => {
    const now = new Date();

    const appointmentRepo = AppDataSource.getRepository(Appointment);
    const medicalRepo = AppDataSource.getRepository(MedicalRecord);
    const petRepo = AppDataSource.getRepository(Pet);
    const userRepo = AppDataSource.getRepository(User);
    const notifRepo = AppDataSource.getRepository(Notification);

    // 1. Recordatorio de citas en menos de 24h
    const limit = new Date(now.getTime() + HOURS_BEFORE_APPOINTMENT * 60 * 60 * 1000);

    const upcomingAppointments = await appointmentRepo.find({
        where: {
        appointmentDate: MoreThan(now),
        status: 'Pending'
        },
        relations: ['user', 'pet']
    });

    for (const appt of upcomingAppointments) {
        if (appt.appointmentDate <= limit) {
            const message = `Tienes una cita programada para ${appt.pet.name} el ${appt.appointmentDate.toLocaleString()}.`;
            const exists = await notifRepo.findOne({
                where: {
                    userId: appt.user.id,
                    petId: appt.pet.id,
                    type: 'Recordatorio cita',
                    message
                }
            });


            if (!exists) {
                const notif = notifRepo.create({
                    userId: appt.user.id,
                    petId: appt.pet.id,
                    type: 'Recordatorio cita',
                    message,
                    sentAt: new Date(),
                    isRead: false
                });
                await notifRepo.save(notif);

                await sendEmail(appt.user.email, 'Recordatorio de cita', `<p>${message}</p>`);
            }
        }   
    }

    // 2. Revisar vacunas (última vacuna > 12 meses)
    const vaccineLimit = new Date();
    vaccineLimit.setMonth(vaccineLimit.getMonth() - MONTHS_FOR_VACCINE);

    const vaccineRecords = await medicalRepo.find({
        where: {
            procedureType: 'vacuna',
            date: LessThan(vaccineLimit)
        },
        relations: ['pet', 'veterinarian']
    });

    for (const record of vaccineRecords) {
        const pet = await petRepo.findOne({ where: { id: record.petId }, relations: ['owner'] });
        if (!pet) continue;


        const user = await userRepo.findOne({ where: { id: pet.ownerId } });
        if (!user) continue;

        const message = `Han pasado más de ${MONTHS_FOR_VACCINE} meses desde la última vacuna de ${pet.name}.`;

        const exists = await notifRepo.findOne({ where: { userId: user.id, petId: pet.id, type: 'Vacuna', message } });
        if (!exists) {
            const notif = notifRepo.create({
                userId: user.id,
                petId: pet.id,
                type: 'Vacuna',
                message,
                sentAt: new Date(),
                isRead: false
            });
            await notifRepo.save(notif);
            await sendEmail(user.email, 'Recordatorio de vacunación', `<p>${message}</p>`);
        }
    }

    // 3. Revisar higiene (último baño o peluquería > 3 meses)
    const hygieneLimit = new Date();
    hygieneLimit.setMonth(hygieneLimit.getMonth() - MONTHS_FOR_HYGIENE);

    const hygieneRecords = await medicalRepo.find({
        where: {
            procedureType: 'baño',
            date: LessThan(hygieneLimit)
        },
        relations: ['pet']
    });

    for (const record of hygieneRecords) {
        const pet = await petRepo.findOne({ where: { id: record.petId }, relations: ['owner'] });
        if (!pet) continue;
        const user = await userRepo.findOne({ where: { id: pet.ownerId } });
        if (!user) continue;


        const message = `Han pasado más de ${MONTHS_FOR_HYGIENE} meses desde el último baño de ${pet.name}.`;

        const exists = await notifRepo.findOne({ where: { userId: user.id, petId: pet.id, type: 'Baño', message } });
        if (!exists) {
            const notif = notifRepo.create({
                userId: user.id,
                petId: pet.id,
                type: 'Baño',
                message,
                sentAt: new Date(),
                isRead: false
            });
            await notifRepo.save(notif);
            await sendEmail(user.email, 'Recordatorio de higiene', `<p>${message}</p>`);
        }
    }

    console.log('✔️ Revisión de notificaciones completada');
};  