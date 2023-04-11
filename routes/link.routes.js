const { Router } = require('express');
const Link = require('../models/Link');
const config = require("config");
const shortId = require('shortid');
const auth = require('../middleware/auth.middleware');
const router = Router();

router.post(
    '/generate',
    auth,
    async (request, response) => {
    try {
        const baseUrl = config.get('baseUrl');
        const { from } = request.body;

        const code = shortId.generate();

        const existing = await Link.findOne({ from });

        if (existing) {
            return response.json({ link: existing });
        }

        const to = baseUrl + '/t/' + code;

        const link = new Link({
            code, from, to, owner: request.user.userId
        })

        await link.save();

        response.status(201).json({ link });

    } catch (error) {
        response.status(500).json({ message: 'Что-то пошло не так, попробуйте еще раз.' })
    }
});

router.get(
    '/',
    auth,
    async (request, response) => {
    try {
        const links = await Link.find({ owner: request.user.userId });
        response.json(links);
    } catch (error) {
        response.status(500).json({ message: 'Что-то пошло не так, попробуйте еще раз.' })
    }
});

router.get(
    '/:id',
    auth,
    async (request, response) => {
    try {
        const link = await Link.findById(request.params.id);
        response.json(link);
    } catch (error) {
        response.status(500).json({ message: 'Что-то пошло не так, попробуйте еще раз.' })
    }
});

module.exports = router;