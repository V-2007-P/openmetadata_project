const User = require('../models/User');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

router.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.redirect('/');
    } catch (err) {
        res.send("Error creating account. Username might be taken.");
    }
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username, password: req.body.password });
    if (user) res.redirect('/dashboard');
    else res.send("Invalid Credentials");
});

module.exports = router;