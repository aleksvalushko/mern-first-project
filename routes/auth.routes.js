const { Router } = require('express');
const bcrypt  = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');
const router = Router();

// /api/auth/registration
router.post(
    '/registration',
    [
        check('email', 'Неверный email.').isEmail(),
        check('password', 'Минимальная длина пароля - 6 символов.').isLength({ min: 6 })
    ],
    async (request, response) => {
    try {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.status(400).json({
                errors: errors.array(),
                message: 'Введены некорректные данные.'
            })
        }

        const { email, password } = request.body;

        const candidate = await User.findOne({ email });

        if (candidate) {
            response.status(400).json({ message: 'Этот пользователь уже существует.' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({ email, password: hashedPassword });

        await user.save();

        response.status(201).json({ message: 'Пользователь создан.' });

    } catch (error) {
        response.status(500).json({ message: 'Что-то пошло не так, попробуйте еще раз.' })
    }
});

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Введите корректный email.').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (request, response) => {
        try {
            const errors = validationResult(request);

            if (!errors.isEmpty()) {
                return response.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные пользователя.'
                })
            }

           const { email, password } = request.body;

            const user = await User.findOne({ email });

            if (!user) {
                return response.status(400).json({ message: 'Что-то пошло не так.' })
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return response.status(400).json({ message: 'Неверный пароль. Попробуйте еще раз.' })
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            );

            response.json({ token, id: user.id });

        } catch (error) {
            response.status(500).json({ message: 'Что-то пошло не так, попробуйте еще раз.' })
        }
});

module.exports = router;