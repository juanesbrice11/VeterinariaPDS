import { body } from 'express-validator';
import { AppDataSource } from '../config/ormconfig';
import { User } from '../models/User';

export const validateProfileUpdate = [
    body('email')
        .optional()
        .isEmail().withMessage('Debe proporcionar un correo electrónico válido.')
        .custom(async (email, { req }) => {
            const userRepository = AppDataSource.getRepository(User);
            const existingUser = await userRepository.findOne({ where: { email } });
            if (existingUser && existingUser.id !== req.user?.id) {
                throw new Error('El correo electrónico ya está en uso.');
            }
        }),
];

