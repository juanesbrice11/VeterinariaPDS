import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Crear un transporter para pruebas
const createTestTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: process.env.TEST_EMAIL_USER || 'test@example.com',
            pass: process.env.TEST_EMAIL_PASS || 'test123'
        }
    });
};

// Crear un transporter para producción
const createProdTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const transporter = process.env.NODE_ENV === 'test' 
            ? createTestTransporter() 
            : createProdTransporter();

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html
        });

        if (process.env.NODE_ENV === 'test') {
            console.log('Test email URL:', nodemailer.getTestMessageUrl(info));
        }

        return info;
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw error;
    }
};
