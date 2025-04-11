import { AppDataSource } from '../config/ormconfig';
import request from 'supertest';
import { app } from '../index';
import { User } from '../models/User';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import nodemailer from 'nodemailer';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue({
            messageId: 'test-message-id',
            response: '250 OK'
        })
    }),
    getTestMessageUrl: jest.fn().mockReturnValue('http://test-url.com')
}));

describe('Auth Controller Tests', () => {
    let testUser: User;
    let testToken: string;

    beforeAll(async () => {
        try {
            if (!AppDataSource.isInitialized) {
                await AppDataSource.initialize();
            }
            
            await AppDataSource.dropDatabase();
            await AppDataSource.synchronize();
            
            const userRepository = AppDataSource.getRepository(User);
            const hashedPassword = await bcrypt.hash('testpassword', 10);
            
            testUser = userRepository.create({
                name: 'Test User',
                email: 'test@example.com',
                password: hashedPassword,
                documentType: 'CC',
                documentNumber: '123456789',
                role: 'Guest'
            });
            
            await userRepository.save(testUser);
            
            testToken = jwt.sign(
                { id: testUser.id, role: testUser.role },
                process.env.JWT_SECRET as string,
                { expiresIn: '30m' }
            );
        } catch (error) {
            console.error('Error en beforeAll:', error);
            throw error;
        }
    });

    afterAll(async () => {
        try {
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
            }
        } catch (error) {
            console.error('Error en afterAll:', error);
            throw error;
        }
    });

    describe('POST /auth/signup', () => {
        it('should create a new user', async () => {
            const newUser = {
                name: 'New User',
                email: 'newuser@example.com',
                password: 'password123',
                documentType: 'CC',
                documentNumber: '987654321',
                phone: '1234567890',
                birthDate: '1990-01-01',
                gender: 'M',
                address: 'Test Address',
                bio: 'Test Bio'
            };

            const response = await request(app)
                .post('/auth/signup')
                .send(newUser);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.');
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user.email).toBe(newUser.email);
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/auth/signup')
                .send({
                    name: 'Test User',
                    email: 'test@example.com'
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 if email already exists', async () => {
            const response = await request(app)
                .post('/auth/signup')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123',
                    documentType: 'CC',
                    documentNumber: '123456789'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('El correo ya está registrado');
        });
    });

    describe('POST /auth/signin', () => {
        it('should login successfully with correct credentials', async () => {
            const response = await request(app)
                .post('/auth/signin')
                .send({
                    email: 'test@example.com',
                    password: 'testpassword'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user.email).toBe('test@example.com');
        });

        it('should return 401 with incorrect credentials', async () => {
            const response = await request(app)
                .post('/auth/signin')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Credenciales incorrectas');
        });

        it('should return 400 if email or password is missing', async () => {
            const response = await request(app)
                .post('/auth/signin')
                .send({
                    email: 'test@example.com'
                });

            expect(response.status).toBe(400);
        });
    });

    describe('POST /auth/request-password-reset', () => {
        it('should send password reset email', async () => {
            const response = await request(app)
                .post('/auth/request-password-reset')
                .send({
                    email: 'test@example.com'
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Se ha enviado un enlace para reestablecer tu contraseña');
        });

        it('should return 404 if email not found', async () => {
            const response = await request(app)
                .post('/auth/request-password-reset')
                .send({
                    email: 'nonexistent@example.com'
                });

            expect(response.status).toBe(404);
        });
    });

    describe('POST /auth/reset-password', () => {
        it('should reset password successfully', async () => {
            // Primero obtener el token de reset
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({ where: { email: 'test@example.com' }});
            
            if (!user) throw new Error('User not found');

            const response = await request(app)
                .post('/auth/reset-password')
                .send({
                    token: user.resetPasswordToken,
                    newPassword: 'newpassword123'
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Contraseña actualizada exitosamente');
        });

        it('should return 400 with invalid token', async () => {
            const response = await request(app)
                .post('/auth/reset-password')
                .send({
                    token: 'invalidtoken',
                    newPassword: 'newpassword123'
                });

            expect(response.status).toBe(400);
        });
    });

    describe('POST /auth/logout', () => {
        it('should logout successfully', async () => {
            const response = await request(app)
                .post('/auth/logout')
                .set('Authorization', `Bearer ${testToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Sesión cerrada correctamente');
        });

        it('should return 401 without token', async () => {
            const response = await request(app)
                .post('/auth/logout');

            expect(response.status).toBe(401);
        });
    });

    describe('POST /auth/test-email', () => {
        it('should send test email successfully', async () => {
            const response = await request(app)
                .post('/auth/test-email')
                .send({
                    to: 'test@example.com'
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Correo enviado correctamente');
        });

        it('should return 400 if email is missing', async () => {
            const response = await request(app)
                .post('/auth/test-email')
                .send({});

            expect(response.status).toBe(400);
        });
    });
}); 